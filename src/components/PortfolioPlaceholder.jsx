import { useState } from "react";
import { P } from "../data/palette";

export const PortfolioPlaceholder = ({ colors, aspect = "4/5" }) => (
  <div style={{
    width: "100%",
    aspectRatio: aspect,
    background: `linear-gradient(135deg, ${P.abyss}, ${colors[0]}0c, ${colors[1] || colors[0]}0e, ${P.abyss})`,
    position: "relative",
    overflow: "hidden",
  }}>
    <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.006) 2px, rgba(255,255,255,0.006) 4px)" }} />
  </div>
);

const getOptimizedUrl = (url, { width, height, quality = 75, format = "webp" } = {}) => {
  if (!url || !url.includes('vercel-storage.com')) return url;
  const params = [];
  if (format) params.push(`format=${format}`);
  if (width) params.push(`width=${width}`);
  if (height) params.push(`height=${height}`);
  if (quality) params.push(`quality=${quality}`);
  return `${url}?${params.join('&')}`;
};

const LightboxImage = ({ item }) => {
  const [fullLoaded, setFullLoaded] = useState(false);
  const thumbUrl = getOptimizedUrl(item.img, { width: 80, quality: 20, format: "webp" });
  const fullUrl = getOptimizedUrl(item.img, { height: 1200, quality: 80, format: "webp" });

  return (
    <div style={{ position: "relative", width: "100%", maxHeight: "70vh", aspectRatio: "auto" }}>
      <img
        src={thumbUrl}
        alt={item.title}
        style={{ width: "100%", maxHeight: "70vh", objectFit: "contain", display: "block", filter: fullLoaded ? "none" : "blur(8px)", transition: "filter 0.3s ease" }}
      />
      <img
        src={fullUrl}
        alt=""
        loading="eager"
        fetchPriority="high"
        decoding="async"
        onLoad={() => setFullLoaded(true)}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", opacity: fullLoaded ? 1 : 0, transition: "opacity 0.4s ease" }}
      />
    </div>
  );
};

export const Lightbox = ({ item, onClose }) => {
  if (!item) return null;
  const visibleTags = item.tags ? item.tags.slice(0, 8) : [];
  const extraCount = item.tags ? item.tags.length - 8 : 0;

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 300, background: `${P.abyss}f0`, backdropFilter: "blur(20px)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", animation: "fadeSlideIn 0.2s ease" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: 800, width: "90%", cursor: "default" }}>
        {item.img ? (
          <LightboxImage item={item} />
        ) : (
          <PortfolioPlaceholder colors={item.colors} aspect="1" />
        )}
        <div style={{ marginTop: 20, textAlign: "center" }}>
          <div style={{ fontFamily: "'Georgia', serif", fontSize: 18, color: P.ghost }}>{item.title}</div>
          {item.process && <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: item.colors[0], letterSpacing: 3, marginTop: 8 }}>{item.process}</div>}
          {item.description && <div style={{ fontFamily: "'Georgia', serif", fontSize: 12, color: P.bone, opacity: 0.5, marginTop: 8, maxWidth: 500, margin: "8px auto 0" }}>{item.description}</div>}
          {visibleTags.length > 0 && (
            <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 12, flexWrap: "wrap" }}>
              {visibleTags.map(t => (
                <span key={t} style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: P.bone, opacity: 0.3, letterSpacing: 2, textTransform: "uppercase", padding: "3px 8px", border: `1px solid ${P.steel}15` }}>{t}</span>
              ))}
              {extraCount > 0 && <span style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: P.bone, opacity: 0.2, padding: "3px 8px" }}>+{extraCount}</span>}
            </div>
          )}
        </div>
        <button onClick={onClose} aria-label="Close lightbox" style={{ position: "absolute", top: 20, right: 24, background: "none", border: "none", color: P.bone, fontFamily: "'Courier New', monospace", fontSize: 18, cursor: "pointer", opacity: 0.4 }}>{"\u2715"}</button>
      </div>
    </div>
  );
};
