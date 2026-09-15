import useScrollProgress from "../../hooks/useScrollProgress";
import useReveal from "../../hooks/useReveal";

// ─── Content 

const STEPS = [
  {
    number: "01",
    phase: "Ideation & Submission",
    title: "Register Your Idea",
    desc: "Submit your team's concept and a proposed solution to a real world problem statement. Our review panel evaluates every entry and shortlists teams with the strongest, most innovative approaches. Shortlisted teams are notified directly with next step details.",
    tags: ["Team registration", "Problem domain selection", "Solution submission", "Shortlist announcement"],
    grand: false,
  },
  {
    number: "02",
    phase: "Pitching Round",
    title: "Demo & Pitch to Jury",
    desc: "Shortlisted teams present live before a panel of industry professionals. Your pitch must be clear, confident, and backed by a concrete build timeline. The strongest pitches advance to prototype development. Selected students move on to the next round.",
    tags: ["Live demonstration", "Project roadmap & timeline", "Jury Q&A session", "Top teams advance"],
    grand: false,
  },
  {
    number: "03",
    phase: "Progress Review",
    title: "MidPhase CheckIn",
    desc: "Halfway through the build, the jury reviews your prototype in progress. Show what's working, what's changed from your original proposal, and where you're headed. A guided checkpoint not a pass fail designed to help you reach the final in the strongest shape.",
    tags: ["Prototype walkthrough", "Jury & mentor feedback", "Course correction window", "Real time guidance"],
    grand: false,
  },
  {
    number: "04",
    phase: "Grand Finale",
    title: "Final Presentation & Awards",
    desc: "Your completed project takes center stage. Present a fully working solution to the grand jury. Winning teams receive a total ₹1,00,000 cash prize and a 3 month paid internship at KernEdge turning their solution into something real.",
    tags: ["Full working demo", "Grand jury evaluation", "₹1,00,000 cash prize", "3 month KernEdge internship"],
    grand: true,
  },
];

const NODE_X = [12.5, 37.5, 62.5, 87.5];

// Component 

export default function ProcessSection() {
  const { ref, progress } = useScrollProgress();
  const { ref: headRef, visible: headVisible } = useReveal(0.2);

  const linePercent = Math.min(progress * 100, 100);

  const nodeProgressFracs = NODE_X.map(x => x / 100); // [0.125, 0.375, 0.625, 0.875]
  const activeStep = nodeProgressFracs.reduce((acc, frac, i) => { return linePercent / 100 >= frac ? i : acc;}, -1);

  return (
    <section
      ref={ref}
      id="process"
      className="relative bg-ink"
      style={{ height: "380vh" }}
    >
      <div className="sticky top-0 h-screen flex flex-col overflow-hidden grid-backdrop">

        {/* ── Heading ──────────────────────────────────────────────────── */}
        <div
          ref={headRef}
          className={`reveal ${headVisible ? "is-visible" : ""} pt-20 pb-10 text-center px-6`}
        >
          <p className="font-mono-tag text-gold text-xs tracking-[0.3em] uppercase mb-3">
            How It Works
          </p>
          <h2
            className="font-display font-bold text-paper"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.1rem)", lineHeight: 1.1 }}
          >
            The KETS Process
          </h2>
        </div>

        {/* ── Timeline ─────────────────────────────────────────────────── */}
        <div className="relative w-full" style={{ height: 72, flexShrink: 0 }}>

          {/* Background track */}
          <div
            className="absolute left-0 right-0"
            style={{
              top: 14,
              height: 1,
              background: "rgba(247,246,242,0.08)",
            }}
          />

          {/* Animated gold fill the star of the show */}
          <div
            className="absolute left-0"
            style={{
              top: 14,
              height: 1,
              width: `${linePercent}%`,
              background: "#F2B705",
              transition: "width 120ms linear",
              boxShadow:
                "0 0 6px 1px rgba(242,183,5,0.7), 0 0 28px rgba(242,183,5,0.3)",
            }}
          />

          {/* Glowing tip dot that travels along the line */}
          <div
            className="absolute rounded-full"
            style={{
              top: 14,
              left: `${linePercent}%`,
              width: 8,
              height: 8,
              background: "#F2B705",
              transform: "translate(-50%, -50%)",
              boxShadow:
                "0 0 0 3px rgba(242,183,5,0.25), 0 0 14px rgba(242,183,5,0.8)",
              opacity: progress > 0.01 && progress < 0.99 ? 1 : 0,
              transition: "left 120ms linear, opacity 0.4s ease",
            }}
          />

          {/* Nodes */}
          {STEPS.map((step, i) => {
            const passed = linePercent >= NODE_X[i] - 0.6;
            const active = activeStep === i;

            return (
              <div
                key={i}
                className="absolute flex flex-col items-center"
                style={{
                  left: `${NODE_X[i]}%`,
                  top: 0,
                  transform: "translateX(-50%)",
                }}
              >
                {/* Node circle */}
                <div
                  style={{
                    width: active ? 18 : passed ? 13 : 10,
                    height: active ? 18 : passed ? 13 : 10,
                    borderRadius: "50%",
                    marginTop: active ? 5 : passed ? 7.5 : 9,
                    background: passed ? "#F2B705" : "transparent",
                    border: `2px solid ${passed ? "#F2B705" : "rgba(247,246,242,0.2)"}`,
                    transition: "all 0.45s cubic-bezier(0.22,1,0.36,1)",
                    boxShadow: active
                      ? "0 0 0 5px rgba(242,183,5,0.18), 0 0 24px rgba(242,183,5,0.5)"
                      : passed
                      ? "0 0 10px rgba(242,183,5,0.25)"
                      : "none",
                  }}
                />

                {/* Step number */}
                <p
                  className="font-mono-tag text-xs mt-2"
                  style={{
                    color: passed ? "#F2B705" : "rgba(247,246,242,0.2)",
                    transition: "color 0.4s ease",
                  }}
                >
                  {step.number}
                </p>

                {/* Phase name hidden on small screens to prevent overlap */}
                <p
                  className="hidden md:block text-xs mt-0.5 whitespace-nowrap"
                  style={{
                    color: active
                      ? "rgba(247,246,242,0.75)"
                      : passed
                      ? "rgba(247,246,242,0.35)"
                      : "rgba(247,246,242,0.12)",
                    transition: "color 0.4s ease",
                  }}
                >
                  {step.phase}
                </p>
              </div>
            );
          })}
        </div>

        {/* ── Content area ─────────────────────────────────────────────── */}
        <div className="relative flex-1 overflow-hidden">
          {STEPS.map((step, i) => {
            const isActive = activeStep === i;
            return (
              <div
                key={i}
                className="absolute inset-0 flex flex-col justify-center px-6 md:px-20"
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: isActive
                    ? "translateY(0)"
                    : activeStep > i
                    ? "translateY(-24px)"
                    : "translateY(24px)",
                  transition:
                    "opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1)",
                  pointerEvents: isActive ? "auto" : "none",
                }}
              >
                <div style={{ maxWidth: 600 }}>

                  {/* Phase badge */}
                  <div className="flex items-center gap-3 mb-5">
                    <span
                      style={{
                        display: "inline-block",
                        width: 28,
                        height: 1,
                        background: step.grand
                          ? "#F2B705"
                          : "rgba(247,246,242,0.3)",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      className="font-mono-tag text-xs tracking-widest uppercase"
                      style={{
                        color: step.grand
                          ? "#F2B705"
                          : "rgba(247,246,242,0.45)",
                      }}
                    >
                      Phase {step.number} &mdash; {step.phase}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    className={`font-display font-bold mb-5 ${step.grand ? "text-gold-gradient" : "text-paper"}`}
                    style={{
                      fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
                      lineHeight: 1.1,
                    }}
                  >
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p
                    className="leading-relaxed mb-7"
                    style={{
                      color: "rgba(247,246,242,0.62)",
                      fontSize: "clamp(0.95rem, 1.6vw, 1.1rem)",
                      maxWidth: 520,
                    }}
                  >
                    {step.desc}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {step.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs md:text-sm px-3 py-1.5 rounded-full"
                        style={{
                          border: `1px solid ${
                            step.grand
                              ? "rgba(242,183,5,0.45)"
                              : "rgba(247,246,242,0.12)"
                          }`,
                          color: step.grand
                            ? "#F2B705"
                            : "rgba(247,246,242,0.62)",
                          background: step.grand
                            ? "rgba(242,183,5,0.07)"
                            : "rgba(247,246,242,0.04)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Scroll hint visible only on first step ──────────────────── */}
        <div
          className="pb-8 flex justify-center"
          style={{
            opacity: progress < 0.05 ? 1 : 0,
            transition: "opacity 0.5s ease",
          }}
        >
          <div className="flex flex-col items-center gap-1.5">
            <span
              className="font-mono-tag text-xs tracking-widest"
              style={{ color: "rgba(247,246,242,0.3)" }}
            >
              scroll to explore
            </span>
            <svg
              width="16"
              height="24"
              viewBox="0 0 16 24"
              fill="none"
              style={{ opacity: 0.3 }}
            >
              <rect
                x="1"
                y="1"
                width="14"
                height="22"
                rx="7"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <circle className="scroll-wheel" cx="8" cy="7" r="2" fill="currentColor">
                <animate
                  attributeName="cy"
                  values="7;14;7"
                  dur="1.8s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="1;0;1"
                  dur="1.8s"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
