import { useNavigate } from "react-router-dom";
import { P } from "../data/palette";
import { MorphText } from "../components/MorphText";
import { SEO } from "../components/SEO";

export const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 80 }}>
      <SEO title="404 - Signal Lost" description="This page doesn't exist yet." />
      <div style={{ textAlign: "center", maxWidth: 480, padding: "0 40px" }}>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 72, fontWeight: 700, color: P.ghost, opacity: 0.06, marginBottom: -20 }}>404</div>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 8, color: P.magenta, textTransform: "uppercase", marginBottom: 16 }}><MorphText speed={90}>Signal Lost</MorphText></div>
        <h2 style={{ fontFamily: "'Georgia', serif", fontSize: 24, fontWeight: 400, color: P.ghost, margin: "0 0 16px" }}><MorphText speed={75}>This page doesn't exist yet.</MorphText></h2>
        <p style={{ fontFamily: "'Georgia', serif", fontSize: 13, color: P.bone, opacity: 0.4, lineHeight: 1.7, marginBottom: 32, animation: "morphBreathStrong 1s ease-in-out infinite" }}>
          The pattern you're looking for isn't here &mdash; but the rest of the work is. Maybe the signal just drifted.
        </p>
        <button onClick={() => navigate("/")} style={{
          background: `${P.cyan}0a`, border: `1px solid ${P.cyan}25`, color: P.ghost,
          fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 4,
          padding: "12px 28px", cursor: "pointer", textTransform: "uppercase", transition: "all 0.3s",
        }}
          onMouseEnter={(e) => { e.target.style.background = `${P.cyan}15`; e.target.style.borderColor = `${P.cyan}40`; }}
          onMouseLeave={(e) => { e.target.style.background = `${P.cyan}0a`; e.target.style.borderColor = `${P.cyan}25`; }}
        >&larr; Return Home</button>
      </div>
    </div>
  );
};
