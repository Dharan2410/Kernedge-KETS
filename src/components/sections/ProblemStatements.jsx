import { useState } from "react";
import useReveal from "../../hooks/useReveal";
import DOMAINS from "../../data/problemStatements";
import DomainModal from "./DomainModal";

const STICKY_STEP = 16; // px each successive card's sticky offset increases by
const STICKY_BASE = 96; // px, clears the navbar
const WRAPPER_HEIGHT_VH = 88; // scroll room each card gets before the next takes over

function DomainCard({ domain, index, onOpen }) {
  const { ref, visible } = useReveal(0.35);
  return (
    // The outer box supplies the extra scroll height a sticky child needs
    // in order to visibly "hold" in place — without it, sticky has
    // nothing to stick against and the stacking illusion never happens.
    <div className="relative" style={{ height: `${WRAPPER_HEIGHT_VH}vh` }}>
      <div
        className="sticky px-4"
        style={{ top: `${STICKY_BASE + index * STICKY_STEP}px`, zIndex: 10 + index }}
      >
        <div ref={ref} className={`reveal-card ${visible ? "is-visible" : ""} max-w-4xl mx-auto`}>
          <button
            onClick={() => onOpen(domain)}
            className="w-full text-left bg-charcoal border border-white/10 hover:border-gold/50 rounded-2xl p-6 md:p-9 transition-colors shadow-[0_30px_60px_-24px_rgba(0,0,0,0.7)]"
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="font-mono-tag text-gold text-sm">
                  {domain.code} / {String(DOMAINS.length).padStart(2, "0")}
                </p>
                <h3 className="font-display font-bold text-paper mt-2" style={{ fontSize: "clamp(1.3rem, 3vw, 1.9rem)" }}>
                  {domain.title}
                </h3>
                <p className="text-paper/60 mt-2 text-sm md:text-base max-w-xl">{domain.blurb}</p>
              </div>
              <span className="hidden sm:flex shrink-0 w-11 h-11 rounded-full border border-gold/40 text-gold items-center justify-center text-lg">
                +
              </span>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {domain.problems.slice(0, 4).map((p) => (
                <span key={p.title} className="text-xs md:text-sm px-3 py-1.5 rounded-full bg-white/5 text-paper/70">
                  {p.title}
                </span>
              ))}
              {domain.problems.length > 4 && (
                <span className="text-xs md:text-sm px-3 py-1.5 rounded-full bg-gold/10 text-gold">
                  +{domain.problems.length - 4} more
                </span>
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProblemStatements({ onApplyDomain }) {
  const [openDomain, setOpenDomain] = useState(null);
  const { ref: headingRef, visible: headingVisible } = useReveal(0.3);

  const handleApply = (domainId) => {
    setOpenDomain(null);
    onApplyDomain(domainId);
    requestAnimationFrame(() => {
      document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" });
    });
  };

  return (
    <section id="domains" className="relative bg-ink py-24 md:py-16">
      <div className="max-w-4xl mx-auto px-6 md:px-4 mb-14 md:mb-20">
        <div ref={headingRef} className={`reveal ${headingVisible ? "is-visible" : ""}`}>
          <h2 className="font-display font-bold text-paper leading-[1.05]" style={{ fontSize: "clamp(2.1rem, 4.6vw, 3.4rem)" }}>
            Problem domains
          </h2>
          <p className="mt-5 text-paper/65 text-base md:text-lg max-w-2xl">
            Twelve tracks drawn straight from the KETS '26 brief. Open a domain to see every problem statement
            inside it, then apply against the one your team wants to solve.
          </p>
        </div>
      </div>

      <div className="relative">
        {DOMAINS.map((domain, i) => (
          <DomainCard key={domain.id} domain={domain} index={i} onOpen={setOpenDomain} />
        ))}
      </div>

      <DomainModal
        key={openDomain?.id ?? "none"}
        domain={openDomain}
        onClose={() => setOpenDomain(null)}
        onApply={handleApply}
      />
    </section>
  );
}