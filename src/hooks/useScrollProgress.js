import { useEffect, useRef, useState } from "react";

/**
 * Tracks scroll progress (0 → 1) across the pinned height of a section.
 *
 * Usage: give the returned `ref` to a section that is TALLER than the
 * viewport (e.g. height: 260vh) and contains a `sticky top-0 h-screen`
 * inner wrapper. As the user scrolls through that extra height, progress
 * goes from 0 (section just reached the top) to 1 (section about to
 * release the pin).
 *
 * `reducedMotion` mirrors the user's OS-level motion preference so
 * callers can render a static fallback instead of animating.
 */
// Manual escape hatch: append ?motion=on or ?motion=off to the URL to
// force the animated/static path regardless of the OS-level "reduce
// motion" setting. Handy for previewing the scroll animation on a
// machine (or screen recorder) that has that accessibility setting on,
// without having to change system settings. Leave the param off and
// the site behaves exactly as before, honoring the real user preference.
function getMotionOverride() {
  if (typeof window === "undefined") return null;
  const v = new URLSearchParams(window.location.search).get("motion");
  if (v === "on") return false; // force reducedMotion = false
  if (v === "off") return true; // force reducedMotion = true
  return null;
}

export default function useScrollProgress() {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(() => {
    const override = getMotionOverride();
    if (override !== null) return override;
    return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (getMotionOverride() !== null) {
      if (import.meta.env?.DEV) {
        console.info(
          `[useScrollProgress] ?motion=${new URLSearchParams(window.location.search).get("motion")} override active — ignoring the OS "reduce motion" setting.`
        );
      }
      return; // override wins; don't let the OS setting change it
    }
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    if (import.meta.env?.DEV && mq.matches) {
      console.info(
        '[useScrollProgress] System "reduce motion" is ON, so the static fallback is rendering instead of the scroll animation. Add ?motion=on to the URL to preview the animated version.'
      );
    }
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          const total = rect.height - window.innerHeight;
          const scrolled = -rect.top;
          const p = total > 0 ? Math.min(Math.max(scrolled / total, 0), 1) : 0;
          setProgress(p);
        }
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [reducedMotion]);

  return { ref, progress, reducedMotion };
}
