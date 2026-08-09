import { useState, useEffect } from "react";
import { P } from "../data/palette";
import { saveLocal, loadLocal } from "../utils/storage";

export const CookieConsent = ({ onDismiss }) => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(() => loadLocal("cookies", false));

  useEffect(() => {
    if (dismissed) return;
    const timer = setTimeout(() => setVisible(true), 2500);
    return () => clearTimeout(timer);
  }, [dismissed]);

  const handleDismiss = () => {
    setDismissed(true);
    saveLocal("cookies", true);
    onDismiss?.();
  };

  if (dismissed || !visible) return null;

  return (
    <div data-app-utility="consent" style={{
      position: "fixed", bottom: 90, left: 20, right: 20, maxWidth: 480, zIndex: 250,
      background: `${P.surface}f5`, border: `1px solid ${P.steel}22`,
      backdropFilter: "blur(16px)", padding: "16px 20px",
      animation: "fadeSlideIn 0.4s ease",
      display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
    }}>
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 3, color: P.ghost, textTransform: "uppercase", marginBottom: 4 }}>
          Cookies & Privacy
        </div>
        <div style={{ fontFamily: "'Georgia', serif", fontSize: 11, color: P.bone, opacity: 0.5, lineHeight: 1.5 }}>
          We use minimal analytics cookies to understand how visitors interact with the site. No tracking, no ads, no third-party data sharing.
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={handleDismiss} style={{
          background: `${P.cyan}12`, border: `1px solid ${P.cyan}30`, color: P.ghost,
          fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 2,
          padding: "8px 16px", cursor: "pointer", textTransform: "uppercase", transition: "all 0.3s",
        }}
          onMouseEnter={(e) => { e.target.style.background = `${P.cyan}22`; }}
          onMouseLeave={(e) => { e.target.style.background = `${P.cyan}12`; }}
        >Accept</button>
        <button onClick={handleDismiss} style={{
          background: "none", border: `1px solid ${P.steel}22`, color: P.bone,
          fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 2,
          padding: "8px 16px", cursor: "pointer", textTransform: "uppercase", opacity: 0.4, transition: "all 0.3s",
        }}
          onMouseEnter={(e) => { e.target.style.opacity = "0.7"; }}
          onMouseLeave={(e) => { e.target.style.opacity = "0.4"; }}
        >Decline</button>
      </div>
    </div>
  );
};
