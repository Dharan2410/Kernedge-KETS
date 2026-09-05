import { useEffect, useRef, useState } from "react";

/**
 * A scroll-into-view reveal for content that's too long to fit a
 * pinned viewport (e.g. a multi-item list). Each item fades in with a
 * stagger as the block enters the viewport, and fades back out —
 * same stagger order, no translate/movement, opacity only — as it
 * leaves the viewport in either direction. Keeps observing (doesn't
 * disconnect after the first reveal), so the fade-out on the way past
 * actually happens instead of the block just getting cut off.
 */
export default function FadeUpList({ items, columns = 2 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const reducedMotionRef = useRef(
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (reducedMotionRef.current) return; // already fully visible, nothing to observe

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.15, rootMargin: "-10% 0px -10% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`grid grid-cols-1 ${columns === 2 ? "md:grid-cols-2" : ""} gap-x-10 gap-y-5`}
    >
      {items.map((item, i) => (
        <p
          key={i}
          className="text-black text-base md:text-lg leading-relaxed flex gap-3"
          style={{
            opacity: visible ? 1 : 0,
            transition: `opacity 420ms ease ${i * 90}ms`,
          }}
        >
          <span className="mt-2 block w-1.5 h-1.5 rounded-full shrink-0 bg-kets-magenta" />
          <span>{item}</span>
        </p>
      ))}
    </div>
  );
}
