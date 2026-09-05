import { useEffect, useRef, useState } from "react";

/**
 * KETS'26 — Welcome Hero
 * Full-viewport animated welcome screen with a bouncing toy mascot.
 * After a short beat, it shrinks upward (bottom edge rising to meet the top)
 * and settles into the site's fixed navbar.
 *
 * Usage: <WelcomeHero /> — mount it once at the top of your single-page app.
 * Everything else on the page should render below/behind it; it is
 * position:fixed so it will sit on top during the intro, then get out
 * of the way (as a slim navbar) once it shrinks.
 */

const HOLD_MS = 2200; // how long the full welcome screen stays before shrinking
const SHRINK_MS = 900; // shrink animation duration
const NAV_HEIGHT = 72; // px, final collapsed height

const NAV_LINKS = [];

export default function WelcomeHero() {
  const [phase, setPhase] = useState("intro"); // intro -> shrinking -> nav
  const containerRef = useRef(null);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("shrinking"), HOLD_MS);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (phase !== "shrinking") return;
    const t2 = setTimeout(() => setPhase("nav"), SHRINK_MS);
    return () => clearTimeout(t2);
  }, [phase]);

  const isIntro = phase === "intro";
  const isShrinking = phase === "shrinking";
  const isNav = phase === "nav";

  return (
    <>
      {/* Fonts + keyframes */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Outfit:wght@400;500&display=swap');

        @keyframes floatBob {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }
        @keyframes waveArm {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-22deg); }
          50% { transform: rotate(0deg); }
          75% { transform: rotate(-14deg); }
        }
        @keyframes blinkEyes {
          0%, 92%, 100% { transform: scaleY(1); }
          96% { transform: scaleY(0.1); }
        }
        @keyframes antennaGlow {
          0%, 100% { opacity: 0.55; filter: blur(2px); }
          50% { opacity: 1; filter: blur(0.5px); }
        }
        @keyframes titleIn {
          from { opacity: 0; transform: translateY(18px); letter-spacing: 0.02em; }
          to { opacity: 1; transform: translateY(0); letter-spacing: normal; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes drift {
          0% { transform: translate(0,0) scale(1); }
          50% { transform: translate(20px,-30px) scale(1.08); }
          100% { transform: translate(0,0) scale(1); }
        }
      `}</style>

      <div
        ref={containerRef}
        className="fixed top-0 left-0 w-full overflow-hidden z-50 flex flex-col"
        style={{
          height: isIntro ? "100vh" : isShrinking ? `${NAV_HEIGHT}px` : `${NAV_HEIGHT}px`,
          transition: `height ${SHRINK_MS}ms cubic-bezier(0.65, 0, 0.35, 1)`,
          background: "linear-gradient(160deg, #0B0B2E 0%, #1B0F3D 45%, #2A0944 100%)",
          fontFamily: "'Outfit', sans-serif",
        }}
      >
        {/* ambient glow blobs — hidden once collapsed to nav */}
        {!isNav && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ opacity: isIntro ? 1 : 0, transition: `opacity ${SHRINK_MS * 0.6}ms ease` }}
          >
            <div
              className="absolute rounded-full"
              style={{
                width: 420,
                height: 420,
                left: "8%",
                top: "18%",
                background: "radial-gradient(circle, rgba(0,229,255,0.28) 0%, rgba(0,229,255,0) 70%)",
                animation: "drift 9s ease-in-out infinite",
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width: 460,
                height: 460,
                right: "6%",
                bottom: "10%",
                background: "radial-gradient(circle, rgba(255,62,165,0.25) 0%, rgba(255,62,165,0) 70%)",
                animation: "drift 11s ease-in-out infinite reverse",
              }}
            />
          </div>
        )}

        {/* ---- INTRO / SHRINKING CONTENT ---- */}
        {!isNav && (
          <div
            className="flex-1 flex flex-col items-center justify-center px-6"
            style={{
              opacity: isShrinking ? 0 : 1,
              transform: isShrinking ? "scale(0.92) translateY(10px)" : "scale(1)",
              transition: `opacity ${SHRINK_MS * 0.55}ms ease, transform ${SHRINK_MS * 0.55}ms ease`,
            }}
          >
            {/* --- Toy mascot (SVG) --- */}
            <div style={{ animation: "floatBob 3.2s ease-in-out infinite" }}>
              <svg width="150" height="170" viewBox="0 0 150 170" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* antenna */}
                <line x1="75" y1="10" x2="75" y2="34" stroke="#FFC93C" strokeWidth="4" strokeLinecap="round" />
                <circle cx="75" cy="8" r="8" fill="#FFC93C" style={{ animation: "antennaGlow 1.8s ease-in-out infinite", transformOrigin: "75px 8px" }} />

                {/* head */}
                <rect x="30" y="34" width="90" height="70" rx="26" fill="#FF3EA5" />
                <rect x="30" y="34" width="90" height="70" rx="26" fill="url(#headShine)" opacity="0.35" />

                {/* eyes */}
                <g style={{ animation: "blinkEyes 4.5s ease-in-out infinite", transformOrigin: "center" }}>
                  <circle cx="58" cy="66" r="9" fill="#0B0B2E" />
                  <circle cx="92" cy="66" r="9" fill="#0B0B2E" />
                  <circle cx="61" cy="63" r="3" fill="#FFFFFF" />
                  <circle cx="95" cy="63" r="3" fill="#FFFFFF" />
                </g>

                {/* smile */}
                <path d="M58 84 Q75 96 92 84" stroke="#0B0B2E" strokeWidth="4" strokeLinecap="round" fill="none" />

                {/* cheeks */}
                <circle cx="44" cy="80" r="5" fill="#FFC93C" opacity="0.55" />
                <circle cx="106" cy="80" r="5" fill="#FFC93C" opacity="0.55" />

                {/* body */}
                <rect x="42" y="104" width="66" height="52" rx="18" fill="#00E5FF" />
                <circle cx="75" cy="128" r="10" fill="#0B0B2E" opacity="0.85" />
                <circle cx="75" cy="128" r="4" fill="#FFC93C" />

                {/* left arm (static) */}
                <rect x="20" y="112" width="20" height="12" rx="6" fill="#FF3EA5" />

                {/* right arm (waving) */}
                <g style={{ animation: "waveArm 1.6s ease-in-out infinite", transformOrigin: "112px 116px" }}>
                  <rect x="110" y="108" width="20" height="12" rx="6" fill="#FF3EA5" />
                </g>

                {/* legs */}
                <rect x="52" y="152" width="14" height="16" rx="6" fill="#2A0944" />
                <rect x="84" y="152" width="14" height="16" rx="6" fill="#2A0944" />

                <defs>
                  <linearGradient id="headShine" x1="30" y1="34" x2="120" y2="104" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFFFFF" />
                    <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* --- Headline --- */}
            <h1
              className="mt-6 text-center font-bold"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "clamp(2.2rem, 6vw, 4.2rem)",
                background: "linear-gradient(90deg, #00E5FF 0%, #FF3EA5 55%, #FFC93C 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "titleIn 0.9s cubic-bezier(0.22, 1, 0.36, 1) both",
                lineHeight: 1.1,
              }}
            >
              Welcome to KETS'26
            </h1>
          </div>
        )}

        {/* ---- NAVBAR CONTENT (final settled state) ---- */}
        <div
          className="w-full flex items-center justify-between px-6 md:px-10"
          style={{
            height: NAV_HEIGHT,
            opacity: isNav ? 1 : 0,
            transition: `opacity 350ms ease ${isNav ? "150ms" : "0ms"}`,
            borderBottom: isNav ? "1px solid rgba(255,255,255,0.08)" : "none",
          }}
        >
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: "1.35rem",
              background: "linear-gradient(90deg, #00E5FF, #FF3EA5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            KETS'26
          </span>

          <nav className="hidden sm:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="transition-colors"
                style={{ color: "#C9C4E8", fontSize: "0.95rem", fontWeight: 500 }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#00E5FF")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#C9C4E8")}
              >
                {link}
              </a>
            ))}
          </nav>

          <button
            className="sm:hidden"
            aria-label="Open menu"
            style={{ color: "#00E5FF", fontSize: "1.5rem", background: "none", border: "none" }}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Spacer so page content isn't hidden under the fixed navbar once collapsed */}
      <div style={{ height: NAV_HEIGHT }} />
    </>
  );
}
