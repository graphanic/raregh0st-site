import { useState, useEffect } from "react";
import { P, LOGO_IMG } from "../data/palette";
import { MorphText } from "./MorphText";

export const Preloader = ({ onComplete }) => {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 600);
    const t2 = setTimeout(() => setPhase(2), 1800);
    const t3 = setTimeout(() => onComplete(), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999, background: P.abyss,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      opacity: phase === 2 ? 0 : 1, transition: "opacity 0.6s ease",
      pointerEvents: phase === 2 ? "none" : "all",
    }}>
      <div style={{
        width: 64, height: 64, marginBottom: 24,
        opacity: phase >= 0 ? 1 : 0, transform: phase >= 0 ? "scale(1)" : "scale(0.8)",
        transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)",
      }}>
        <img src={LOGO_IMG} alt="" style={{
          width: "100%", height: "100%", objectFit: "contain",
          filter: `drop-shadow(0 0 20px ${P.cyan}33)`,
          animation: "breathe 2s ease-in-out infinite",
        }} />
      </div>
      <div style={{
        fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 8,
        color: P.cyan, textTransform: "uppercase",
        opacity: phase >= 1 ? 0.6 : 0, transform: phase >= 1 ? "translateY(0)" : "translateY(8px)",
        transition: "all 0.5s ease 0.1s",
      }}><MorphText speed={80}>RareGh0st</MorphText></div>
      <div style={{
        width: 120, height: 1, marginTop: 20, overflow: "hidden",
        background: `${P.steel}22`,
      }}>
        <div style={{
          width: phase >= 1 ? "100%" : "0%", height: "100%",
          background: `linear-gradient(to right, ${P.cyan}44, ${P.magenta}44)`,
          transition: "width 1.2s cubic-bezier(0.16,1,0.3,1)",
        }} />
      </div>
    </div>
  );
};
