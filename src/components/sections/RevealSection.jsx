import useScrollProgress from "../../hooks/useScrollProgress";

const clamp01 = (v) => Math.min(Math.max(v, 0), 1);

// Phase boundaries, as a fraction of this section's own pin range:
//   0 ────────▶ HEAD_IN  ▶  LINES_IN  ▶  HOLD  ▶  LINES_OUT  ▶ HEAD_OUT ────────▶ 1
//   heading      lines in,     fully        lines out,        heading
//   fades in     staggered     visible      staggered          fades out
const HEAD_IN_END = 0.08;
const LINES_IN_END = 0.42;
const HOLD_END = 0.58;
const LINES_OUT_END = 0.86;
// heading fade-out runs from LINES_OUT_END to 1.

/**
 * Pure fade — no scale, no translate, no slide. The whole point of this
 * pass is that content should only ever fade in and fade out as you
 * scroll; nothing moves or zooms. Shared by every RevealSection.
 */
function fadeOpacity(progress, inEnd, outStart) {
  if (progress < 0) return 0;
  if (progress < inEnd) return progress / inEnd;
  if (progress < outStart) return 1;
  const outEnd = outStart + (1 - outStart); // fades out over whatever's left
  return 1 - clamp01((progress - outStart) / (outEnd - outStart));
}

export function PinnedHeading({ heading, opacity, className = "", center = false, eyebrow }) {
  return (
    <div style={{ opacity, transition: "opacity 100ms linear" }} className={className}>
      {eyebrow && (
        <p
          className={`flex items-center gap-2 text-xs md:text-sm font-medium uppercase tracking-[0.18em] text-black/45 mb-3 ${
            center ? "justify-center" : ""
          }`}
        >
          <span className="w-4 h-px bg-kets-magenta/70" />
          {eyebrow}
        </p>
      )}
      <h2
        className={`font-display font-bold text-black ${center ? "text-center" : ""}`}
        style={{ fontSize: "clamp(2.1rem, 4.4vw, 3.4rem)", lineHeight: 1.1 }}
      >
        {heading}
      </h2>
    </div>
  );
}

/**
 * lines: array of { type: 'p' | 'li' | 'node', content: ReactNode }
 *
 * maxWidth / textWidth / variant / align — see previous notes; unchanged
 * from the layout pass. What's new here is purely the motion model:
 * heading and lines each fade in, hold, then fade out — line by line,
 * not as one paragraph block — before the next section's heading ever
 * appears. Nothing translates or scales.
 */
export default function RevealSection({
  id,
  eyebrow,
  heading,
  lines,
  height = "220vh",
  maxWidth = "max-w-3xl",
  textWidth = null,
  variant = "card",
  align = "left",
}) {
  const { ref, progress, reducedMotion } = useScrollProgress();
  const center = align === "center";
  const isCard = variant === "card";

  if (reducedMotion) {
    return (
      <section id={id} className="w-full px-6 md:px-10 py-16 md:py-24">
        <div
          className={`${maxWidth} mx-auto ${center ? "text-center" : ""} ${
            isCard
              ? "rounded-3xl bg-white border border-black/[0.05] shadow-[0_20px_55px_-24px_rgba(15,15,20,0.22)] px-6 md:px-12 py-10 md:py-14"
              : ""
          }`}
        >
          {eyebrow && (
            <p className={`flex items-center gap-2 text-xs md:text-sm font-medium uppercase tracking-[0.18em] text-black/45 mb-3 ${center ? "justify-center" : ""}`}>
              <span className="w-4 h-px bg-kets-magenta/70" />
              {eyebrow}
            </p>
          )}
          <h2 className="font-display text-3xl md:text-5xl font-bold text-black mb-8">{heading}</h2>
          <div className={`space-y-4 ${textWidth ? `${textWidth} ${center ? "mx-auto" : ""}` : ""}`}>
            {lines.map((line, i) => (
              <LineContent key={i} line={line} center={center} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const headOpacity = fadeOpacity(progress, HEAD_IN_END, LINES_OUT_END);

  const linesInWindow = LINES_IN_END - HEAD_IN_END;
  const linesOutWindow = LINES_OUT_END - HOLD_END;
  const n = Math.max(lines.length, 1);
  const inStep = (linesInWindow / n) * 0.75;
  const inDur = Math.max((linesInWindow / n) * 1.3, 0.02);
  const outStep = (linesOutWindow / n) * 0.75;
  const outDur = Math.max((linesOutWindow / n) * 1.3, 0.02);

  return (
    <section id={id} ref={ref} className="relative" style={{ height }}>
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        <div className={`w-full ${maxWidth} mx-auto px-6 md:px-10`}>
          <PinnedHeading
            heading={heading}
            eyebrow={eyebrow}
            opacity={headOpacity}
            center={center}
            className={isCard ? "mb-6 md:mb-8" : "mb-8 md:mb-10"}
          />

          <div
            className={
              isCard
                ? "rounded-3xl bg-white border border-black/[0.05] shadow-[0_20px_55px_-24px_rgba(15,15,20,0.22)] px-6 md:px-10 py-8 md:py-10"
                : ""
            }
          >
            <div
              className={`space-y-4 md:space-y-5 ${center ? "text-center" : ""} ${
                textWidth ? `${textWidth} ${center ? "mx-auto" : ""}` : ""
              }`}
            >
              {lines.map((line, i) => {
                const inEnd = HEAD_IN_END + i * inStep + inDur;
                const outStart = HOLD_END + i * outStep;
                const opacity = fadeOpacityLine(
                  progress,
                  HEAD_IN_END + i * inStep,
                  inEnd,
                  outStart,
                  outStart + outDur
                );
                return (
                  <div key={i} style={{ opacity, transition: "opacity 90ms linear" }}>
                    <LineContent line={line} center={center} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Per-line fade: rises 0→1 across [inStart,inEnd], holds at 1, falls
// 1→0 across [outStart,outEnd]. No transform — opacity only.
function fadeOpacityLine(progress, inStart, inEnd, outStart, outEnd) {
  if (progress <= inStart) return 0;
  if (progress < inEnd) return (progress - inStart) / (inEnd - inStart);
  if (progress < outStart) return 1;
  if (progress < outEnd) return 1 - (progress - outStart) / (outEnd - outStart);
  return 0;
}

function LineContent({ line, center = false }) {
  if (line.type === "node") return line.content;
  if (line.type === "li") {
    return (
      <p className="text-black text-base md:text-lg leading-relaxed flex gap-3">
        <span className="mt-2.5 block w-1.5 h-1.5 rounded-full shrink-0 bg-kets-magenta" />
        <span>{line.content}</span>
      </p>
    );
  }
  return (
    <p className={`text-black/70 text-base md:text-lg leading-relaxed ${center ? "text-center" : ""}`}>
      {line.content}
    </p>
  );
}
