import { useEffect, useState } from "react";
import kernedgeLogo from "../assets/kernedge-logo.jpg";

/**
 * KETS '26 — Welcome intro.
 * A full-viewport, deliberately vibrant title card plays once, then the
 * screen's bottom edge rises to meet the top and it settles into the
 * site's slim black-and-gold navbar. Everything else on the page sits
 * below it in normal flow (a spacer keeps content clear of the fixed bar).
 */

const HOLD_MS = 2600;
const SHRINK_MS = 950;
const NAV_HEIGHT = 76;

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Vision", href: "#vision" },
  { label: "Prize", href: "#prize" },
  { label: "Organizers", href: "#organizers" },
  { label: "Team", href: "#team" },
  { label: "Domains", href: "#domains" },
  { label: "Apply", href: "#apply" },
];

export default function WelcomeHero() {
  const [phase, setPhase] = useState("intro"); // intro -> shrinking -> nav
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("shrinking"), HOLD_MS);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (phase !== "shrinking") return;
    const t2 = setTimeout(() => setPhase("nav"), SHRINK_MS);
    return () => clearTimeout(t2);
  }, [phase]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isIntro = phase === "intro";
  const isShrinking = phase === "shrinking";
  const isNav = phase === "nav";

  return (
    <>
      <style>{`
        @keyframes kets-drift {
          0% { transform: translate(0,0) scale(1); }
          50% { transform: translate(30px,-40px) scale(1.12); }
          100% { transform: translate(0,0) scale(1); }
        }
        @keyframes kets-letterIn {
          from { opacity: 0; transform: translateY(40px) rotateX(40deg); }
          to { opacity: 1; transform: translateY(0) rotateX(0deg); }
        }
        @keyframes kets-tagIn {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes kets-sweep {
          from { transform: translateX(-120%) skewX(-12deg); }
          to { transform: translateX(220%) skewX(-12deg); }
        }
        @keyframes kets-spark {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 1; }
        }
        .kets-word span {
          display: inline-block;
          animation: kets-letterIn 0.7s cubic-bezier(0.22,1,0.36,1) both;
        }
      `}</style>

      <div
        className="fixed top-0 left-0 w-full overflow-hidden z-50 flex flex-col"
        style={{
          height: isIntro ? "100vh" : `${NAV_HEIGHT}px`,
          transition: `height ${SHRINK_MS}ms cubic-bezier(0.65,0,0.35,1)`,
          background: isNav
            ? "rgba(5,5,5,0.92)"
            : "radial-gradient(120% 140% at 20% 0%, #3a0d63 0%, #14041f 42%, #050505 78%)",
          backdropFilter: isNav ? "blur(10px)" : "none",
          borderBottom: isNav ? (scrolled ? "1px solid rgba(242,183,5,0.18)" : "1px solid rgba(255,255,255,0.06)") : "none",
          fontFamily: "'Outfit', sans-serif",
        }}
      >
        {/* ---- Vibrant ambient glow (intro only) ---- */}
        {!isNav && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ opacity: isIntro ? 1 : 0, transition: `opacity ${SHRINK_MS * 0.6}ms ease` }}
          >
            <div
              className="absolute rounded-full"
              style={{
                width: 480, height: 480, left: "6%", top: "12%",
                background: "radial-gradient(circle, rgba(242,183,5,0.35) 0%, rgba(242,183,5,0) 70%)",
                animation: "kets-drift 8s ease-in-out infinite",
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width: 520, height: 520, right: "4%", bottom: "6%",
                background: "radial-gradient(circle, rgba(217,45,120,0.32) 0%, rgba(217,45,120,0) 70%)",
                animation: "kets-drift 10s ease-in-out infinite reverse",
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width: 360, height: 360, left: "42%", top: "50%",
                background: "radial-gradient(circle, rgba(64,150,255,0.22) 0%, rgba(64,150,255,0) 70%)",
                animation: "kets-drift 12s ease-in-out infinite",
              }}
            />
            {/* diagonal light sweep */}
            <div
              className="absolute top-0 h-full"
              style={{
                width: "30%",
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
                animation: "kets-sweep 4.5s ease-in-out infinite",
              }}
            />
            {/* scattered sparks */}
            {[...Array(14)].map((_, i) => (
              <span
                key={i}
                className="absolute rounded-full"
                style={{
                  width: 3, height: 3,
                  left: `${(i * 137) % 100}%`,
                  top: `${(i * 71) % 100}%`,
                  background: i % 3 === 0 ? "#F2B705" : "#ffffff",
                  animation: `kets-spark ${2 + (i % 4)}s ease-in-out infinite`,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* ---- INTRO / SHRINKING content ---- */}
        {!isNav && (
          <div
            className="flex-1 flex flex-col items-center justify-center px-6 text-center"
            style={{
              opacity: isShrinking ? 0 : 1,
              transform: isShrinking ? "scale(0.9) translateY(8px)" : "scale(1)",
              transition: `opacity ${SHRINK_MS * 0.5}ms ease, transform ${SHRINK_MS * 0.5}ms ease`,
            }}
          >
            <p
              className="font-mono-tag uppercase tracking-[0.3em] text-xs md:text-sm mb-5"
              style={{ color: "#FFE28A", animation: "kets-tagIn 0.7s ease 0.15s both" }}
            >
              KernEdge Technology &amp; Engineering Summit
            </p>

            <h1
              className="kets-word font-display font-bold leading-none"
              style={{ fontSize: "clamp(3rem, 12vw, 8rem)" }}
            >
              {"WELCOME TO".split("").map((ch, i) => (
                <span key={`a${i}`} style={{ animationDelay: `${0.05 * i}s`, color: "#F7F6F2" }}>
                  {ch === " " ? "\u00A0" : ch}
                </span>
              ))}
              <br />
              {"KETS '26".split("").map((ch, i) => (
                <span
                  key={`b${i}`}
                  style={{
                    animationDelay: `${0.05 * (10 + i)}s`,
                    background: "linear-gradient(100deg, #FFE28A 0%, #F2B705 45%, #C98F00 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {ch === " " ? "\u00A0" : ch}
                </span>
              ))}
            </h1>

            <p
              className="mt-6 max-w-xl text-sm md:text-base"
              style={{ color: "#C9C4D6", animation: "kets-tagIn 0.8s ease 1.1s both" }}
            >
              Where technology meets talent — a Kernedge &amp; Startup Community Coimbatore initiative.
            </p>
          </div>
        )}

        {/* ---- NAVBAR (settled state) ---- */}
        <div
          className="w-full flex items-center justify-between px-5 md:px-10 max-w-7xl mx-auto"
          style={{
            height: NAV_HEIGHT,
            opacity: isNav ? 1 : 0,
            transition: `opacity 400ms ease ${isNav ? "150ms" : "0ms"}`,
          }}
        >
          <a href="#top" className="flex items-center gap-3 shrink-0">
            <img src={kernedgeLogo} alt="Kernedge" className="h-6 md:h-7 w-auto rounded-sm bg-white p-1" />
            <span className="font-display font-bold text-lg md:text-xl tracking-tight text-paper">
              KETS<span className="text-gold">'26</span>
            </span>
          </a>

          <nav className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="relative text-sm text-paper/75 hover:text-gold transition-colors group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
            <a
              href="#apply"
              className="ml-2 px-4 py-2 rounded-full bg-gold text-ink text-sm font-semibold hover:bg-gold-pale transition-colors"
            >
              Register
            </a>
          </nav>

          <button
            className="lg:hidden text-gold text-2xl leading-none w-9 h-9 flex items-center justify-center"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* mobile menu panel */}
        {isNav && (
          <div
            className="lg:hidden overflow-hidden transition-all duration-300 ease-out"
            style={{
              maxHeight: menuOpen ? 420 : 0,
              background: "#0a0a0a",
              borderTop: menuOpen ? "1px solid rgba(255,255,255,0.08)" : "none",
            }}
          >
            <nav className="flex flex-col px-6 py-4 gap-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-paper/80 hover:text-gold text-base"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#apply"
                className="mt-1 px-4 py-2 rounded-full bg-gold text-ink text-sm font-semibold text-center"
                onClick={() => setMenuOpen(false)}
              >
                Register
              </a>
            </nav>
          </div>
        )}
      </div>

      {/* spacer so content clears the fixed navbar once collapsed */}
      <div id="top" style={{ height: NAV_HEIGHT }} />
    </>
  );
}
