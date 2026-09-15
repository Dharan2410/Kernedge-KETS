import { useRef, useState } from "react";
import useReveal from "../../hooks/useReveal";
import { PRIZE_AMOUNT } from "../../config";

const PHASES = [
  { code: "01", label: "Ideation & Proposal" },
  { code: "02", label: "Prototype Development" },
  { code: "03", label: "Final Demonstration" },
];

export default function PrizeSection() {
  const wrapRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [settled, setSettled] = useState(false);
  const { ref: copyRef, visible: copyVisible } = useReveal(0.2);
  const { ref: coinRef, visible: coinVisible } = useReveal(0.3);

  const handleMove = (e) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -14, y: px * 18 });
  };
  const handleLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <section id="prize" className="relative bg-ink py-28 md:py-36 px-6 md:px-10 overflow-hidden">
      <style>{`
        @keyframes coin-breathe {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }
        @keyframes coin-shine {
          0%   { background-position: -40% -40%; }
          100% { background-position: 140% 140%; }
        }
        @keyframes ring-pulse {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.06); }
        }

        /* fade the whole plaque in as it scrolls into view */
        .coin-stage {
          opacity: 0;
          transform: scale(0.75);
          transition: opacity 0.4s ease, transform 0.4s ease;
        }
        .coin-stage.is-visible {
          opacity: 1;
          transform: scale(1);
        }

        /* the literal 1s spin, on its own layer so it never fights the
           mouse-tilt transform or the idle breathing animation */
        .coin-spin {
          transform-style: preserve-3d;
          backface-visibility: hidden;
        }
        .coin-spin.spin {
          animation: coin-spin-in 1s cubic-bezier(0.45, 0, 0.2, 1) forwards;
        }
        @keyframes coin-spin-in {
          0%   { transform: rotateY(0deg) scale(0.85); }
          60%  { transform: rotateY(720deg) scale(1.05); }
          100% { transform: rotateY(1080deg) scale(1); }
        }

        /* amount text only appears once the spin has finished */
        .coin-amount {
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.45s ease, transform 0.45s ease;
        }
        .coin-amount.show {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      {/* backdrop glow */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: 780, height: 780,
          background: "radial-gradient(circle, rgba(242,183,5,0.16) 0%, rgba(242,183,5,0) 68%)",
          animation: "ring-pulse 5s ease-in-out infinite",
        }}
      />

      <div className="relative max-w-6xl mx-auto grid lg:grid-cols-[1fr_1.1fr] gap-16 items-center">
        {/* ---- copy side ---- */}
        <div ref={copyRef} className={`reveal ${copyVisible ? "is-visible" : ""} text-center lg:text-left`}>
          <h2 className="font-display font-bold text-paper leading-[1.05]" style={{ fontSize: "clamp(2.1rem, 4.6vw, 3.4rem)" }}>
            Build for real stakes.
          </h2>
          <p className="mt-5 text-paper/70 text-base md:text-lg leading-relaxed max-w-md mx-auto lg:mx-0">
            KETS '26 puts a ₹{PRIZE_AMOUNT} cash prize pool behind the teams who take a real problem statement
            furthest from a rough proposal to a working prototype that a jury of industry mentors can actually
            put through its paces.
          </p>

          <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-3">
            {PHASES.map((p) => (
              <span
                key={p.code}
                className="flex items-center gap-2 border border-paper/15 rounded-full px-4 py-2 text-sm text-paper/70"
              >
                <span className="font-mono-tag text-gold text-xs">{p.code}</span>
                {p.label}
              </span>
            ))}
          </div>
        </div>

        {/* ---- prize plaque ---- */}
        <div
          ref={coinRef}
          className={`coin-stage ${coinVisible ? "is-visible" : ""}`}
          style={{ perspective: "1400px" }}
        >
          <div
            className={`coin-spin ${coinVisible ? "spin" : ""}`}
            onAnimationEnd={() => setSettled(true)}
          >
            <div
              className="flex justify-center items-center select-none"
              style={{ perspective: "1400px" }}
              ref={wrapRef}
              onMouseMove={handleMove}
              onMouseLeave={handleLeave}
            >
              <div
                className="relative rounded-[40px] flex flex-col items-center justify-center text-ink brackets"
                style={{
                  width: "min(78vw, 380px)",
                  maxWidth: "100%",
                  aspectRatio: "1 / 1",
                  background: "linear-gradient(155deg, #FFE28A 0%, #F2B705 55%, #C98F00 100%)",
                  boxShadow:
                    "0 30px 70px -20px rgba(242,183,5,0.45), 0 14px 34px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,0,0,0.06) inset",
                  transform: `translateY(0) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                  transition: "transform 220ms ease-out",
                  animation: settled ? "coin-breathe 6s ease-in-out infinite" : "none",
                }}
              >
                <div className="absolute inset-0 rounded-[40px] overflow-hidden pointer-events-none">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage:
                        "linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.55) 50%, transparent 65%)",
                      backgroundSize: "260% 260%",
                      backgroundPosition: "-40% -40%",
                      animation: "coin-shine 3.4s ease-in-out infinite",
                      animationDelay: "1s",
                    }}
                  />
                </div>

                <div className={`coin-amount relative flex flex-col items-center ${settled ? "show" : ""}`}>
                  <p className="font-mono-tag text-[11px] md:text-xs tracking-[0.3em] uppercase opacity-70">
                    Cash Prize Pool
                  </p>
                  <p
                    className="font-display font-bold leading-none mt-2"
                    style={{
                      fontSize: "clamp(2rem, 7vw, 3.1rem)",
                      textShadow: "0 1px 0 #fff8, 0 2px 4px rgba(0,0,0,0.25)",
                    }}
                  >
                    ₹{PRIZE_AMOUNT}
                  </p>
                  <p className="mt-2 text-xs md:text-sm font-medium opacity-75">for winning teams</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}