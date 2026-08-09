import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { P, LOGO_IMG } from "../data/palette";
import { HoverMorphText } from "./MorphText";
import { ACTION_COPY } from "../data/siteCopy";

const NAV_ITEMS = [
  { path: "/portfolio", label: "Portfolio" },
  { path: "/media", label: "Media" },
  { path: "/shop", label: "Shop" },
  { path: "/contact", label: "Contact" },
  { path: "/about", label: "About" },
];

export const Nav = ({ cartCount }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const handleNav = (path) => { navigate(path); setMenuOpen(false); };
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="site-nav" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "14px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", background: `linear-gradient(to bottom, ${P.abyss}ee, transparent)`, backdropFilter: "blur(8px)" }}>
        <button type="button" onClick={() => handleNav("/")} aria-label="1RareGh0st home" style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center", gap: 10, zIndex: 102 }}>
          <img src={LOGO_IMG} alt="" style={{ width: 22, height: 22, opacity: 0.7 }} />
          <span style={{ fontFamily: "'Courier New', monospace", fontSize: 14, fontWeight: 700, letterSpacing: 5 }}>
            <span style={{ color: P.ghost }}>1</span><span style={{ color: P.cyan }}>RARE</span><span style={{ color: P.magenta }}>GH</span><span style={{ color: P.ghost }}>0</span><span style={{ color: P.magenta }}>ST</span>
          </span>
        </button>
        {/* Desktop nav */}
        <div className="nav-desktop" style={{ display: "flex", gap: 22, alignItems: "center" }}>
          {NAV_ITEMS.map(({ path, label }) => (
            <button key={path} onClick={() => navigate(path)} style={{ background: "none", border: "none", color: isActive(path) ? P.cyan : P.bone, fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer", padding: "6px 0", borderBottom: isActive(path) ? `1px solid ${P.cyan}` : "1px solid transparent", transition: "all 0.3s" }}
              onMouseEnter={(e) => { if (!isActive(path)) e.target.style.color = P.cyan; }}
              onMouseLeave={(e) => { if (!isActive(path)) e.target.style.color = P.bone; }}
            ><HoverMorphText>{label}</HoverMorphText></button>
          ))}
          <button onClick={() => navigate("/contact?type=commission")} style={{ background: `${P.gold}0d`, border: `1px solid ${P.gold}3d`, color: P.gold, fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", padding: "8px 12px", transition: "all 0.3s" }}>
            <HoverMorphText>Commission</HoverMorphText>
          </button>
          <button type="button" onClick={() => navigate("/cart")} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", position: "relative", color: P.bone, fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 2 }}>
            CART{cartCount > 0 && <span style={{ position: "absolute", top: -6, right: -12, background: P.magenta, color: "#fff", fontSize: 8, fontWeight: 700, width: 14, height: 14, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>}
          </button>
        </div>
        {/* Mobile: cart + hamburger */}
        <div className="nav-mobile-btns" style={{ display: "none", alignItems: "center", gap: 16, zIndex: 102 }}>
          <button type="button" onClick={() => handleNav("/cart")} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", position: "relative", color: P.bone, fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 2 }}>
            CART{cartCount > 0 && <span style={{ position: "absolute", top: -6, right: -12, background: P.magenta, color: "#fff", fontSize: 8, fontWeight: 700, width: 14, height: 14, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>}
          </button>
          <button onClick={() => setMenuOpen(v => !v)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", flexDirection: "column", gap: 4, zIndex: 102 }} aria-label="Menu">
            <span style={{ display: "block", width: 20, height: 1.5, background: menuOpen ? P.cyan : P.bone, transition: "all 0.3s", transform: menuOpen ? "rotate(45deg) translate(3px, 3px)" : "none" }} />
            <span style={{ display: "block", width: 20, height: 1.5, background: menuOpen ? P.cyan : P.bone, transition: "all 0.3s", opacity: menuOpen ? 0 : 1 }} />
            <span style={{ display: "block", width: 20, height: 1.5, background: menuOpen ? P.cyan : P.bone, transition: "all 0.3s", transform: menuOpen ? "rotate(-45deg) translate(3px, -3px)" : "none" }} />
          </button>
        </div>
      </nav>
      {/* Mobile fullscreen overlay */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 101,
        background: `${P.abyss}f5`, backdropFilter: "blur(20px)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8,
        opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? "auto" : "none",
        transition: "opacity 0.3s ease",
      }}>
        {NAV_ITEMS.map(({ path, label }, i) => (
          <button key={path} onClick={() => handleNav(path)} style={{
            background: "none", border: "none", color: isActive(path) ? P.cyan : P.ghost,
            fontFamily: "'Courier New', monospace", fontSize: 14, letterSpacing: 8,
            textTransform: "uppercase", cursor: "pointer", padding: "14px 20px",
            opacity: menuOpen ? 1 : 0, transform: menuOpen ? "translateY(0)" : "translateY(12px)",
            transition: `all 0.4s ease ${i * 0.05}s`,
          }}>{label}</button>
        ))}
        <button onClick={() => handleNav("/contact?type=commission")} style={{ background: `${P.gold}0d`, border: `1px solid ${P.gold}44`, color: P.gold, fontFamily: "'Courier New', monospace", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", cursor: "pointer", padding: "12px 18px", marginTop: 4, opacity: menuOpen ? 1 : 0, transition: `all 0.4s ease ${NAV_ITEMS.length * 0.05}s` }}>
          {ACTION_COPY.commission}
        </button>
        <div style={{ width: 40, height: 1, background: `${P.steel}22`, margin: "8px 0" }} />
        <button onClick={() => handleNav("/cart")} style={{
          background: "none", border: "none", color: P.gold,
          fontFamily: "'Courier New', monospace", fontSize: 12, letterSpacing: 6,
          textTransform: "uppercase", cursor: "pointer", padding: "10px 20px",
          opacity: menuOpen ? 1 : 0, transition: `all 0.4s ease ${NAV_ITEMS.length * 0.05}s`,
          position: "relative",
        }}>
          CART {cartCount > 0 && `(${cartCount})`}
        </button>
      </div>
    </>
  );
};
