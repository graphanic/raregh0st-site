import { P } from "../data/palette";

const ps = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 1.6 + 0.4,
  dur: Math.random() * 18 + 14,
  delay: Math.random() * -18,
  color: [P.cyan, P.magenta, P.purple][Math.floor(Math.random() * 3)],
  opacity: Math.random() * 0.18 + 0.04,
}));

export const Particles = () => (
  <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1 }}>
    {ps.map(p => (
      <div
        key={p.id}
        style={{
          position: "absolute",
          left: `${p.x}%`,
          top: `${p.y}%`,
          width: p.size * 3,
          height: p.size * 3,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${p.color} 30%, transparent 70%)`,
          opacity: p.opacity,
          animation: `floatP ${p.dur}s ease-in-out ${p.delay}s infinite`,
          willChange: "transform",
        }}
      />
    ))}
  </div>
);
