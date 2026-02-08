import { useState } from "react";
import { P } from "../data/palette";
import { HoverMorphText } from "./MorphText";

export const Collapsible = ({ title, icon, color, defaultOpen = false, count, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginBottom: 4 }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: open ? `${P.surface}88` : `${P.deep}44`, border: `1px solid ${open ? color + "22" : P.steel + "15"}`, borderRadius: 2, cursor: "pointer", transition: "all 0.3s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 16, color, lineHeight: 1 }}>{icon}</span>
          <span style={{ fontFamily: "'Courier New', monospace", fontSize: 12, letterSpacing: 3, color: open ? color : P.bone, textTransform: "uppercase", transition: "color 0.3s" }}>
            <HoverMorphText>{title}</HoverMorphText>
          </span>
          {count != null && (
            <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: P.bone, opacity: 0.3, background: `${P.steel}33`, padding: "2px 8px", borderRadius: 10 }}>{count}</span>
          )}
        </div>
        <span style={{ fontFamily: "'Courier New', monospace", fontSize: 14, color: P.bone, opacity: 0.3, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.3s" }}>{"\u25BE"}</span>
      </button>
      {open && <div style={{ padding: "20px 0", animation: "fadeSlideIn 0.3s ease" }}>{children}</div>}
    </div>
  );
};
