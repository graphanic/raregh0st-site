import { useState } from "react";
import { P } from "../data/palette";

export const SpotifyBar = () => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 150, transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)" }}>
      <button onClick={() => setOpen(!open)} style={{ position: "absolute", top: -32, right: 20, background: `${P.abyss}ee`, border: `1px solid ${P.cyan}22`, color: P.cyan, fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 3, padding: "6px 14px", cursor: "pointer", textTransform: "uppercase", backdropFilter: "blur(8px)", borderBottom: "none", borderRadius: "3px 3px 0 0" }}>
        {open ? "\u25BE CLOSE" : "\u266A SOUL CONNECTION"}
      </button>
      <div style={{ height: open ? 80 : 0, overflow: "hidden", transition: "height 0.4s cubic-bezier(0.16,1,0.3,1)", background: `${P.abyss}ee`, borderTop: open ? `1px solid ${P.cyan}15` : "none", backdropFilter: "blur(12px)" }}>
        {open && (
          <iframe
            src="https://open.spotify.com/embed/playlist/49E0B98YVhZ1xnwIZiumVI?utm_source=generator&theme=0"
            width="100%" height="80" frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title="Spotify playlist"
            style={{ borderRadius: 0, opacity: 0.85 }}
          />
        )}
      </div>
    </div>
  );
};
