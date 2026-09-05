import RevealSection from "./RevealSection";

const DOMAINS = [
  "AI & Machine Learning",
  "Cybersecurity",
  "Embedded Systems",
  "IoT",
  "Medical Technology",
  "Smart Energy",
  "Robotics",
  "Aerospace",
];

function DomainChips() {
  return (
    <div className="flex flex-wrap gap-2.5 pt-1">
      {DOMAINS.map((d) => (
        <span
          key={d}
          className="text-sm md:text-[15px] font-medium text-black/75 bg-black/[0.04] border border-black/[0.06] rounded-full px-4 py-1.5"
        >
          {d}
        </span>
      ))}
    </div>
  );
}

export default function WhatMakesDifferent() {
  const lines = [
    { type: "p", content: "KETS is not just another technical event." },
    {
      type: "p",
      content:
        "It is a platform where Technology meets Talent, Ideas meet Execution, and Students meet Industry.",
    },
    {
      type: "p",
      content:
        "KETS brings multiple technology ecosystems together under one platform, spanning emerging engineering domains including:",
    },
    { type: "node", content: <DomainChips /> },
  ];

  return (
    <RevealSection
      id="what-makes-different"
      eyebrow="Differentiators"
      heading="What makes KETS different?"
      lines={lines}
      height="210vh"
      maxWidth="max-w-4xl"
      textWidth="max-w-2xl"
    />
  );
}
