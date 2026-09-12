import { useEffect, useState } from "react";

function ProblemRow({ problem, index, isOpen, onToggle }) {
  return (
    <li className="border-b border-white/5 last:border-b-0">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-start gap-3 text-left py-4 group"
      >
        <span className="font-mono-tag text-gold/70 text-xs mt-1 shrink-0">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="flex-1 text-paper/90 text-sm md:text-base leading-relaxed group-hover:text-gold transition-colors">
          {problem.title}
        </span>
        <span
          className="shrink-0 text-gold/60 text-lg leading-none mt-0.5 transition-transform duration-300"
          style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
        >
          +
        </span>
      </button>
      <div
        className="overflow-hidden transition-all duration-300 ease-out"
        style={{ maxHeight: isOpen ? "260px" : "0px" }}
      >
        <p className="pl-8 pb-5 pr-6 text-paper/60 text-sm leading-relaxed border-l-2 border-gold/30 ml-1">
          {problem.description}
        </p>
      </div>
    </li>
  );
}

export default function DomainModal({ domain, onClose, onApply }) {
  const [openIndex, setOpenIndex] = useState(null);

  // Guarded on `domain` so this never runs (and never locks page scroll)
  // while the modal isn't actually open. The parent also remounts this
  // component with a fresh `key` per domain, so `openIndex` naturally
  // starts at null each time — no separate reset effect needed.
  useEffect(() => {
    if (!domain) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [domain, onClose]);

  if (!domain) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center px-4 py-8"
      style={{ background: "rgba(5,5,5,0.78)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-charcoal border border-gold/20 rounded-2xl p-7 md:p-9"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center text-paper/60 hover:text-gold hover:bg-white/5 transition-colors"
        >
          ✕
        </button>

        <p className="font-mono-tag text-gold text-sm">{domain.code}</p>
        <h3 className="font-display font-bold text-paper mt-1" style={{ fontSize: "clamp(1.5rem, 3.4vw, 2.2rem)" }}>
          {domain.title}
        </h3>
        <p className="text-paper/60 mt-2 text-sm md:text-base">{domain.blurb}</p>
        <p className="text-paper/35 text-xs mt-4 uppercase tracking-[0.2em] font-mono-tag">
          Click a problem to read the full brief
        </p>

        <ul className="mt-4">
          {domain.problems.map((problem, i) => (
            <ProblemRow
              key={problem.title}
              problem={problem}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex((cur) => (cur === i ? null : i))}
            />
          ))}
        </ul>

        <button
          onClick={() => onApply(domain.id)}
          className="mt-8 w-full sm:w-auto px-6 py-3 rounded-full bg-gold text-ink font-semibold text-sm hover:bg-gold-pale transition-colors"
        >
          Apply for this domain
        </button>
      </div>
    </div>
  );
}