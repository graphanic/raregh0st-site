import { useState, useRef, useEffect } from "react";
import { P } from "../data/palette";

/**
 * Lazy-loading iframe wrapper with shimmer skeleton and error fallback.
 * Only loads the iframe when it enters the viewport (IntersectionObserver).
 */
export const EmbedFrame = ({
  src,
  title,
  width = 480,
  height = 270,
  color = P.cyan,
  fallbackUrl,
  fallbackLabel = "Visit",
  style = {},
  allow = "",
  sandbox,
  onFrameLoad,
}) => {
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        width,
        height,
        minWidth: width,
        borderRadius: 3,
        overflow: "hidden",
        position: "relative",
        background: `linear-gradient(135deg, ${P.abyss}, ${color}06, ${P.abyss})`,
        border: `1px solid ${P.steel}15`,
        ...style,
      }}
    >
      {/* Shimmer skeleton while loading */}
      {!loaded && !error && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: `2px solid ${color}30`,
              borderTopColor: color,
              animation: "spin 1s linear infinite",
            }}
          />
          <span
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 9,
              letterSpacing: 3,
              color: P.bone,
              opacity: 0.3,
              textTransform: "uppercase",
            }}
          >
            Loading
          </span>
          {/* Scanline overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.006) 3px, rgba(255,255,255,0.006) 6px)",
              pointerEvents: "none",
            }}
          />
        </div>
      )}

      {/* Error fallback */}
      {error && fallbackUrl && (
        <a
          href={fallbackUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          <span
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 10,
              letterSpacing: 3,
              color,
              textTransform: "uppercase",
            }}
          >
            {fallbackLabel}
          </span>
          <span
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 9,
              color: P.bone,
              opacity: 0.3,
            }}
          >
            Embed unavailable
          </span>
        </a>
      )}

      {/* The actual iframe */}
      {visible && !error && (
        <iframe
          src={src}
          title={title}
          width="100%"
          height="100%"
          style={{
            border: "none",
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.5s ease",
          }}
          loading="lazy"
          allow={allow}
          sandbox={sandbox}
          onLoad={() => { setLoaded(true); if (onFrameLoad) onFrameLoad(); }}
          onError={() => setError(true)}
        />
      )}
    </div>
  );
};
