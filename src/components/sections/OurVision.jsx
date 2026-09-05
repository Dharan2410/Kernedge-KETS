import RevealSection from "./RevealSection";

export default function OurVision() {
  const lines = [
    {
      type: "node",
      content: (
        <p className="font-display text-black text-xl md:text-3xl font-medium leading-snug">
          To create a generation of engineers who don't just learn technology
          — but build with it.
        </p>
      ),
    },
  ];

  return (
    <RevealSection
      id="our-vision"
      eyebrow="Mission"
      heading="Our Vision"
      lines={lines}
      height="140vh"
      maxWidth="max-w-4xl"
      variant="plain"
      align="center"
    />
  );
}
