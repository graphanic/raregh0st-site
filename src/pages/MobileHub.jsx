import { useNavigate } from "react-router-dom";
import { P, LOGO_IMG } from "../data/palette";
import { SEO } from "../components/SEO";

export const MobileHub = ({ cartCount }) => {
  const navigate = useNavigate();
  const links = [
    { label: "Portfolio", dest: "/portfolio", color: P.cyan, desc: "Curated Works" },
    { label: "Shop", dest: "/shop", color: P.gold, desc: "Prints & Originals" },
    { label: "Media", dest: "/media", color: P.magenta, desc: "Motion & Sound" },
    { label: "The Work", dest: "/the-work", color: P.purple, desc: "Process & Philosophy" },
    { label: "Now", dest: "/now", color: P.green, desc: "Current Status" },
    { label: "Contact", dest: "/contact", color: P.bone, desc: "Get In Touch" },
    { label: "About", dest: "/about", color: P.bone, desc: "The Artist" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: `radial-gradient(ellipse at 50% 30%, ${P.deep} 0%, ${P.abyss} 70%)`,
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "60px 24px 40px",
    }}>
      <SEO />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 48 }}>
        <img src={LOGO_IMG} alt="RareGh0st" style={{ width: 48, height: 48, opacity: 0.8, marginBottom: 16 }} />
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 8, color: P.bone, textTransform: "uppercase", opacity: 0.4, marginBottom: 8 }}>The Art of</div>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 38, fontWeight: 700, letterSpacing: 6, marginBottom: 8 }}>
          <span style={{ color: P.cyan }}>Rare</span>
          <span style={{ color: P.magenta }}>Gh</span>
          <span style={{ color: P.ghost }}>0</span>
          <span style={{ color: P.magenta }}>st</span>
        </div>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 8, letterSpacing: 6, color: P.bone, textTransform: "uppercase", opacity: 0.3 }}>Trauma Integration Made Visible</div>
      </div>
      <div style={{ width: "100%", maxWidth: 360, display: "flex", flexDirection: "column", gap: 12 }}>
        {links.map((link) => (
          <button key={link.dest} onClick={() => navigate(link.dest)} style={{
            width: "100%", background: `${link.color}08`, border: `1px solid ${link.color}25`,
            borderRadius: 2, padding: "16px 20px", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all 0.3s ease",
          }}>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontFamily: "'Courier New', monospace", fontSize: 12, letterSpacing: 4, color: link.color, textTransform: "uppercase", fontWeight: 600 }}>{link.label}</div>
              <div style={{ fontFamily: "'Georgia', serif", fontSize: 10, color: P.bone, opacity: 0.35, marginTop: 4 }}>{link.desc}</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={link.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        ))}
      </div>
      {cartCount > 0 && (
        <button onClick={() => navigate("/cart")} style={{
          marginTop: 20, width: "100%", maxWidth: 360,
          background: `${P.gold}10`, border: `1px solid ${P.gold}30`,
          borderRadius: 2, padding: "14px 20px", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}>
          <span style={{ fontFamily: "'Courier New', monospace", fontSize: 11, letterSpacing: 4, color: P.gold, textTransform: "uppercase" }}>Cart ({cartCount})</span>
        </button>
      )}
      <div style={{ width: 40, height: 1, background: `${P.steel}22`, margin: "32px 0 20px" }} />
      <div style={{ display: "flex", gap: 20, opacity: 0.35 }}>
        {["Privacy", "Terms", "Shipping"].map(s => (
          <button key={s} onClick={() => navigate(`/${s.toLowerCase()}`)} style={{
            background: "none", border: "none", color: P.bone, cursor: "pointer",
            fontFamily: "'Courier New', monospace", fontSize: 8, letterSpacing: 3, textTransform: "uppercase",
          }}>{s}</button>
        ))}
      </div>
    </div>
  );
};
