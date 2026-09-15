import { useState } from "react";
import WelcomeHero from "./components/WelcomeHero";
import AboutKets from "./components/sections/AboutKets";
import Vision from "./components/sections/Vision";
import PrizeSection from "./components/sections/PrizeSection";
import Organizers from "./components/sections/Organizers";
import OurPeople from "./components/sections/OurPeople";
import ProblemStatements from "./components/sections/ProblemStatements";
import ProcessSection from "./components/sections/ProcessSection";
import ApplicationForm from "./components/sections/ApplicationForm";
import Footer from "./components/Footer";

export default function App() {
  const [prefillDomain, setPrefillDomain] = useState(null);

  return (
    <>
      <WelcomeHero />
      <AboutKets />
      <Vision />
      <PrizeSection />
      <Organizers />
      <OurPeople />
      <ProblemStatements onApplyDomain={setPrefillDomain} />
      <ProcessSection />
      <ApplicationForm prefillDomain={prefillDomain} />
      <Footer />
    </>
  );
}
