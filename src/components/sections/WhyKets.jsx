import RevealSection from "./RevealSection";
import FadeUpList from "./FadeUpList";

const OPPORTUNITIES = [
  "Explore emerging technologies and future career domains",
  "Work on real-world problem statements",
  "Develop practical and industry-relevant skills",
  "Collaborate with students from different engineering disciplines",
  "Interact with industry professionals and technology experts",
  "Transform ideas into working solutions",
  "Discover new opportunities beyond conventional academic learning",
];

export default function WhyKets() {
  const introLines = [
    {
      type: "p",
      content:
        "The gap between what students learn and what industry expects is growing rapidly. KETS was created to bridge that gap.",
    },
  ];

  return (
    <>
      <RevealSection
        id="why-kets"
        eyebrow="Motivation"
        heading="Why KETS?"
        lines={introLines}
        height="150vh"
        maxWidth="max-w-3xl"
        align="center"
      />

      <section className="w-full px-6 md:px-10 pb-24 md:pb-32">
        <div className="max-w-5xl mx-auto rounded-3xl bg-white border border-black/[0.05] shadow-[0_20px_55px_-24px_rgba(15,15,20,0.22)] px-6 md:px-14 py-10 md:py-14">
          <p className="flex items-center gap-2 text-xs md:text-sm font-medium uppercase tracking-[0.18em] text-black/45 mb-7">
            <span className="w-4 h-px bg-kets-magenta/70" />
            Through KETS, participants get an opportunity to
          </p>
          <FadeUpList items={OPPORTUNITIES} columns={2} />
        </div>
      </section>
    </>
  );
}
