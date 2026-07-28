import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { P } from "../data/palette";
import { ScrollMorphText, HoverMorphText } from "../components/MorphText";
import { SEO } from "../components/SEO";

/* ─── PORTRAIT ───────────────────────────────────────── */
const PORTRAIT_URL =
  "https://0at986lkng8uss8h.public.blob.vercel-storage.com/20-wvmXjmJW2nc3nnVRelNtBQYM84AmuN.png";

/* ─── TOOLKIT DATA ───────────────────────────────────── */
const TOOLKIT = [
  {
    category: "Visual Art",
    color: P.magenta,
    tools: ["Photoshop", "Illustrator", "Lightroom", "Digital Collage"],
  },
  {
    category: "AI Collaboration",
    color: P.cyan,
    tools: ["Midjourney", "Stable Diffusion", "ComfyUI", "Project Angel"],
  },
  {
    category: "Motion",
    color: P.amber,
    tools: ["After Effects", "Glitchcore Pipeline", "Video Art"],
  },
  {
    category: "Photography",
    color: P.ghost,
    tools: ["Street", "Urban Landscape", "Documentary", "Portrait"],
  },
  {
    category: "Code + Dev",
    color: P.green,
    tools: ["React", "Vite", "Canvas API", "Web Design"],
  },
];

/* ─── BRIDGE LINKS ───────────────────────────────────── */
const BRIDGES = [
  {
    label: "Portfolio",
    sub: "The evidence. The documentation.",
    path: "/portfolio",
    color: P.cyan,
  },
];

/* ─── PORTRAIT SECTION ───────────────────────────────── */
const PortraitSection = ({ vis }) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: 64,
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(20px)",
        transition: "all 1s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      {/* Portrait */}
      <div
        style={{
          position: "relative",
          width: 220,
          height: 220,
          marginBottom: 32,
        }}
      >
        {/* Outer glow ring */}
        <div
          style={{
            position: "absolute",
            inset: -3,
            borderRadius: "50%",
            background: `conic-gradient(from 0deg, ${P.cyan}33, ${P.magenta}33, ${P.cyan}33)`,
            animation: "morphBreathSoft 3s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 1,
            borderRadius: "50%",
            background: P.abyss,
          }}
        />
        <img
          src={PORTRAIT_URL}
          alt="Eric Mackenzie Fallis -- Winter Workday Portrait"
          onLoad={() => setImgLoaded(true)}
          style={{
            position: "relative",
            width: 220,
            height: 220,
            borderRadius: "50%",
            objectFit: "cover",
            objectPosition: "center 20%",
            filter: "saturate(0.85) contrast(1.05)",
            opacity: imgLoaded ? 1 : 0,
            transition: "opacity 0.8s ease",
          }}
        />
      </div>

      {/* Name */}
      <h1
        style={{
          fontFamily: "'Georgia', serif",
          fontSize: "clamp(26px, 4vw, 40px)",
          fontWeight: 400,
          color: P.ghost,
          margin: "0 0 8px 0",
          textAlign: "center",
        }}
      >
        <ScrollMorphText speed={80}>Eric Mackenzie Fallis</ScrollMorphText>
      </h1>

      {/* Tagline */}
      <div
        style={{
          fontFamily: "'Courier New', monospace",
          fontSize: 10,
          letterSpacing: 6,
          color: P.cyan,
          textTransform: "uppercase",
          textAlign: "center",
          marginBottom: 16,
        }}
      >
        <ScrollMorphText speed={70}>
          Trauma Integration Made Visible
        </ScrollMorphText>
      </div>

      {/* Divider */}
      <div
        style={{
          width: 40,
          height: 1,
          background: `linear-gradient(to right, ${P.magenta}, ${P.cyan})`,
        }}
      />
    </div>
  );
};

/* ─── THE WEIGHT ─────────────────────────────────────── */
const WeightSection = ({ vis }) => (
  <div
    style={{
      maxWidth: 620,
      margin: "0 auto",
      marginBottom: 80,
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(14px)",
      transition: "all 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s",
    }}
  >
    <div
      style={{
        fontFamily: "'Georgia', serif",
        fontSize: "clamp(15px, 2vw, 17px)",
        lineHeight: 2,
        color: P.bone,
        opacity: 0.75,
        animation: "morphBreathStrong 1.2s ease-in-out infinite",
      }}
    >
      <p style={{ marginTop: 0, marginBottom: 28 }}>
        The brain injury came at seven. The first time homeless, at fifteen.
        Then the spiral &mdash; years of it. Shattered, extorted, left behind.
        No stable frame could hold the whole of it.
      </p>
      <p style={{ marginBottom: 28 }}>
        Art was how I documented. Every piece a proof of life &mdash; evidence
        that something inside still wanted to get better, to be healthy, for the
        signal to be louder than the noise.
      </p>
      <p style={{ marginBottom: 28 }}>
        Nine years alone. Maybe longer. Diet, assumptions, reality testing,
        vocabulary, inner work, outer work &mdash; brick by brick, building a
        mind that could finally trust itself.
      </p>
      <p
        style={{
          marginBottom: 12,
          fontStyle: "italic",
          color: P.ghost,
          opacity: 1,
          fontSize: "clamp(16px, 2.2vw, 19px)",
        }}
      >
        I am both a beast and a god. But He who is in me is stronger than he who
        is in me.
      </p>
      <p
        style={{
          marginBottom: 0,
          fontFamily: "'Courier New', monospace",
          fontSize: 12,
          letterSpacing: 6,
          color: P.cyan,
          textTransform: "uppercase",
          opacity: 0.8,
        }}
      >
        <HoverMorphText speed={60}>Still here.</HoverMorphText>
      </p>
    </div>
  </div>
);

/* ─── CRAFT SECTION (what I do) ──────────────────────── */
const CraftSection = ({ vis }) => (
  <div
    style={{
      maxWidth: 620,
      margin: "0 auto",
      marginBottom: 80,
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(14px)",
      transition: "all 0.9s cubic-bezier(0.16,1,0.3,1) 0.35s",
    }}
  >
    <div
      style={{
        fontFamily: "'Georgia', serif",
        fontSize: "clamp(15px, 2vw, 17px)",
        lineHeight: 2,
        color: P.bone,
        opacity: 0.7,
        animation: "morphBreathStrong 1.2s ease-in-out infinite",
      }}
    >
      <p style={{ marginTop: 0, marginBottom: 28 }}>
        RareGh0st is the creative identity that came out of all of it &mdash; a
        practice of digital collage, AI-human collaboration, photography, and
        symbolic storytelling. Each piece is a dense, layered meditation on
        holding both shadow and light without collapsing either.
      </p>
      <p style={{ marginBottom: 0 }}>
        Creator of{" "}
        <em style={{ color: P.ghost, opacity: 0.9 }}>Codename Angel</em>{" "}
        &mdash; an episodic series blending philosophy, gaming, and poetic
        storytelling.         Builder of{" "}
        <em style={{ color: P.magenta }}>Project Angel</em>{" "}
        &mdash; an open framework for human-AI symbiosis. Based in Calgary,
        Alberta.
      </p>
    </div>
  </div>
);

/* ─── TOOLKIT ────────────────────────────────────────── */
const ToolkitCard = ({ group }) => {
  const [h, setH] = useState(false);
  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        padding: "20px 22px",
        borderRadius: 2,
        background: h ? `${group.color}06` : `${P.deep}88`,
        border: `1px solid ${h ? group.color + "28" : P.steel + "12"}`,
        transition: "all 0.4s",
      }}
    >
      <div
        style={{
          fontFamily: "'Courier New', monospace",
          fontSize: 10,
          letterSpacing: 4,
          color: h ? group.color : group.color + "88",
          textTransform: "uppercase",
          marginBottom: 14,
          transition: "color 0.3s",
        }}
      >
        <HoverMorphText speed={55}>{group.category}</HoverMorphText>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {group.tools.map((tool) => (
          <span
            key={tool}
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 10,
              letterSpacing: 1,
              color: P.bone,
              opacity: h ? 0.7 : 0.4,
              padding: "4px 10px",
              background: `${P.surface}88`,
              border: `1px solid ${P.steel}15`,
              borderRadius: 2,
              transition: "opacity 0.3s",
            }}
          >
            {tool}
          </span>
        ))}
      </div>
    </div>
  );
};

const ToolkitSection = ({ vis }) => (
  <div
    style={{
      maxWidth: 620,
      margin: "0 auto",
      marginBottom: 80,
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(14px)",
      transition: "all 0.9s cubic-bezier(0.16,1,0.3,1) 0.5s",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        marginBottom: 24,
      }}
    >
      <div
        style={{
          fontFamily: "'Courier New', monospace",
          fontSize: 10,
          letterSpacing: 8,
          color: P.ghost,
          textTransform: "uppercase",
          opacity: 0.5,
        }}
      >
        <ScrollMorphText speed={70}>The Toolkit</ScrollMorphText>
      </div>
      <div
        style={{
          flex: 1,
          height: 1,
          background: `linear-gradient(to right, ${P.steel}33, transparent)`,
        }}
      />
    </div>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: 2,
      }}
    >
      {TOOLKIT.map((group) => (
        <ToolkitCard key={group.category} group={group} />
      ))}
    </div>
  </div>
);

/* ─── THE BRIDGE ─────────────────────────────────────── */
const BridgeCard = ({ bridge }) => {
  const [h, setH] = useState(false);
  return (
    <Link
      to={bridge.path}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        flex: 1,
        minWidth: 160,
        padding: "22px 20px",
        borderRadius: 2,
        background: h ? `${bridge.color}08` : `${P.deep}88`,
        border: `1px solid ${h ? bridge.color + "33" : P.steel + "12"}`,
        transition: "all 0.4s",
        textDecoration: "none",
        display: "block",
        boxShadow: h ? `0 0 28px ${bridge.color}06` : "none",
      }}
    >
      <div
        style={{
          fontFamily: "'Georgia', serif",
          fontSize: 16,
          color: h ? bridge.color : P.ghost,
          transition: "color 0.3s",
          marginBottom: 6,
        }}
      >
        <HoverMorphText>{bridge.label}</HoverMorphText>
      </div>
      <div
        style={{
          fontFamily: "'Courier New', monospace",
          fontSize: 10,
          letterSpacing: 1,
          color: P.bone,
          opacity: 0.4,
          lineHeight: 1.5,
        }}
      >
        {bridge.sub}
      </div>
    </Link>
  );
};

const BridgeSection = ({ vis }) => (
  <div
    style={{
      maxWidth: 620,
      margin: "0 auto",
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(14px)",
      transition: "all 0.9s cubic-bezier(0.16,1,0.3,1) 0.65s",
    }}
  >
    <div
      style={{
        fontFamily: "'Georgia', serif",
        fontSize: 14,
        fontStyle: "italic",
        color: P.bone,
        opacity: 0.45,
        textAlign: "center",
        marginBottom: 24,
        lineHeight: 1.7,
        animation: "morphBreathSoft 1.2s ease-in-out infinite",
      }}
    >
      The art is the documentation. The framework is the protection.
    </div>
    <div style={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
      {BRIDGES.map((b) => (
        <BridgeCard key={b.label} bridge={b} />
      ))}
    </div>
  </div>
);

/* ─── MAIN ABOUT PAGE ────────────────────────────────── */
export const About = () => {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    setTimeout(() => setVis(true), 80);
  }, []);

  return (
    <div style={{ minHeight: "100vh", paddingTop: 120, paddingBottom: 80 }}>
      <SEO
        title="About"
        description="Eric Mackenzie Fallis is RareGh0st -- a digital artist, consciousness architect, and survivor who transforms lived experience into visual philosophy."
        path="/about"
      />
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 40px" }}>
        <PortraitSection vis={vis} />
        <WeightSection vis={vis} />
        <CraftSection vis={vis} />
        <ToolkitSection vis={vis} />
        <BridgeSection vis={vis} />
      </div>
    </div>
  );
};
