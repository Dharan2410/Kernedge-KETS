import useReveal from "../../hooks/useReveal";

const OPPORTUNITIES = [
  "Explore emerging technologies and future career domains",
  "Work on real world problem statements",
  "Develop practical and industry relevant skills",
  "Collaborate with students from different engineering disciplines",
  "Interact with industry professionals and technology experts",
  "Transform ideas into working solutions",
  "Discover new opportunities beyond conventional academic learning",
];

export default function AboutKets() {
  const { ref: introRef, visible: introVisible } = useReveal(0.15);
  const { ref: gapRef, visible: gapVisible } = useReveal(0.2);
  const { ref: listRef, visible: listVisible } = useReveal(0.1);

  return (
    <section id="about" className="relative bg-ink grid-backdrop py-24 md:py-32 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        <div
          ref={introRef}
          className={`reveal ${introVisible ? "is-visible" : ""} grid md:grid-cols-[1.3fr_1fr] gap-12 md:gap-16 items-start`}
        >
          <div>
            <h2 className="font-display font-bold text-paper leading-[1.05]" style={{ fontSize: "clamp(2.1rem, 4.6vw, 3.4rem)" }}>
              What is KETS?
            </h2>
            <p className="mt-6 text-paper/75 text-base md:text-lg leading-relaxed max-w-2xl">
              KETS the <span className="text-paper font-medium">KernEdge Technology &amp; Engineering Summit</span> is
              an industry driven platform that brings students, innovators, educators, and technology enthusiasts
              together to explore emerging technologies, solve real world problems, and build practical solutions.
            </p>
            <p className="mt-4 text-paper/75 text-base md:text-lg leading-relaxed max-w-2xl">
              KETS focuses on learning beyond the classroom connecting academic knowledge with industry
              requirements through technology challenges, workshops, hackathons, expert interactions, and
              handson experiences. It is built as a full hackathon experience.Each team pick a real problem
              statement, work in three staged phases from proposal to prototype to final demo and get their
              solutions reviewed by people who build technology for a living, not just grade assignments for one.
            </p>
          </div>

          <div
            ref={gapRef}
            className={`reveal reveal-delay-2 ${gapVisible ? "is-visible" : ""} brackets p-7 md:p-8 text-gold`}
            style={{ background: "linear-gradient(160deg, rgba(242,183,5,0.08), rgba(242,183,5,0.02))" }}
          >
            <p className="font-display font-semibold text-xl md:text-2xl leading-snug text-paper">
              The gap between what students learn and what industry expects is growing fast.
            </p>
            <p className="mt-3 text-paper/65 text-sm md:text-base leading-relaxed">
              KETS was built to close that gap putting real problems, real mentors, and a real deadline in
              front of students before they graduate into needing them.
            </p>
          </div>
        </div>

        <div ref={listRef} className={`reveal reveal-delay-1 ${listVisible ? "is-visible" : ""} mt-16 md:mt-20`}>
          <h3 className="font-display font-semibold text-paper text-xl md:text-2xl mb-8">
            Through KETS, participants get to
          </h3>
          <ul className="grid sm:grid-cols-2 gap-x-10 gap-y-5">
            {OPPORTUNITIES.map((item) => (
              <li key={item} className="flex items-start gap-3 text-paper/80 text-base leading-relaxed">
                <span className="mt-2 w-2 h-2 shrink-0 bg-gold" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
