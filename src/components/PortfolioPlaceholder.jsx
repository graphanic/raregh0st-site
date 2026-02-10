import { useState, useRef, useCallback, useEffect } from "react";
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

const ZOOM_LEVELS = [0.5, 0.75, 1, 1.25, 1.5, 2, 3];
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 3;

const LightboxImage = ({ item, zoom, setZoom, panOffset, setPanOffset }) => {
  const [fullLoaded, setFullLoaded] = useState(false);
  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const panStart = useRef({ x: 0, y: 0 });
  const lastPinchDist = useRef(null);

  const thumbUrl = getOptimizedUrl(item.img, { width: 80, quality: 20, format: "webp" });
  // Serve full resolution for lightbox — high quality for zoom
  const fullUrl = getOptimizedUrl(item.img, { quality: 90, format: "webp" });

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.15 : 0.15;
    setZoom(prev => {
      const next = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, prev + delta));
      if (next <= 1) setPanOffset({ x: 0, y: 0 });
      return next;
    });
  }, [setZoom, setPanOffset]);

  const handlePointerDown = useCallback((e) => {
    if (zoom <= 1) return;
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    panStart.current = { ...panOffset };
    e.currentTarget.setPointerCapture(e.pointerId);
  }, [zoom, panOffset]);

  const handlePointerMove = useCallback((e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setPanOffset({ x: panStart.current.x + dx, y: panStart.current.y + dy });
  }, [setPanOffset]);

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  // Touch pinch-to-zoom
  const handleTouchStart = useCallback((e) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastPinchDist.current = Math.hypot(dx, dy);
    }
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (e.touches.length === 2 && lastPinchDist.current !== null) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const scale = dist / lastPinchDist.current;
      lastPinchDist.current = dist;
      setZoom(prev => {
        const next = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, prev * scale));
        if (next <= 1) setPanOffset({ x: 0, y: 0 });
        return next;
      });
    }
  }, [setZoom, setPanOffset]);

  const handleTouchEnd = useCallback(() => {
    lastPinchDist.current = null;
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    el.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => {
      el.removeEventListener("wheel", handleWheel);
      el.removeEventListener("touchmove", handleTouchMove);
    };
  }, [handleWheel, handleTouchMove]);

  const handleDoubleClick = useCallback((e) => {
    e.stopPropagation();
    if (zoom > 1) {
      setZoom(1);
      setPanOffset({ x: 0, y: 0 });
    } else {
      setZoom(2);
    }
  }, [zoom, setZoom, setPanOffset]);

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onDoubleClick={handleDoubleClick}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: zoom > 1 ? (isDragging.current ? "grabbing" : "grab") : "zoom-in",
        touchAction: "none",
      }}
    >
      {/* Blurred thumbnail placeholder */}
      <img
        src={thumbUrl}
        alt={item.title}
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",
          display: "block",
          filter: fullLoaded ? "none" : "blur(12px)",
          transition: "filter 0.3s ease",
          transform: `scale(${zoom}) translate(${panOffset.x / zoom}px, ${panOffset.y / zoom}px)`,
          transformOrigin: "center center",
          willChange: "transform",
          userSelect: "none",
          pointerEvents: "none",
        }}
        draggable={false}
      />
      {/* Full-resolution image */}
      <img
        src={fullUrl}
        alt=""
        loading="eager"
        fetchPriority="high"
        decoding="async"
        onLoad={() => setFullLoaded(true)}
        style={{
          position: "absolute",
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",
          opacity: fullLoaded ? 1 : 0,
          transition: "opacity 0.4s ease",
          transform: `scale(${zoom}) translate(${panOffset.x / zoom}px, ${panOffset.y / zoom}px)`,
          transformOrigin: "center center",
          willChange: "transform",
          userSelect: "none",
          pointerEvents: "none",
        }}
        draggable={false}
      />
    </div>
  );
};

const ZoomControls = ({ zoom, setZoom, setPanOffset }) => {
  const pct = Math.round(zoom * 100);
  const resetZoom = () => { setZoom(1); setPanOffset({ x: 0, y: 0 }); };
  const zoomIn = () => setZoom(prev => Math.min(ZOOM_MAX, prev + 0.25));
  const zoomOut = () => {
    setZoom(prev => {
      const next = Math.max(ZOOM_MIN, prev - 0.25);
      if (next <= 1) setPanOffset({ x: 0, y: 0 });
      return next;
    });
  };

  const btnStyle = {
    background: `${P.steel}22`,
    border: `1px solid ${P.steel}33`,
    color: P.bone,
    fontFamily: "'Courier New', monospace",
    fontSize: 14,
    width: 32,
    height: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s",
    borderRadius: 0,
  };

  return (
    <div style={{
      position: "absolute",
      bottom: 20,
      left: "50%",
      transform: "translateX(-50%)",
      display: "flex",
      alignItems: "center",
      gap: 0,
      background: `${P.abyss}dd`,
      backdropFilter: "blur(12px)",
      border: `1px solid ${P.steel}22`,
      zIndex: 10,
      userSelect: "none",
    }}>
      <button onClick={zoomOut} aria-label="Zoom out" style={btnStyle}>{"\u2212"}</button>
      <button
        onClick={resetZoom}
        aria-label="Reset zoom to 100%"
        style={{
          ...btnStyle,
          width: "auto",
          padding: "0 12px",
          fontSize: 10,
          letterSpacing: 2,
          color: zoom === 1 ? P.bone : P.cyan,
          borderLeft: `1px solid ${P.steel}33`,
          borderRight: `1px solid ${P.steel}33`,
        }}
      >
        {pct}%
      </button>
      <button onClick={zoomIn} aria-label="Zoom in" style={btnStyle}>+</button>
    </div>
  );
};

export const Lightbox = ({ item, onClose }) => {
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [showInfo, setShowInfo] = useState(true);

  // Reset zoom state when item changes
  useEffect(() => {
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
    setShowInfo(true);
  }, [item]);

  // Hide info bar when zoomed
  useEffect(() => {
    if (zoom > 1) setShowInfo(false);
    else setShowInfo(true);
  }, [zoom]);

  // Keyboard: Escape to close, +/- for zoom, 0 for reset
  useEffect(() => {
    if (!item) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "=" || e.key === "+") setZoom(prev => Math.min(ZOOM_MAX, prev + 0.25));
      if (e.key === "-") {
        setZoom(prev => {
          const next = Math.max(ZOOM_MIN, prev - 0.25);
          if (next <= 1) setPanOffset({ x: 0, y: 0 });
          return next;
        });
      }
      if (e.key === "0") { setZoom(1); setPanOffset({ x: 0, y: 0 }); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [item, onClose]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (!item) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [item]);

  if (!item) return null;

  const visibleTags = item.tags ? item.tags.slice(0, 8) : [];
  const extraCount = item.tags ? item.tags.length - 8 : 0;
  const isVideo = item.mediaType === "video" && item.img;

  return (
    <div
      onClick={() => { if (zoom <= 1) onClose(); }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        background: `${P.abyss}f8`,
        backdropFilter: "blur(24px)",
        display: "flex",
        flexDirection: "column",
        cursor: zoom > 1 ? "default" : "pointer",
        animation: "fadeSlideIn 0.2s ease",
      }}
    >
      {/* Close button */}
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        aria-label="Close lightbox"
        style={{
          position: "absolute",
          top: 16,
          right: 20,
          background: `${P.steel}22`,
          border: `1px solid ${P.steel}33`,
          color: P.bone,
          fontFamily: "'Courier New', monospace",
          fontSize: 16,
          width: 36,
          height: 36,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          opacity: 0.6,
          zIndex: 10,
          transition: "opacity 0.2s",
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
        onMouseLeave={(e) => e.currentTarget.style.opacity = "0.6"}
      >
        {"\u2715"}
      </button>

      {/* Main image area — fills viewport */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "56px 16px 16px",
          minHeight: 0,
          position: "relative",
          cursor: "default",
        }}
      >
        {isVideo ? (
          <video
            src={item.img}
            autoPlay
            loop
            muted
            playsInline
            controls
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              display: "block",
              background: P.abyss,
            }}
          />
        ) : item.img ? (
          <LightboxImage
            item={item}
            zoom={zoom}
            setZoom={setZoom}
            panOffset={panOffset}
            setPanOffset={setPanOffset}
          />
        ) : (
          <PortfolioPlaceholder colors={item.colors} aspect="1" />
        )}

        {/* Zoom controls */}
        {!isVideo && item.img && (
          <ZoomControls zoom={zoom} setZoom={setZoom} setPanOffset={setPanOffset} />
        )}
      </div>

      {/* Info bar at bottom — hides when zoomed */}
      <div
        style={{
          padding: "12px 24px 16px",
          textAlign: "center",
          background: `linear-gradient(to top, ${P.abyss}ee, ${P.abyss}aa, transparent)`,
          opacity: showInfo ? 1 : 0,
          transform: showInfo ? "translateY(0)" : "translateY(8px)",
          transition: "all 0.3s ease",
          pointerEvents: showInfo ? "auto" : "none",
          flexShrink: 0,
        }}
      >
        <div style={{ fontFamily: "'Georgia', serif", fontSize: 17, color: P.ghost }}>{item.title}</div>
        {item.process && (
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: item.colors?.[0] || P.cyan, letterSpacing: 3, marginTop: 6 }}>{item.process}</div>
        )}
        {item.description && (
          <div style={{ fontFamily: "'Georgia', serif", fontSize: 12, color: P.bone, opacity: 0.5, marginTop: 6, maxWidth: 560, margin: "6px auto 0", lineHeight: 1.5 }}>{item.description}</div>
        )}
        {visibleTags.length > 0 && (
          <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 10, flexWrap: "wrap" }}>
            {visibleTags.map(t => (
              <span key={t} style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: P.bone, opacity: 0.3, letterSpacing: 2, textTransform: "uppercase", padding: "3px 8px", border: `1px solid ${P.steel}15` }}>{t}</span>
            ))}
            {extraCount > 0 && <span style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: P.bone, opacity: 0.2, padding: "3px 8px" }}>+{extraCount}</span>}
          </div>
        )}
      </div>
    </div>
  );
};
