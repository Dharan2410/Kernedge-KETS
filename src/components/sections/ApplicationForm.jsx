import { useEffect, useMemo, useState } from "react";
import useReveal from "../../hooks/useReveal";
import DOMAINS from "../../data/problemStatements";
import { GOOGLE_SCRIPT_URL } from "../../config";

const EMPTY_FORM = {
  teamName: "",
  leaderName: "",
  collegeName: "",
  gmail: "",
  phone: "",
  domain: "",
  problemStatement: "",
  approachType: "video",
  videoLink: "",
  description: "",
};

const GMAIL_RE = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
const PHONE_RE = /^(\+91[\s-]?)?[6-9]\d{9}$/;
const DESCRIPTION_LIMIT = 1000;

export default function ApplicationForm({ prefillDomain }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [statusMessage, setStatusMessage] = useState("");
  const { ref: headRef, visible: headVisible } = useReveal(0.2);
  const { ref: cardRef, visible: cardVisible } = useReveal(0.1);

  // "Adjusting state when a prop changes" is meant to happen during
  // render, not inside an effect — comparing against the last-seen
  // prefillDomain lets us call setState conditionally on this pass
  // without cascading into an extra render. The actual DOM side effect
  // (focusing the field) stays in its own effect below.
  const [lastPrefill, setLastPrefill] = useState(prefillDomain);
  if (prefillDomain !== lastPrefill) {
    setLastPrefill(prefillDomain);
    if (prefillDomain) {
      setForm((f) => ({ ...f, domain: prefillDomain, problemStatement: "" }));
    }
  }

  useEffect(() => {
    if (prefillDomain) {
      document.getElementById("apply-domain")?.focus({ preventScroll: true });
    }
  }, [prefillDomain]);

  const selectedDomain = useMemo(
    () => DOMAINS.find((d) => d.id === form.domain) || null,
    [form.domain]
  );

  const update = (key) => (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const handleDomainChange = (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, domain: value, problemStatement: "" }));
    setErrors((er) => ({ ...er, domain: undefined, problemStatement: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.teamName.trim()) e.teamName = "Enter your team name.";
    if (!form.leaderName.trim()) e.leaderName = "Enter the team leader's name.";
    if (!form.collegeName.trim()) e.collegeName = "Enter your college name.";
    if (!GMAIL_RE.test(form.gmail.trim())) e.gmail = "Enter a valid @gmail.com address.";
    if (!PHONE_RE.test(form.phone.trim())) e.phone = "Enter a valid 10-digit Indian phone number.";
    if (!form.domain) e.domain = "Select a problem domain.";
    if (!form.problemStatement) e.problemStatement = "Select a problem statement.";
    if (form.approachType === "video") {
      if (!/^https?:\/\/.+/.test(form.videoLink.trim())) e.videoLink = "Paste a valid Google Drive link (starting with https://).";
    } else {
      if (!form.description.trim()) e.description = "Describe your solution.";
      if (form.description.length > DESCRIPTION_LIMIT) e.description = `Keep it under ${DESCRIPTION_LIMIT} characters.`;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (!validate()) return;

    if (!GOOGLE_SCRIPT_URL) {
      setStatus("error");
      setStatusMessage(
        "The submission sheet isn't connected yet. Add the deployed Apps Script URL to src/config.js (see README.md)."
      );
      return;
    }

    const alreadySubmitted = localStorage.getItem(`kets26_submitted_${form.gmail.trim().toLowerCase()}`);
    if (alreadySubmitted) {
      setStatus("error");
      setStatusMessage("This email has already submitted a solution. Only one submission is allowed per team.");
      return;
    }

    setStatus("submitting");
    setStatusMessage("");

    const payload = {
      teamName: form.teamName.trim(),
      leaderName: form.leaderName.trim(),
      collegeName: form.collegeName.trim(),
      gmail: form.gmail.trim().toLowerCase(),
      phone: form.phone.trim(),
      problemDomain: selectedDomain?.title || form.domain,
      problemStatement: form.problemStatement,
      approachType: form.approachType,
      videoLink: form.approachType === "video" ? form.videoLink.trim() : "",
      description: form.approachType === "description" ? form.description.trim() : "",
      submittedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({ status: "success" }));

      if (data.status === "error") {
        setStatus("error");
        setStatusMessage(data.message || "That team has already submitted a solution.");
        return;
      }

      localStorage.setItem(`kets26_submitted_${payload.gmail}`, "1");
      setStatus("success");
      setStatusMessage("Your solution is in. Our team will reach out on the email you provided.");
      setForm(EMPTY_FORM);
    } catch (err) {
      console.error(err);
      setStatus("error");
      setStatusMessage("Couldn't reach the submission sheet right now. Please try again in a moment.");
    }
  };

  // Solid light background + a visible border, and full-opacity text —
  // no low-alpha tints that a browser's dark color-scheme can wash out.
  const inputClass =
    "w-full bg-white border border-ink/20 rounded-lg px-4 py-3 text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-gold-deep/60 focus:border-gold-deep/60 transition-shadow disabled:bg-ink/5 disabled:text-ink/40";

  return (
    <section id="apply" className="relative bg-paper text-ink py-24 md:py-32 px-6 md:px-10">
      <div className="max-w-3xl mx-auto">
        <div ref={headRef} className={`reveal ${headVisible ? "is-visible" : ""} text-center mb-12`}>
          <h2 className="font-display font-bold leading-[1.05]" style={{ fontSize: "clamp(2.1rem, 4.6vw, 3.2rem)" }}>
            Register your team
          </h2>
          <p className="mt-4 text-ink/60 max-w-xl mx-auto">
            One submission per team, tied to your leader's email. Fill this in once you've picked a domain above.
          </p>
        </div>

        <form
          ref={cardRef}
          onSubmit={handleSubmit}
          // Force light-mode native form-control rendering here regardless
          // of the site's global dark color-scheme, so inputs/selects
          // never inherit a dark browser-drawn background.
          style={{ colorScheme: "light" }}
          className={`reveal reveal-delay-1 ${cardVisible ? "is-visible" : ""} bg-white border border-ink/10 rounded-2xl p-6 md:p-10 space-y-6`}
        >
          <div className="grid sm:grid-cols-2 gap-6">
            <Field label="Team name" error={errors.teamName}>
              <input className={inputClass} value={form.teamName} onChange={update("teamName")} placeholder="e.g. Circuit Breakers" />
            </Field>
            <Field label="Team leader name" error={errors.leaderName}>
              <input className={inputClass} value={form.leaderName} onChange={update("leaderName")} placeholder="Full name" />
            </Field>
          </div>

          <Field label="College name" error={errors.collegeName}>
            <input className={inputClass} value={form.collegeName} onChange={update("collegeName")} placeholder="Your college / institution" />
          </Field>

          <div className="grid sm:grid-cols-2 gap-6">
            <Field label="Gmail ID" error={errors.gmail} hint="Used to identify your team — one submission per email.">
              <input className={inputClass} type="email" value={form.gmail} onChange={update("gmail")} placeholder="team@gmail.com" />
            </Field>
            <Field label="Phone number" error={errors.phone}>
              <input className={inputClass} type="tel" value={form.phone} onChange={update("phone")} placeholder="98765 43210" />
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <Field label="Problem domain" error={errors.domain}>
              <select id="apply-domain" className={inputClass} value={form.domain} onChange={handleDomainChange}>
                <option value="">Choose a problem domain</option>
                {DOMAINS.map((d) => (
                  <option key={d.id} value={d.id}>{d.code} — {d.title}</option>
                ))}
              </select>
            </Field>

            <Field label="Problem statement" error={errors.problemStatement}>
              <select
                className={inputClass}
                value={form.problemStatement}
                onChange={update("problemStatement")}
                disabled={!selectedDomain}
              >
                <option value="">
                  {selectedDomain ? "Choose a problem statement" : "Choose a domain first"}
                </option>
                {selectedDomain?.problems.map((p) => (
                  <option key={p.title} value={p.title}>{p.title}</option>
                ))}
              </select>
            </Field>
          </div>

          <fieldset className="border border-ink/10 rounded-xl p-5">
            <legend className="px-2 text-sm font-medium text-ink/70">Your solution / approach</legend>

            <div className="flex gap-6 mb-4 text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="approachType"
                  checked={form.approachType === "video"}
                  onChange={() => setForm((f) => ({ ...f, approachType: "video" }))}
                  className="accent-gold-deep"
                />
                2-minute video (Drive link)
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="approachType"
                  checked={form.approachType === "description"}
                  onChange={() => setForm((f) => ({ ...f, approachType: "description" }))}
                  className="accent-gold-deep"
                />
                Written description
              </label>
            </div>

            {form.approachType === "video" ? (
              <Field error={errors.videoLink} hint="Upload a 2-minute pitch to Google Drive, set sharing to 'Anyone with the link', then paste it here.">
                <input className={inputClass} value={form.videoLink} onChange={update("videoLink")} placeholder="https://drive.google.com/..." />
              </Field>
            ) : (
              <Field error={errors.description} hint={`${form.description.length}/${DESCRIPTION_LIMIT} characters`}>
                <textarea
                  className={`${inputClass} min-h-[140px] resize-y`}
                  value={form.description}
                  onChange={update("description")}
                  maxLength={DESCRIPTION_LIMIT}
                  placeholder="Describe the problem you're solving, your approach, and why it works..."
                />
              </Field>
            )}
          </fieldset>

          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full py-3.5 rounded-full bg-gold-deep text-ink font-semibold hover:bg-gold transition-colors disabled:opacity-60"
          >
            {status === "submitting" ? "Submitting..." : "Submit solution"}
          </button>

          {status === "success" && (
            <p className="text-sm text-center text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg py-3 px-4">
              {statusMessage}
            </p>
          )}
          {status === "error" && (
            <p className="text-sm text-center text-red-700 bg-red-50 border border-red-200 rounded-lg py-3 px-4">
              {statusMessage}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

function Field({ label, error, hint, children }) {
  return (
    <label className="block">
      {label && <span className="block text-sm font-medium text-ink/70 mb-1.5">{label}</span>}
      {children}
      {error ? (
        <span className="block text-xs text-red-600 mt-1.5">{error}</span>
      ) : hint ? (
        <span className="block text-xs text-ink/45 mt-1.5">{hint}</span>
      ) : null}
    </label>
  );
}