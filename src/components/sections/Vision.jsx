import useReveal from "../../hooks/useReveal";

const DOMAINS = [
  "AI & Machine Learning", "Cybersecurity", "Embedded Systems", "IoT",
  "Medical Technology", "Smart Energy", "Robotics", "Aerospace",
  "Cloud & Data Engineering", "Emerging Engineering Domains",
];

export default function Vision() {
  const { ref: quoteRef, visible: quoteVisible } = useReveal(0.2);
  const { ref: visionBlockRef, visible: visionBlockVisible } = useReveal(0.25);

  return (
    <section id="vision" className="relative bg-paper text-ink py-24 md:py-32 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 md:px-10 text-center">
        <div ref={quoteRef} className={`reveal ${quoteVisible ? "is-visible" : ""}`}>
          <p className="text-ink/60 text-base md:text-lg">KETS is not just another technical event.</p>
          <p
            className="font-display font-bold mt-3 leading-tight"
            style={{ fontSize: "clamp(1.7rem, 4.4vw, 3rem)" }}
          >
            It's where <span className="text-gold-deep">Technology</span> meets Talent,
            <br className="hidden sm:block" /> <span className="text-gold-deep">Ideas</span> meet Execution,
            <br className="hidden sm:block" /> and <span className="text-gold-deep">Students</span> meet Industry.
          </p>
        </div>
      </div>

      {/* domain ecosystem marquee */}
      <div className="mt-16 md:mt-20 border-y border-ink/10 py-6 overflow-hidden">
        <div className="flex whitespace-nowrap marquee-track w-max">
          {[...DOMAINS, ...DOMAINS].map((d, i) => (
            <span key={i} className="mx-6 flex items-center gap-6 font-display text-lg md:text-xl text-ink/70">
              {d}
              <span className="text-gold-deep">✦</span>
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 md:px-10 mt-16 md:mt-20 text-center">
        <div ref={visionBlockRef} className={`reveal reveal-delay-1 ${visionBlockVisible ? "is-visible" : ""} brackets inline-block p-8 md:p-10 text-gold-deep`}>
          <p className="font-mono-tag text-xs tracking-[0.25em] text-ink/45 mb-4">OUR VISION</p>
          <p className="font-display font-semibold text-ink leading-snug" style={{ fontSize: "clamp(1.3rem, 3vw, 2rem)" }}>
            To create a generation of engineers who don't just learn technology but build with it.
          </p>
        </div>
      </div>
    </section>
  );
}
