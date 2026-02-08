import { useState, useRef, useEffect, useCallback } from "react";
import { P } from "../data/palette";

export const HScrollRow = ({ children, arrowColor = P.cyan }) => {
  const ref = useRef(null);
  const [showL, setShowL] = useState(false);
  const [showR, setShowR] = useState(true);
  const [drag, setDrag] = useState(false);
  const [sx, setSx] = useState(0);
  const [sl, setSl] = useState(0);
  const check = useCallback(() => {
    if (!ref.current) return;
    const { scrollLeft: s, scrollWidth, clientWidth } = ref.current;
    setShowL(s > 10);
    setShowR(s < scrollWidth - clientWidth - 10);
  }, []);
  useEffect(() => {
    const el = ref.current;
    if (el) { el.addEventListener("scroll", check); check(); }
    return () => el?.removeEventListener("scroll", check);
  }, [check, children]);
  const scroll = (d) => ref.current?.scrollBy({ left: d * ref.current.clientWidth * 0.85, behavior: "smooth" });
  const Arr = ({ dir, show }) => show ? (
    <button onClick={() => scroll(dir)} aria-label={dir < 0 ? "Scroll left" : "Scroll right"} style={{ position: "absolute", [dir < 0 ? "left" : "right"]: 0, top: "50%", transform: "translateY(-50%)", zIndex: 10, background: `${P.abyss}dd`, border: `1px solid ${arrowColor}33`, color: arrowColor, width: 38, height: 38, borderRadius: "50%", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)" }}>
      {dir < 0 ? "\u2039" : "\u203A"}
    </button>
  ) : null;
  return (
    <div style={{ position: "relative" }}>
      <Arr dir={-1} show={showL} />
      <Arr dir={1} show={showR} />
      <div
        ref={ref}
        onMouseDown={(e) => { setDrag(true); setSx(e.pageX - ref.current.offsetLeft); setSl(ref.current.scrollLeft); ref.current.style.cursor = "grabbing"; }}
        onMouseUp={() => { setDrag(false); if (ref.current) ref.current.style.cursor = "grab"; }}
        onMouseLeave={() => { setDrag(false); if (ref.current) ref.current.style.cursor = "grab"; }}
        onMouseMove={(e) => { if (!drag) return; e.preventDefault(); ref.current.scrollLeft = sl - (e.pageX - ref.current.offsetLeft - sx) * 1.5; }}
        style={{ display: "flex", gap: 20, overflowX: "auto", scrollbarWidth: "none", padding: "8px 4px", cursor: "grab", userSelect: "none" }}
      >
        {children}
      </div>
    </div>
  );
};
