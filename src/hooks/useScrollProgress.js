import { useEffect, useRef, useState } from "react";

/**
 * Tracks scroll progress (0 -> 1) across the pinned height of a section.
 *
 * Give the returned `ref` to a section that is TALLER than the viewport
 * (e.g. height: 300vh) and contains a `sticky top-0 h-screen` inner
 * wrapper. As the user scrolls through that extra height, progress goes
 * from 0 (section just reached the top) to 1 (about to release the pin).
 *
 * `reducedMotion` is always false — animation runs the same way for every
 * visitor/browser, regardless of OS-level motion preferences.
 *
 * `holdZones`: optional [start, end] progress ranges (0-1) where the
 * displayed progress freezes for `holdMs` once entered, so a fully
 * revealed moment survives a moment of scrolling instead of flashing by.
 * Only forward progress is held; scrolling back out is immediate.
 */
export default function useScrollProgress({ holdZones = [], holdMs = 900 } = {}) {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);
  // Always animated — not gated behind the OS-level `prefers-reduced-motion`
  // preference, so behavior is identical for every visitor/browser.
  const [reducedMotion] = useState(false);

  const holdRef = useRef({ zoneIndex: -1, startTime: 0, frozenAt: 0 });

  const holdZonesKey = JSON.stringify(holdZones);
  useEffect(() => {
    if (reducedMotion) return;
    let ticking = false;
    let timeoutId = null;

    const resolveProgress = (rawP) => {
      const hold = holdRef.current;
      const now = performance.now();
      const zoneIdx = holdZones.findIndex(([s, e]) => rawP >= s && rawP < e);

      if (zoneIdx === -1) {
        hold.zoneIndex = -1;
        return rawP;
      }
      if (hold.zoneIndex !== zoneIdx) {
        hold.zoneIndex = zoneIdx;
        hold.startTime = now;
        hold.frozenAt = Math.max(rawP, holdZones[zoneIdx][0]);
      }
      const elapsed = now - hold.startTime;
      if (elapsed < holdMs) {
        if (!timeoutId) {
          timeoutId = window.setTimeout(() => {
            timeoutId = null;
            handleScroll();
          }, holdMs - elapsed + 16);
        }
        return hold.frozenAt;
      }
      return rawP;
    };

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          const total = rect.height - window.innerHeight;
          const scrolled = -rect.top;
          const rawP = total > 0 ? Math.min(Math.max(scrolled / total, 0), 1) : 0;
          setProgress(resolveProgress(rawP));
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
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [reducedMotion, holdMs, holdZonesKey]);

  return { ref, progress, reducedMotion };
}