import { AboutExperience } from "../components/about/AboutExperience";
import { SEO } from "../components/SEO";
import { SEO_COPY } from "../data/siteCopy";
import "./about.css";

export function About() {
  return (
    <>
      <SEO title="About" description={SEO_COPY.about} path="/about" />
      <AboutExperience />
    </>
  );
}
