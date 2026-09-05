import useScrollProgress from "../../hooks/useScrollProgress";

/**
 * NOTE: Replace the placeholder entries below with the real team —
 * name, role, and (optionally) an imported photo passed as `image`.
 * Entries without an `image` fall back to an initials frame.
 */
const PEOPLE = [
  { name: "Full Name", role: "Faculty Coordinator", image: null },
  { name: "Full Name", role: "Event Director", image: null },
  { name: "Full Name", role: "Technical Lead", image: null },
  { name: "Full Name", role: "Design Lead", image: null },
  { name: "Full Name", role: "Operations Lead", image: null },
  { name: "Full Name", role: "Outreach Lead", image: null },
];

const HEADING_PHASE = 0.1;
const SMALL_SCALE = 0.4;
const BIG_SCALE = 1.22;
// Resting spots pulled further out from center than before, so the
// stacked pile never visually collides with the card currently zoomed
// into the middle.
const REST_X = 10;
const CENTER_X = 50;

const lerp = (a, b, t) => a + (b - a) * t;

// Deterministic "messy pile" offsets so the stacks don't look
// perfectly arranged — each card peeks out a little from the next.
function stackVisual(i, side) {
  const dir = side === "left" ? -1 : 1;
  return {
    rotate: dir * (((i % 5) - 2) * 3.4),
    offsetX: dir * ((i % 4) * 6),
    offsetY: (i % 3) * 8 - 8,
  };
}

function initials(name) {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

function PersonCard({ person, style, big }) {
  return (
    <div
      className="absolute top-1/2 left-0 w-[200px] md:w-[230px] rounded-2xl p-3 bg-white flex flex-col items-center border"
      style={{
        boxShadow: big
          ? "0 30px 60px -12px rgba(0,0,0,0.28), 0 8px 20px -6px rgba(0,0,0,0.12)"
          : "0 12px 28px rgba(0,0,0,0.10)",
        borderColor: big ? "rgba(0,0,0,0.08)" : "rgba(0,0,0,0.05)",
        ...style,
      }}
    >
      <div
        className="w-full aspect-square rounded-xl overflow-hidden flex items-center justify-center"
        style={{
          background: person.image ? "transparent" : "linear-gradient(135deg, #00E5FF33, #FF3EA533)",
        }}
      >
        {person.image ? (
          <img src={person.image} alt={person.name} className="w-full h-full object-cover" />
        ) : (
          <span className="font-display text-2xl md:text-3xl font-bold text-black/80">
            {initials(person.name)}
          </span>
        )}
      </div>
      <div className="mt-3 text-center">
        <p className="text-black font-medium text-sm md:text-base">{person.name}</p>
        <p className="text-black/55 text-xs md:text-sm mt-0.5">{person.role}</p>
      </div>
    </div>
  );
}

export default function OurPeople() {
  const { ref, progress, reducedMotion } = useScrollProgress();
  const n = PEOPLE.length;

  if (reducedMotion) {
    return (
      <section id="our-people" className="w-full px-6 md:px-10 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-black mb-10">
            Our people
          </h2>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {PEOPLE.map((p) => (
              <div key={p.name + p.role} className="relative shrink-0" style={{ width: 220, height: 280 }}>
                <PersonCard person={p} style={{ position: "static", transform: "none" }} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // heading: quick shrink, same scale-only technique as RevealSection
  // so it can never get clipped off the edge of the screen.
  const ht = Math.min(progress / HEADING_PHASE, 1);
  const headLeft = lerp(50, 6, ht);
  const headTop = lerp(40, 7, ht);
  const headTx = lerp(-50, 0, ht);
  const headTy = lerp(-50, 0, ht);
  const headScale = lerp(1.2, 1, ht);

  const stageProgress = Math.max(progress - HEADING_PHASE, 0) / (1 - HEADING_PHASE);
  const personWindow = 1 / n;

  return (
    <section
      id="our-people"
      ref={ref}
      className="relative"
      style={{ height: `${80 + n * 42}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div
          className="absolute pointer-events-none z-20"
          style={{
            left: `${headLeft}%`,
            top: `${headTop}%`,
            transform: `translate(${headTx}%, ${headTy}%) scale(${headScale})`,
            transformOrigin: "left top",
            transition: "left 60ms linear, top 60ms linear, transform 60ms linear",
          }}
        >
          <h2
            className="font-display font-bold text-black px-6 md:px-0"
            style={{ fontSize: "clamp(2rem, 5.2vw, 3.75rem)", lineHeight: 1.08 }}
          >
            Our people
          </h2>
        </div>

        <div className="relative w-full h-full max-w-6xl mx-auto">
          {PEOPLE.map((person, i) => {
            const pStart = i * personWindow;
            const localP = Math.min(Math.max((stageProgress - pStart) / personWindow, 0), 1);
            const isBefore = stageProgress <= pStart;
            const isAfter = stageProgress >= pStart + personWindow;

            // Reversed from the original: cards now enter from the
            // RIGHT resting pile, zoom through center, and exit to the
            // LEFT resting pile — mirror image of the old left-to-right
            // motion.
            let x, scale, rotate, offsetX, offsetY, z;

            if (isBefore) {
              const v = stackVisual(i, "right");
              x = 100 - REST_X;
              scale = SMALL_SCALE;
              rotate = v.rotate;
              offsetX = v.offsetX;
              offsetY = v.offsetY;
              z = 10 + i;
            } else if (isAfter) {
              const v = stackVisual(i, "left");
              x = REST_X;
              scale = SMALL_SCALE;
              rotate = v.rotate;
              offsetX = v.offsetX;
              offsetY = v.offsetY;
              z = 10 + i;
            } else if (localP <= 0.5) {
              const t = localP / 0.5;
              const v = stackVisual(i, "right");
              x = lerp(100 - REST_X, CENTER_X, t);
              scale = lerp(SMALL_SCALE, BIG_SCALE, t);
              rotate = lerp(v.rotate, 0, t);
              offsetX = lerp(v.offsetX, 0, t);
              offsetY = lerp(v.offsetY, 0, t);
              z = 100;
            } else {
              const t = (localP - 0.5) / 0.5;
              const v = stackVisual(i, "left");
              x = lerp(CENTER_X, REST_X, t);
              scale = lerp(BIG_SCALE, SMALL_SCALE, t);
              rotate = lerp(0, v.rotate, t);
              offsetX = lerp(0, v.offsetX, t);
              offsetY = lerp(0, v.offsetY, t);
              z = 100;
            }

            const isBig = scale > SMALL_SCALE + (BIG_SCALE - SMALL_SCALE) * 0.5;

            return (
              <PersonCard
                key={person.name + person.role}
                person={person}
                big={isBig}
                style={{
                  left: `${x}%`,
                  zIndex: z,
                  transform: `translate(-50%, -50%) translate(${offsetX}px, ${offsetY}px) scale(${scale}) rotate(${rotate}deg)`,
                  transition: "transform 60ms linear, left 60ms linear",
                }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
