import useReveal from "../../hooks/useReveal";
import kernedgeLogo from "../../../public/kernedge-logo.jpg";
import { CONTACT } from "../../config";

const PILLARS = [
  { label: "Mission", text: "Empower students with practical knowledge, industry exposure, and innovative learning experiences to make them job-ready." },
  { label: "Vision", text: "Become a leading platform in education and technology, delivering high-quality training and impactful solutions in healthcare and engineering." },
  { label: "Approach", text: "Hands-on learning with experienced mentors, real-world projects, and career-oriented programs designed around outcomes, not attendance." },
];

const TRACKS = [
  "Biomedical & Medical", "CSE / IT", "ECE / Embedded Systems",
  "IoT Applications", "VLSI", "EEE Programs", "AI / ML / Data Science",
  "Full Stack Development",
];

export default function Organizers() {
  const { ref: headRef, visible: headVisible } = useReveal(0.2);
  const { ref: pillarsRef, visible: pillarsVisible } = useReveal(0.15);
  const { ref: tracksRef, visible: tracksVisible } = useReveal(0.15);
  const { ref: coRef, visible: coVisible } = useReveal(0.2);

  return (
    <section id="organizers" className="relative bg-paper text-ink py-24 md:py-32 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        <div ref={headRef} className={`reveal ${headVisible ? "is-visible" : ""} grid md:grid-cols-[auto_1fr] gap-6 md:gap-10 items-center mb-14 md:mb-16`}>
          <img src={kernedgeLogo} alt="Kernedge Pvt. Ltd." className="h-16 md:h-20 w-auto rounded-md border border-ink/10" />
          <div>
            <p className="text-ink/55 text-sm md:text-base">Organized by</p>
            <h2 className="font-display font-bold leading-tight" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}>
              Kernedge Pvt. Ltd.
            </h2>
            <p className="text-gold-deep font-medium mt-1">Empowering Learning Through Innovation</p>
          </div>
        </div>

        <div ref={pillarsRef} className={`reveal reveal-delay-1 ${pillarsVisible ? "is-visible" : ""} grid sm:grid-cols-3 gap-6 mb-16`}>
          {PILLARS.map((p) => (
            <div key={p.label} className="border border-ink/10 rounded-xl p-6 bg-white/60">
              <p className="font-mono-tag text-xs tracking-[0.2em] uppercase text-gold-deep mb-3">{p.label}</p>
              <p className="text-ink/75 text-sm leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>

        <div ref={tracksRef} className={`reveal reveal-delay-2 ${tracksVisible ? "is-visible" : ""} mb-16`}>
          <p className="text-ink/60 mb-4 text-sm md:text-base">
            Kernedge runs internship, training, and mentorship programs across —
          </p>
          <div className="flex flex-wrap gap-3">
            {TRACKS.map((t) => (
              <span key={t} className="px-4 py-2 rounded-full border border-ink/15 text-sm text-ink/80 hover:border-gold-deep hover:text-gold-deep transition-colors">
                {t}
              </span>
            ))}
          </div>
          <a
            href="https://kernedge.netlify.app/"
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-6 text-sm font-medium text-gold-deep underline underline-offset-4"
          >
            Learn more about Kernedge
          </a>
        </div>

        {/* co-organizer + contact strip */}
        <div
          ref={coRef}
          className={`reveal reveal-delay-3 ${coVisible ? "is-visible" : ""} border-t border-ink/10 pt-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8`}
        >
          <div>
            <p className="text-ink/55 text-sm">In partnership with</p>
            <p className="font-display font-semibold text-xl">Startup Community Coimbatore</p>
            <p className="text-ink/60 text-sm mt-1 max-w-md">
              Bringing the region's founder and startup ecosystem in to mentor teams, sharpen ideas, and connect
              winners with what comes after the hackathon.
            </p>
          </div>
          <div className="text-sm text-ink/70 space-y-1.5">
            <p><a href={`mailto:${CONTACT.email}`} className="hover:text-gold-deep">{CONTACT.email}</a></p>
            <p><a href={CONTACT.instagram} target="_blank" rel="noreferrer" className="hover:text-gold-deep">@kernedge_</a></p>
            <p>{CONTACT.phones[0]}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
