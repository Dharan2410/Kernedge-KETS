import useScrollProgress from "../../hooks/useScrollProgress";
import PEOPLE from "../../data/people";

const HEADING_PHASE = 0.1;
const SMALL_SCALE = 0.4;
const BIG_SCALE = 1.35;
const REST_X = 10;
const CENTER_X = 50;

const lerp = (a, b, t) => a + (b - a) * t;

// Deterministic "messy pile" offsets so the stacks read as a real pile
// of cards rather than a perfectly tiled row.
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
      className="absolute top-1/2 left-0 w-[220px] md:w-[270px] rounded-2xl p-3 bg-ink flex flex-col items-center border"
      style={{
        boxShadow: big
          ? "0 30px 70px -14px rgba(242,183,5,0.25), 0 10px 24px -6px rgba(0,0,0,0.5)"
          : "0 12px 28px rgba(0,0,0,0.4)",
        borderColor: big ? "rgba(242,183,5,0.4)" : "rgba(255,255,255,0.08)",
        ...style,
      }}
    >
      <div
        className="w-[82%] md:w-[76%] aspect-[4/4.6] rounded-xl overflow-hidden flex items-center justify-center mx-auto"
        style={{
          background: person.image ? "transparent" : "linear-gradient(135deg, #F2B70522, #F2B70508)",
        }}
      >
        {person.image ? (
          <img
            src={person.image}
            alt={person.name}
            className="w-full h-full object-cover object-center"
            style={{ objectPosition: "center 25%" }}
          />
        ) : (
          <span className="font-display text-2xl md:text-3xl font-bold text-gold">
            {initials(person.name)}
          </span>
        )}
      </div>
      <div className="mt-3 text-center">
        <p className="text-paper font-medium text-sm md:text-base">{person.name}</p>
        <p className="text-paper/50 text-xs md:text-sm mt-0.5">{person.role}</p>
      </div>
    </div>
  );
}

const n = PEOPLE.length;
export default function OurPeople() {
  const personWindowFrac = 1 / n;
  const holdZones = PEOPLE.map((_, i) => {
    const stageStart = i * personWindowFrac + 0.32 * personWindowFrac;
    const stageEnd = i * personWindowFrac + 0.68 * personWindowFrac;
    return [
      HEADING_PHASE + stageStart * (1 - HEADING_PHASE),
      HEADING_PHASE + stageEnd * (1 - HEADING_PHASE),
    ];
  });
  const { ref, progress, reducedMotion } = useScrollProgress({ holdZones, holdMs: 900 });

  if (reducedMotion) {
    return (
      <section id="team" className="w-full bg-ink px-6 md:px-10 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-paper mb-10">Our people</h2>
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

  const ht = Math.min(progress / HEADING_PHASE, 1);
  const headLeft = lerp(50, 6, ht);
  const headTopPct = lerp(40, 0, ht);
  const headTopPx = lerp(0, 96, ht);
  const headTx = lerp(-50, 0, ht);
  const headTy = lerp(-50, 0, ht);
  const headScale = lerp(1.2, 1, ht);

  const stageProgress = Math.max(progress - HEADING_PHASE, 0) / (1 - HEADING_PHASE);
  const personWindow = personWindowFrac;

  return (
    <section id="team" ref={ref} className="relative bg-ink" style={{ height: `${80 + n * 32}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden grid-backdrop">
        <div
          className="absolute pointer-events-none z-20"
          style={{
            left: `${headLeft}%`,
            top: `calc(${headTopPct}% + ${headTopPx}px)`,
            transform: `translate(${headTx}%, ${headTy}%) scale(${headScale})`,
            transformOrigin: "left top",
            transition: "left 60ms linear, top 60ms linear, transform 60ms linear",
          }}
        >
          <h2
            className="font-display font-bold text-paper px-6 md:px-0"
            style={{ fontSize: "clamp(2rem, 5.2vw, 3.75rem)", lineHeight: 1.08 }}
          >
            Our people
          </h2>
        </div>

        <div
          className="relative w-full h-full max-w-6xl mx-auto"
          style={{ opacity: ht, transition: "opacity 60ms linear" }}
        >
          {PEOPLE.map((person, i) => {
            const pStart = i * personWindow;
            const localP = Math.min(Math.max((stageProgress - pStart) / personWindow, 0), 1);
            const isBefore = stageProgress <= pStart;
            const isAfter = stageProgress >= pStart + personWindow;

            let x, scale, rotate, offsetX, offsetY, z;

            if (isBefore) {
              const v = stackVisual(i, "right");
              x = 100 - REST_X;
              scale = SMALL_SCALE;
              rotate = v.rotate;
              offsetX = v.offsetX;
              offsetY = v.offsetY;
              // Whoever animates soonest (smallest i, among those still
              // waiting) sits on TOP of the right-hand pile, so cards peel
              // off the front of the stack in order instead of emerging
              // from underneath everyone still behind them.
              z = 10 + (n - i);
            } else if (isAfter) {
              const v = stackVisual(i, "left");
              x = REST_X;
              scale = SMALL_SCALE;
              rotate = v.rotate;
              offsetX = v.offsetX;
              offsetY = v.offsetY;
              z = 10 + i;
            } else if (localP <= 0.32) {
              const t = localP / 0.32;
              const v = stackVisual(i, "right");
              x = lerp(100 - REST_X, CENTER_X, t);
              scale = lerp(SMALL_SCALE, BIG_SCALE, t);
              rotate = lerp(v.rotate, 0, t);
              offsetX = lerp(v.offsetX, 0, t);
              offsetY = lerp(v.offsetY, 0, t);
              z = 100;
            } else if (localP <= 0.68) {
              x = CENTER_X;
              scale = BIG_SCALE;
              rotate = 0;
              offsetX = 0;
              offsetY = 0;
              z = 100;
            } else {
              const t = (localP - 0.68) / 0.32;
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