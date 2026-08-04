import { useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { P } from "../../data/palette";
import { getCategory } from "../../data/catalog";
import { MorphText, HoverMorphText } from "../MorphText";

// Fullscreen "flip through the portfolio" focus mode.
// Keyboard: ← / → to move, Esc to close. Touch: swipe left/right.
export function GalleryFocus({ pieces, index, onClose, onNav, onView, isMobile }) {
  const touchX = useRef(null);
  const piece = pieces[index];

  const handleKey = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onNav(1);
      else if (e.key === "ArrowLeft") onNav(-1);
    },
    [onClose, onNav]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [handleKey]);

  if (!piece) return null;

  const accent = piece.colors?.[0] || P.cyan;
  const category = getCategory(piece.primaryCategory);
  const isVideo = piece.mediaType === "video";

  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 50) onNav(dx < 0 ? 1 : -1);
    touchX.current = null;
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${piece.title}, artwork ${index + 1} of ${pieces.length}`}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        background: `${P.abyss}f7`,
        backdropFilter: "blur(14px)",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: "center",
        justifyContent: "center",
        padding: isMobile ? "70px 16px 24px" : "48px 72px",
        gap: isMobile ? 18 : 44,
        animation: "fadeSlideIn 0.35s ease both",
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Close */}
      <button
        onClick={onClose}
        aria-label="Close focus view"
        style={{ ...iconBtn, position: "fixed", top: 20, right: 20 }}
      >
        ✕
      </button>

      {/* Counter */}
      <div
        style={{
          position: "fixed",
          top: 24,
          left: 24,
          fontFamily: "'Courier New', monospace",
          fontSize: 10,
          letterSpacing: 4,
          color: P.bone,
          opacity: 0.55,
        }}
      >
        {String(index + 1).padStart(2, "0")} / {String(pieces.length).padStart(2, "0")}
      </div>

      {/* Prev / Next (desktop) */}
      {!isMobile && (
        <>
          <button onClick={(e) => { e.stopPropagation(); onNav(-1); }} aria-label="Previous artwork" style={{ ...navBtn, left: 20 }}>‹</button>
          <button onClick={(e) => { e.stopPropagation(); onNav(1); }} aria-label="Next artwork" style={{ ...navBtn, right: 20 }}>›</button>
        </>
      )}

      {/* Media */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          flex: isMobile ? "0 0 auto" : "1 1 58%",
          maxWidth: isMobile ? "100%" : "58%",
          maxHeight: isMobile ? "46vh" : "82vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isVideo ? (
          <video
            src={piece.img}
            controls
            autoPlay
            loop
            muted
            playsInline
            style={{ maxWidth: "100%", maxHeight: isMobile ? "46vh" : "82vh", borderRadius: 3, border: `1px solid ${accent}44`, boxShadow: `0 0 60px ${accent}22` }}
          />
        ) : (
          <img
            src={piece.img}
            alt={piece.title}
            style={{ maxWidth: "100%", maxHeight: isMobile ? "46vh" : "82vh", objectFit: "contain", borderRadius: 3, border: `1px solid ${accent}33`, boxShadow: `0 0 60px ${accent}22` }}
          />
        )}
      </div>

      {/* Metadata panel */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          flex: isMobile ? "1 1 auto" : "0 0 340px",
          maxWidth: isMobile ? "100%" : 340,
          textAlign: "left",
          overflowY: isMobile ? "auto" : "visible",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <span
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 8,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: category?.color || accent,
              border: `1px solid ${category?.color || accent}55`,
              borderRadius: 2,
              padding: "3px 8px",
            }}
          >
            {category?.label}
          </span>
          <span style={{ fontFamily: "'Courier New', monospace", fontSize: 8, letterSpacing: 3, color: accent, textTransform: "uppercase" }}>
            {[piece.series, piece.year].filter(Boolean).join(" · ")}
          </span>
        </div>

        <h2
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: isMobile ? 20 : 26,
            fontWeight: 400,
            letterSpacing: 2,
            color: P.ghost,
            textTransform: "uppercase",
            lineHeight: 1.2,
            margin: "0 0 16px",
          }}
        >
          <MorphText speed={60}>{piece.title}</MorphText>
        </h2>

        <p style={{ fontFamily: "'Georgia', serif", fontStyle: "italic", fontSize: 14, lineHeight: 1.6, color: P.bone, opacity: 0.75, margin: "0 0 20px" }}>
          {piece.description}
        </p>

        <dl style={{ margin: "0 0 24px", display: "grid", gap: 10 }}>
          <MetaRow label="Medium" value={piece.medium} />
          {piece.sourceTitle ? <MetaRow label="Source" value={piece.sourceTitle} /> : null}
          {piece.printEdition ? <MetaRow label="Edition" value={`Signed print edition of ${piece.printEdition.size}`} accent={P.gold} /> : null}
          {piece.tags?.length ? <MetaRow label="Motifs" value={piece.tags.join(" · ")} /> : null}
        </dl>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <FocusBtn color={accent} filled onClick={() => onView(piece)}>View Work</FocusBtn>
        </div>
        {piece.printEdition ? (
          <div style={{ marginTop: 14, fontFamily: "'Courier New', monospace", fontSize: 8, letterSpacing: 2, color: P.gold, opacity: 0.7, textTransform: "uppercase" }}>
            Print release coming soon
          </div>
        ) : null}

        <div style={{ marginTop: 22, fontFamily: "'Courier New', monospace", fontSize: 8, letterSpacing: 3, color: P.bone, opacity: 0.35, textTransform: "uppercase" }}>
          {isMobile ? "Swipe to move · tap outside to close" : "← → to move · Esc to close"}
        </div>
      </div>
    </div>,
    document.body
  );
}

function MetaRow({ label, value, accent }) {
  if (!value) return null;
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "baseline" }}>
      <dt style={{ flex: "0 0 62px", fontFamily: "'Courier New', monospace", fontSize: 8, letterSpacing: 2, color: P.bone, opacity: 0.4, textTransform: "uppercase" }}>{label}</dt>
      <dd style={{ margin: 0, fontFamily: "'Courier New', monospace", fontSize: 11, letterSpacing: 1, color: accent || P.ghost, lineHeight: 1.5 }}>{value}</dd>
    </div>
  );
}

function FocusBtn({ color, filled, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "'Courier New', monospace",
        fontSize: 10,
        letterSpacing: 3,
        textTransform: "uppercase",
        cursor: "pointer",
        color: filled ? P.abyss : color,
        background: filled ? color : "transparent",
        border: `1px solid ${color}`,
        borderRadius: 2,
        padding: "12px 20px",
        transition: "all 0.25s ease",
      }}
      onMouseEnter={(e) => { if (!filled) { e.currentTarget.style.background = color; e.currentTarget.style.color = P.abyss; } }}
      onMouseLeave={(e) => { if (!filled) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = color; } }}
    >
      <HoverMorphText>{children}</HoverMorphText>
    </button>
  );
}

const iconBtn = {
  zIndex: 310,
  width: 38,
  height: 38,
  borderRadius: 3,
  background: `${P.surface}cc`,
  border: `1px solid ${P.steel}55`,
  color: P.ghost,
  fontFamily: "'Courier New', monospace",
  fontSize: 14,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const navBtn = {
  position: "fixed",
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 310,
  width: 46,
  height: 46,
  borderRadius: "50%",
  background: `${P.surface}cc`,
  border: `1px solid ${P.steel}55`,
  color: P.ghost,
  fontFamily: "'Courier New', monospace",
  fontSize: 24,
  lineHeight: 1,
  cursor: "pointer",
};
