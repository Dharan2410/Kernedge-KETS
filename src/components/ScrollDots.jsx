import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "what-is-kets", label: "Overview" },
  { id: "why-kets", label: "Motivation" },
  { id: "what-makes-different", label: "Differentiators" },
  { id: "our-vision", label: "Mission" },
  { id: "organised-by", label: "Credits" },
  { id: "our-people", label: "People" },
];

/**
 * A quiet vertical rail on the right edge (desktop only) showing which
 * section is currently in view, and letting people jump straight to
 * one. Purely a navigation aid — it doesn't drive or alter any of the
 * fade timing in RevealSection.
 */
export default function ScrollDots() {
  const [active, setActive] = useState(SECTIONS[0].id);

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean);
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-4">
      {SECTIONS.map((s) => {
        const isActive = active === s.id;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" })}
            className="group flex items-center gap-3"
            aria-label={`Jump to ${s.label}`}
            aria-current={isActive}
          >
            <span
              className={`text-[11px] uppercase tracking-wide text-black/50 whitespace-nowrap transition-opacity duration-200 ${
                isActive ? "opacity-100" : "opacity-0 group-hover:opacity-70"
              }`}
            >
              {s.label}
            </span>
            <span
              className={`block rounded-full transition-all duration-200 ${
                isActive ? "w-2.5 h-2.5 bg-black" : "w-1.5 h-1.5 bg-black/25 group-hover:bg-black/50"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
