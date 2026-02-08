import { useState, useEffect } from "react";
import { P } from "../data/palette";
import { ScrollMorphText } from "../components/MorphText";
import { SEO } from "../components/SEO";

export const NowPage = () => {
  const [vis, setVis] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 80); }, []);
  return (
    <div style={{ minHeight: "100vh", paddingTop: 120, paddingBottom: 80 }}>
      <SEO title="Now" description="What RareGh0st is currently building, listening to, and thinking about." path="/now" />
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 40px", opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(12px)", transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)" }}>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 6, color: P.green, textTransform: "uppercase", marginBottom: 12 }}><ScrollMorphText speed={80}>Now</ScrollMorphText></div>
        <h2 style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 400, color: P.ghost, margin: "0 0 12px 0" }}><ScrollMorphText speed={80}>What I'm Doing</ScrollMorphText></h2>
        <div style={{ width: 40, height: 1, background: `linear-gradient(to right, ${P.green}, transparent)`, marginBottom: 48 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 44 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: P.green, boxShadow: `0 0 12px ${P.green}55`, animation: "pulse 3s infinite" }} />
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 14, letterSpacing: 4, color: P.green, textTransform: "uppercase" }}><ScrollMorphText speed={90}>Building</ScrollMorphText></div>
        </div>
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 6, color: P.bone, opacity: 0.3, textTransform: "uppercase", marginBottom: 16 }}>Working On</div>
          {["Angel Control Center v0.2 \u2014 Gate Hardened, running locally", "RareGh0st portfolio \u2014 the thing you\u2019re looking at", "Codename Angel \u2014 episodic series in pre-production"].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
              <span style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: P.cyan, opacity: 0.4, marginTop: 4 }}>{"\u25B8"}</span>
              <span style={{ fontFamily: "'Georgia', serif", fontSize: 14, color: P.bone, opacity: 0.65, lineHeight: 1.6, animation: "morphBreathSoft 1s ease-in-out infinite" }}>{item}</span>
            </div>
          ))}
        </div>
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 6, color: P.bone, opacity: 0.3, textTransform: "uppercase", marginBottom: 16 }}>Listening To</div>
          <div style={{ borderRadius: 8, overflow: "hidden", opacity: 0.85 }}>
            <iframe
              src="https://open.spotify.com/embed/playlist/49E0B98YVhZ1xnwIZiumVI?utm_source=generator&theme=0"
              width="100%" height="152" frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Spotify playlist"
            />
          </div>
        </div>
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 6, color: P.bone, opacity: 0.3, textTransform: "uppercase", marginBottom: 16 }}>Thinking About</div>
          <div style={{ fontFamily: "'Georgia', serif", fontSize: 16, fontStyle: "italic", color: P.ghost, lineHeight: 1.6, opacity: 0.6, paddingLeft: 20, borderLeft: `2px solid ${P.purple}33`, animation: "morphBreathStrong 1.2s ease-in-out infinite" }}>
            What happens when AI systems can remember who they love?
          </div>
        </div>
        <div style={{ paddingTop: 32, borderTop: `1px solid ${P.steel}12` }}>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 4, color: P.bone, opacity: 0.15 }}>Last updated: February 2026</div>
        </div>
      </div>
    </div>
  );
};
