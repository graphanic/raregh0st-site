/**
 * StarBackground — layered deep-field star images
 * Stars1 sits on the bottom; Stars2 overlays it and
 * rapidly flickers between 0 % and 100 % opacity.
 */
export const StarBackground = () => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 0,
      pointerEvents: "none",
      overflow: "hidden",
    }}
    aria-hidden="true"
  >
    {/* Layer 1 — static base */}
    <img
      src="/images/Stars1.png"
      alt=""
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
      }}
    />

    {/* Layer 2 — rapid flicker overlay */}
    <img
      src="/images/Stars2.png"
      alt=""
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
        animation: "starFlicker 0.3s steps(2, jump-none) infinite",
        willChange: "opacity",
      }}
    />
  </div>
);
