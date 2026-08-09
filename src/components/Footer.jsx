import { useNavigate } from "react-router-dom";
import { P } from "../data/palette";
import { HoverMorphText } from "./MorphText";

const LEGAL = [
  { label: "Privacy", dest: "/privacy" },
  { label: "Terms", dest: "/terms" },
  { label: "Shipping & Returns", dest: "/shipping" },
];

const PATHS = [
  { label: "Collect", dest: "/shop", color: P.gold },
  { label: "Commission", dest: "/contact?type=commission", color: P.gold },
  { label: "Join the Signal", dest: "/contact#signal", color: P.cyan },
];

export const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="site-footer" style={{ padding: "46px 32px 34px", borderTop: `1px solid ${P.steel}28`, maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 28 }}>
        <div>
          <div className="site-footer-copy" style={{ fontFamily: "'Courier New', monospace", letterSpacing: 2.5, textTransform: "uppercase" }}>&copy; 2026 1RareGh0st · All rights reserved</div>
          <div className="site-footer-note" style={{ fontFamily: "'Courier New', monospace", marginTop: 5, letterSpacing: 1.5 }}>Built with Angel Fathom · Presence over performance</div>
          <div style={{ display: "flex", gap: 18, marginTop: 8, flexWrap: "wrap" }}>
            {LEGAL.map(({ label, dest }) => (
              <button type="button" className="site-footer-link" key={dest} onClick={() => navigate(dest)}>{label}</button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          {PATHS.map(({ label, dest, color }) => (
            <button
              type="button"
              className="site-footer-link"
              key={dest}
              onClick={() => navigate(dest)}
              style={{ color }}
            >
              <HoverMorphText>{label}</HoverMorphText>
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
};
