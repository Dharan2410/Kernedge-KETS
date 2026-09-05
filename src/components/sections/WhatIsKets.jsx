import RevealSection from "./RevealSection";

export default function WhatIsKets() {
  const lines = [
    {
      type: "p",
      content:
        "KETS — KernEdge Technology & Engineering Summit is an industry-driven platform designed to bring together students, innovators, educators, and technology enthusiasts to explore emerging technologies, solve real-world problems, and build practical solutions.",
    },
    {
      type: "p",
      content:
        "KETS focuses on learning beyond the classroom — connecting academic knowledge with industry requirements through technology challenges, workshops, hackathons, expert interactions, and hands-on experiences.",
    },
  ];

  return (
    <RevealSection
      id="what-is-kets"
      eyebrow="Overview"
      heading="What is KETS?"
      lines={lines}
      height="190vh"
      maxWidth="max-w-4xl"
      textWidth="max-w-2xl"
    />
  );
}
