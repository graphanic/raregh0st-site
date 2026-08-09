import { useRef, useState } from "react";
import { P } from "../data/palette";

export function SignalDock({ calm, onToggleCalm, hidden = false }) {
  const [open, setOpen] = useState(false);
  const [musicOpen, setMusicOpen] = useState(false);
  const triggerRef = useRef(null);

  if (hidden) return null;

  const closeDock = () => {
    setOpen(false);
    setMusicOpen(false);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  };

  return (
    <aside className="signal-dock" data-app-utility="signal-dock" aria-label="Signal controls">
      {open && (
        <div id="signal-dock-panel" className="signal-dock-panel">
          <div className="signal-dock-heading">
            <div>
              <span className="ui-kicker">Signal Dock</span>
              <strong>Sound and atmosphere</strong>
            </div>
            <button type="button" className="signal-dock-close" onClick={closeDock} aria-label="Close Signal Dock">×</button>
          </div>

          <div className="signal-dock-controls">
            <button
              type="button"
              className="signal-dock-control"
              onClick={() => setMusicOpen((value) => !value)}
              aria-expanded={musicOpen}
              aria-controls="signal-dock-music"
            >
              <span><b aria-hidden>♪</b> Soul Connection</span>
              <span aria-hidden>{musicOpen ? "−" : "+"}</span>
            </button>
            <button
              type="button"
              className="signal-dock-control"
              onClick={onToggleCalm}
              aria-pressed={calm}
              aria-label={calm ? "Resume font river" : "Pause font river"}
            >
              <span><b aria-hidden>{calm ? "Ⅱ" : "≈"}</b> Font river</span>
              <span>{calm ? "Paused" : "Flowing"}</span>
            </button>
          </div>

          {musicOpen && (
            <div id="signal-dock-music" className="signal-dock-music">
              <iframe
                src="https://open.spotify.com/embed/playlist/49E0B98YVhZ1xnwIZiumVI?utm_source=generator&theme=0"
                width="100%"
                height="152"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title="Soul Connection Spotify playlist"
              />
            </div>
          )}
        </div>
      )}

      <button
        ref={triggerRef}
        type="button"
        className="signal-dock-trigger"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="signal-dock-panel"
      >
        <span aria-hidden>◉</span>
        Signal Dock
      </button>
    </aside>
  );
}
