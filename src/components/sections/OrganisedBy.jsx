import RevealSection from "./RevealSection";
import kernedgeLogo from "../../assets/kernedge-logo-placeholder.svg";

/**
 * NOTE: kernedge-logo-placeholder.svg is a stand-in — replace that file
 * (same filename, or update the import below) with the real KernEdge
 * brand mark once you have it.
 */
export default function OrganisedBy() {
  const lines = [
    {
      type: "node",
      content: (
        <img
          src={kernedgeLogo}
          alt="KernEdge Technologies"
          className="h-12 md:h-14 w-auto"
        />
      ),
    },
    {
      type: "p",
      content:
        "KernEdge Technologies, in association with the Startup Community Coimbatore.",
    },
  ];

  return (
    <RevealSection
      id="organised-by"
      heading="Organised by"
      lines={lines}
      height="130vh"
      maxWidth="max-w-xl"
      variant="plain"
    />
  );
}
