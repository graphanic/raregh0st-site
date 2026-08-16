import { useState, useEffect } from "react";
import { P } from "../data/palette";
import { saveLocal } from "../utils/storage";
import {
  ANALYTICS_CONSENT,
  ANALYTICS_CONSENT_KEY,
} from "../lib/apolloTracker";

export const CookieConsent = ({ consent, onConsentChange }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (consent) {
      setVisible(false);
      return;
    }
    const timer = setTimeout(() => setVisible(true), 2500);
    return () => clearTimeout(timer);
  }, [consent]);

  const handleChoice = (choice) => {
    saveLocal(ANALYTICS_CONSENT_KEY, choice);
    onConsentChange?.(choice);
  };

  if (consent || !visible) return null;

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
          We use essential storage for site preferences. With your permission,
          Apollo analytics helps us understand visits and improve the site. Apollo
          loads only if you allow analytics. <a href="/privacy" style={{ color: P.cyan }}>Privacy details</a>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => handleChoice(ANALYTICS_CONSENT.ESSENTIAL)} style={{
          background: "none", border: `1px solid ${P.steel}22`, color: P.bone,
          fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 2,
          padding: "8px 16px", cursor: "pointer", textTransform: "uppercase", opacity: 0.55, transition: "all 0.3s",
        }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.8"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.55"; }}
        >Essential only</button>
        <button onClick={() => handleChoice(ANALYTICS_CONSENT.ALLOW)} style={{
          background: `${P.cyan}12`, border: `1px solid ${P.cyan}30`, color: P.ghost,
          fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 2,
          padding: "8px 16px", cursor: "pointer", textTransform: "uppercase", transition: "all 0.3s",
        }}
          onMouseEnter={(e) => { e.currentTarget.style.background = `${P.cyan}22`; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = `${P.cyan}12`; }}
        >Allow analytics</button>
      </div>
    </div>
  );
};
