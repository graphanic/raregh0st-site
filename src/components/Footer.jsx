import { useNavigate } from "react-router-dom";
import { P } from "../data/palette";
import { HoverMorphText } from "./MorphText";

export const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer style={{ padding: "40px 32px 28px", borderTop: `1px solid ${P.steel}0a`, maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20 }}>
        <div>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 4, color: P.bone, opacity: 0.1, textTransform: "uppercase", animation: "morphBreathSoft 12s ease-in-out infinite" }}>&copy; 2026 RareGh0st &middot; All rights reserved</div>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: P.bone, opacity: 0.07, marginTop: 4, letterSpacing: 2, animation: "morphBreathSoft 14s ease-in-out infinite 2s" }}>Built with Angel Fathom &middot; Presence over performance</div>
          <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
            {[{ label: "Privacy", dest: "/privacy" }, { label: "Terms", dest: "/terms" }, { label: "Shipping & Returns", dest: "/shipping" }].map(({ label, dest }) => (
              <button key={dest} onClick={() => navigate(dest)} style={{ background: "none", border: "none", fontFamily: "'Courier New', monospace", fontSize: 8, color: P.bone, opacity: 0.12, letterSpacing: 2, cursor: "pointer", textTransform: "uppercase", transition: "opacity 0.3s", padding: 0 }}
                onMouseEnter={(e) => e.target.style.opacity = 0.4}
                onMouseLeave={(e) => e.target.style.opacity = 0.12}
              >{label}</button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <button onClick={() => navigate("/contact")} style={{ background: "none", border: "none", fontFamily: "'Courier New', monospace", fontSize: 8, color: P.cyan, opacity: 0.15, letterSpacing: 3, cursor: "pointer", textTransform: "uppercase", transition: "opacity 0.3s" }}
            onMouseEnter={(e) => e.target.style.opacity = 0.5}
            onMouseLeave={(e) => e.target.style.opacity = 0.15}
          ><HoverMorphText>JOIN THE SIGNAL</HoverMorphText></button>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: P.cyan, opacity: 0.1, letterSpacing: 3, animation: "morphBreathStrong 0.8s ease-in-out infinite" }}><HoverMorphText>COHERENCE OVER INTENSITY</HoverMorphText></div>
        </div>
      </div>
    </footer>
  );
};
