import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { P } from "../../data/palette";
import { MorphText, HoverMorphText } from "../MorphText";

// Frontend-only inquiry / commission form. Submitting shows a success state;
// no data is persisted yet (wire to a backend later).
export function InquireModal({ open, mode, piece, onClose, isMobile }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (open) {
      setSent(false);
      setForm({ name: "", email: "", message: "" });
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [open, mode, piece]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const isCommission = mode === "commission";
  const accent = isCommission ? P.cyan : P.magenta;
  const title = isCommission ? "Commission a Piece" : "Inquire";
  const kicker = piece ? `${piece.title} · ${piece.year}` : "Direct to the studio";
  const canSend = form.email.trim() && form.message.trim();

  const submit = (e) => {
    e.preventDefault();
    if (!canSend) return;
    setSent(true);
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 320,
        background: `${P.abyss}f2`,
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: isMobile ? 16 : 32,
        animation: "fadeSlideIn 0.3s ease both",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 480,
          background: `linear-gradient(150deg, ${P.void} 0%, ${P.surface} 100%)`,
          border: `1px solid ${accent}44`,
          borderRadius: 4,
          padding: isMobile ? "32px 24px" : "40px 40px",
          boxShadow: `0 0 60px ${accent}22`,
        }}
      >
        <button onClick={onClose} aria-label="Close" style={closeBtn}>✕</button>

        {sent ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: 20, letterSpacing: 3, color: accent, textTransform: "uppercase", marginBottom: 16 }}>
              <MorphText speed={60}>Signal Sent</MorphText>
            </div>
            <p style={{ fontFamily: "'Georgia', serif", fontStyle: "italic", fontSize: 15, lineHeight: 1.6, color: P.bone, opacity: 0.8, margin: "0 0 28px" }}>
              Your message is in the void — the artist will reach back soon. Thank you for looking closely.
            </p>
            <button onClick={onClose} style={{ ...actionBtn(accent), width: "100%" }}>
              <HoverMorphText>Close</HoverMorphText>
            </button>
          </div>
        ) : (
          <>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: 8, letterSpacing: 4, color: accent, textTransform: "uppercase", marginBottom: 10 }}>
              {kicker}
            </div>
            <h2 style={{ fontFamily: "'Courier New', monospace", fontSize: 24, fontWeight: 400, letterSpacing: 2, color: P.ghost, textTransform: "uppercase", margin: "0 0 8px" }}>
              <MorphText speed={70}>{title}</MorphText>
            </h2>
            <p style={{ fontFamily: "'Georgia', serif", fontStyle: "italic", fontSize: 13, lineHeight: 1.6, color: P.bone, opacity: 0.6, margin: "0 0 24px" }}>
              {isCommission
                ? "Tell me what you want made visible — theme, size, and the story behind it."
                : "Ask about this piece, prints, or availability. I read every message myself."}
            </p>

            <form onSubmit={submit} style={{ display: "grid", gap: 14 }}>
              <Field label="Name" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} accent={accent} />
              <Field label="Email" type="email" required value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} accent={accent} />
              <Field label={isCommission ? "Your vision" : "Message"} textarea required value={form.message} onChange={(v) => setForm((f) => ({ ...f, message: v }))} accent={accent} />
              <button type="submit" disabled={!canSend} style={{ ...actionBtn(accent), opacity: canSend ? 1 : 0.4, cursor: canSend ? "pointer" : "not-allowed" }}>
                <HoverMorphText>{isCommission ? "Send Commission Request" : "Send Inquiry"}</HoverMorphText>
              </button>
            </form>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}

function Field({ label, value, onChange, type = "text", textarea, required, accent }) {
  const [focus, setFocus] = useState(false);
  const base = {
    fontFamily: "'Courier New', monospace",
    fontSize: 13,
    color: P.ghost,
    background: P.abyss,
    border: `1px solid ${focus ? accent + "88" : P.steel + "55"}`,
    borderRadius: 2,
    padding: "12px 14px",
    width: "100%",
    outline: "none",
    transition: "border-color 0.2s ease",
    boxSizing: "border-box",
  };
  return (
    <label style={{ display: "block" }}>
      <span style={{ display: "block", fontFamily: "'Courier New', monospace", fontSize: 8, letterSpacing: 3, color: P.bone, opacity: 0.5, textTransform: "uppercase", marginBottom: 6 }}>
        {label}{required ? " *" : ""}
      </span>
      {textarea ? (
        <textarea
          value={value}
          required={required}
          rows={4}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          onChange={(e) => onChange(e.target.value)}
          style={{ ...base, resize: "vertical", minHeight: 96 }}
        />
      ) : (
        <input
          type={type}
          value={value}
          required={required}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          onChange={(e) => onChange(e.target.value)}
          style={base}
        />
      )}
    </label>
  );
}

const closeBtn = {
  position: "absolute",
  top: 14,
  right: 14,
  width: 30,
  height: 30,
  borderRadius: 3,
  background: "transparent",
  border: `1px solid ${P.steel}55`,
  color: P.bone,
  fontSize: 12,
  cursor: "pointer",
};

const actionBtn = (accent) => ({
  fontFamily: "'Courier New', monospace",
  fontSize: 11,
  letterSpacing: 3,
  textTransform: "uppercase",
  color: P.abyss,
  background: accent,
  border: `1px solid ${accent}`,
  borderRadius: 2,
  padding: "14px 20px",
  transition: "all 0.25s ease",
});
