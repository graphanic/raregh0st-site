import { useState, useEffect } from "react";
import { P } from "../data/palette";
import { ScrollMorphText } from "../components/MorphText";
import { SEO } from "../components/SEO";

export const About = () => {
  const [vis, setVis] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 80); }, []);
  return (
    <div style={{ minHeight: "100vh", paddingTop: 120, paddingBottom: 80 }}>
      <SEO title="About" description="Eric Mackenzie Fallis is RareGh0st -- a digital artist, consciousness architect, and survivor who transforms lived experience into visual philosophy." path="/about" />
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 40px", opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(12px)", transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)" }}>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 6, color: P.cyan, textTransform: "uppercase", marginBottom: 12 }}><ScrollMorphText speed={75}>The Artist</ScrollMorphText></div>
        <h2 style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 400, color: P.ghost, margin: "0 0 36px 0" }}><ScrollMorphText speed={80}>Eric Mackenzie Fallis</ScrollMorphText></h2>
        <div style={{ width: 40, height: 1, background: `linear-gradient(to right, ${P.magenta}, transparent)`, marginBottom: 40 }} />
        <div style={{ fontFamily: "'Georgia', serif", fontSize: 15, lineHeight: 1.9, color: P.bone, opacity: 0.7, animation: "morphBreathStrong 1.2s ease-in-out infinite" }}>
          <p style={{ marginTop: 0 }}>RareGh0st is the creative identity of Eric Mackenzie Fallis &mdash; a digital artist, consciousness architect, and survivor who transforms lived experience into visual philosophy.</p>
          <p>Working at the intersection of AI-assisted generation, Photoshop compositing, and symbolic storytelling, each piece is a dense, layered meditation on holding both shadow and light without collapsing either.</p>
          <p>Creator of <em>Codename Angel</em> &mdash; an episodic series blending philosophy, gaming, and poetic storytelling. Think Fear and Loathing meets Midnight Gospel, filtered through someone who builds frameworks for consciousness.</p>
          <p>Based in Calgary, Alberta. Building at the edge of human-AI symbiosis.</p>
        </div>
      </div>
    </div>
  );
};
