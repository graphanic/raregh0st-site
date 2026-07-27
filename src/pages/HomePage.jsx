import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { P, ART_IMGS, LOGO_IMG } from "../data/palette";
import { PIECES } from "../data/pieces";
import { SEO } from "../components/SEO";
import { MorphText, HoverMorphText, ScrollMorphText } from "../components/MorphText";
import { useIsMobile } from "../hooks/useIsMobile";

// Destination cards — functionally replace the orbiting solar-system nav
const DESTINATIONS = [
  { label: "Portfolio", dest: "/portfolio", color: P.cyan, desc: "Curated Works" },
  { label: "Shop", dest: "/shop", color: P.gold, desc: "Prints & Originals" },
  { label: "Media", dest: "/media", color: P.magenta, desc: "Motion & Sound" },
  { label: "The Work", dest: "/the-work", color: P.purple, desc: "Process & Philosophy" },
  { label: "Now", dest: "/now", color: P.green, desc: "Current Status" },
  { label: "About", dest: "/about", color: P.bone, desc: "The Artist" },
  { label: "Contact", dest: "/contact", color: P.bone, desc: "Get In Touch" },
];

const MANTRAS = ["Coherence over intensity", "Presence over performance", "Join the signal"];

// ─── HERO ────────────────────────────────────────────────
function HeroSection({ isMobile }) {
  return (
    <section
      style={{
        position: "relative",
        minHeight: isMobile ? "88vh" : "94vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: isMobile ? "100px 24px 60px" : "120px 32px 80px",
        overflow: "hidden",
      }}
    >
      {/* Art backdrop */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${ART_IMGS[2]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.16,
          filter: "saturate(1.1)",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 50% 45%, ${P.abyss}66 0%, ${P.abyss}d9 55%, ${P.abyss} 82%)`,
        }}
      />

      <div style={{ position: "relative", zIndex: 2, animation: "fadeSlideIn 1s ease both" }}>
        <img
          src={LOGO_IMG}
          alt="RareGh0st"
          style={{
            width: isMobile ? 52 : 68,
            height: isMobile ? 52 : 68,
            marginBottom: 28,
            animation: "logoHueShift 8s ease-in-out infinite",
          }}
        />
        <div
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: isMobile ? 9 : 11,
            letterSpacing: isMobile ? 7 : 10,
            color: P.magenta,
            textTransform: "uppercase",
            marginBottom: 20,
          }}
        >
          <MorphText speed={90}>The Art of</MorphText>
        </div>
        <h1
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: isMobile ? 46 : 104,
            fontWeight: 400,
            letterSpacing: isMobile ? 4 : 10,
            lineHeight: 1,
            margin: 0,
          }}
        >
          <span style={{ color: P.cyan }}>RARE</span>
          <span style={{ color: P.magenta }}>GH</span>
          <span style={{ color: P.ghost }}>0</span>
          <span style={{ color: P.magenta }}>ST</span>
        </h1>
        <div
          style={{
            fontFamily: "'Georgia', serif",
            fontStyle: "italic",
            fontSize: isMobile ? 14 : 19,
            color: P.bone,
            opacity: 0.7,
            marginTop: 26,
            maxWidth: 560,
            marginLeft: "auto",
            marginRight: "auto",
            lineHeight: 1.6,
          }}
        >
          Dark digital collage born from what we survive — grief, static, and
          the slow work of putting a mind back together.
        </div>
        <div
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: isMobile ? 8 : 9,
            letterSpacing: 6,
            color: P.cyan,
            textTransform: "uppercase",
            marginTop: 22,
            opacity: 0.75,
          }}
        >
          <MorphText speed={70}>Trauma Integration Made Visible</MorphText>
        </div>

        <div
          style={{
            display: "flex",
            gap: 14,
            justifyContent: "center",
            marginTop: 40,
            flexWrap: "wrap",
          }}
        >
          <CtaButton to="/portfolio" color={P.cyan}>Enter the Portfolio</CtaButton>
          <CtaButton to="/shop" color={P.gold}>Browse the Shop</CtaButton>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 26,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2,
          fontFamily: "'Courier New', monospace",
          fontSize: 8,
          letterSpacing: 5,
          color: P.bone,
          opacity: 0.35,
          textTransform: "uppercase",
          animation: "morphBreathStrong 2s ease-in-out infinite",
        }}
      >
        Scroll ↓
      </div>
    </section>
  );
}

function CtaButton({ to, color, children }) {
  const [hover, setHover] = useState(false);
  return (
    <Link
      to={to}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        fontFamily: "'Courier New', monospace",
        fontSize: 11,
        letterSpacing: 4,
        textTransform: "uppercase",
        color: hover ? P.abyss : color,
        background: hover ? color : "transparent",
        border: `1px solid ${color}`,
        borderRadius: 2,
        padding: "14px 26px",
        textDecoration: "none",
        transition: "all 0.3s ease",
        boxShadow: hover ? `0 0 24px ${color}55` : "none",
      }}
    >
      <HoverMorphText>{children}</HoverMorphText>
    </Link>
  );
}

// ─── SECTION HEADING ─────────────────────────────────────
function SectionHead({ kicker, title, color = P.cyan, link, linkLabel }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        flexWrap: "wrap",
        gap: 12,
        marginBottom: 32,
      }}
    >
      <div>
        <div
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: 9,
            letterSpacing: 6,
            color,
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          {kicker}
        </div>
        <h2
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: 3,
            color: P.ghost,
            margin: 0,
            textTransform: "uppercase",
          }}
        >
          <ScrollMorphText>{title}</ScrollMorphText>
        </h2>
      </div>
      {link && (
        <Link
          to={link}
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: 9,
            letterSpacing: 3,
            color: P.bone,
            textTransform: "uppercase",
            textDecoration: "none",
            opacity: 0.6,
            borderBottom: `1px solid ${P.steel}55`,
            paddingBottom: 4,
          }}
        >
          <HoverMorphText>{linkLabel}</HoverMorphText>
        </Link>
      )}
    </div>
  );
}

// ─── FEATURED WORKS ──────────────────────────────────────
function WorkCard({ piece, large }) {
  const [hover, setHover] = useState(false);
  const accent = piece.colors?.[0] || P.cyan;
  return (
    <Link
      to={`/portfolio/${piece.id}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        display: "block",
        textDecoration: "none",
        borderRadius: 3,
        overflow: "hidden",
        border: `1px solid ${hover ? accent + "66" : P.steel + "22"}`,
        background: P.void,
        gridColumn: large ? "span 2" : "span 1",
        gridRow: large ? "span 2" : "span 1",
        transition: "border-color 0.3s ease",
        boxShadow: hover ? `0 0 32px ${accent}22` : "none",
      }}
    >
      <div style={{ position: "relative", width: "100%", height: "100%", minHeight: large ? 360 : 220 }}>
        <img
          src={piece.img}
          alt={piece.title}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: hover ? 1 : 0.82,
            transform: hover ? "scale(1.04)" : "scale(1)",
            transition: "all 0.5s ease",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(to top, ${P.abyss}f2 0%, ${P.abyss}55 45%, transparent 100%)`,
          }}
        />
        <div style={{ position: "absolute", left: 16, right: 16, bottom: 14 }}>
          <div
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 8,
              letterSpacing: 3,
              color: accent,
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            {piece.series} · {piece.year}
          </div>
          <div
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: large ? 18 : 13,
              fontWeight: 700,
              letterSpacing: 1,
              color: P.ghost,
              textTransform: "uppercase",
              lineHeight: 1.2,
            }}
          >
            <HoverMorphText>{piece.title}</HoverMorphText>
          </div>
        </div>
      </div>
    </Link>
  );
}

function FeaturedWorks({ isMobile }) {
  const featured = PIECES.filter((p) => p.mediaType !== "video").slice(0, 5);
  return (
    <section style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "60px 24px" : "90px 32px" }}>
      <SectionHead
        kicker="Selected Works"
        title="The Gallery"
        color={P.cyan}
        link="/portfolio"
        linkLabel="View All →"
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)",
          gridAutoRows: isMobile ? "auto" : "180px",
          gap: 14,
        }}
      >
        {featured.map((piece, i) => (
          <WorkCard key={piece.id} piece={piece} large={!isMobile && i === 0} />
        ))}
      </div>
    </section>
  );
}

// ─── DESTINATIONS (replaces solar-system nav) ────────────
function DestinationCard({ item }) {
  const [hover, setHover] = useState(false);
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(item.dest)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        textAlign: "left",
        cursor: "pointer",
        background: hover ? `${item.color}12` : `${item.color}06`,
        border: `1px solid ${item.color}${hover ? "55" : "22"}`,
        borderRadius: 3,
        padding: "22px 22px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        transition: "all 0.3s ease",
        boxShadow: hover ? `0 0 24px ${item.color}22` : "none",
      }}
    >
      <div>
        <div
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: 14,
            letterSpacing: 4,
            color: item.color,
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          <HoverMorphText>{item.label}</HoverMorphText>
        </div>
        <div
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: 11,
            color: P.bone,
            opacity: 0.4,
            marginTop: 6,
          }}
        >
          {item.desc}
        </div>
      </div>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke={item.color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ opacity: hover ? 0.9 : 0.4, transform: hover ? "translateX(3px)" : "none", transition: "all 0.3s ease", flexShrink: 0 }}
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  );
}

function Destinations({ isMobile }) {
  return (
    <section
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: isMobile ? "60px 24px" : "90px 32px",
        borderTop: `1px solid ${P.steel}12`,
      }}
    >
      <SectionHead kicker="Navigate" title="Enter the System" color={P.magenta} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
          gap: 14,
        }}
      >
        {DESTINATIONS.map((item) => (
          <DestinationCard key={item.dest} item={item} />
        ))}
      </div>
    </section>
  );
}

// ─── MANIFESTO ───────────────────────────────────────────
function Manifesto({ isMobile }) {
  return (
    <section
      style={{
        position: "relative",
        padding: isMobile ? "80px 24px" : "120px 32px",
        textAlign: "center",
        borderTop: `1px solid ${P.steel}12`,
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 50% 50%, ${P.purple}0d 0%, transparent 60%)`,
        }}
      />
      <div style={{ position: "relative", zIndex: 2, maxWidth: 720, margin: "0 auto" }}>
        <div
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: 9,
            letterSpacing: 6,
            color: P.purple,
            textTransform: "uppercase",
            marginBottom: 24,
          }}
        >
          The Philosophy
        </div>
        <p
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: isMobile ? 20 : 30,
            lineHeight: 1.5,
            color: P.ghost,
            margin: 0,
            fontStyle: "italic",
          }}
        >
          <ScrollMorphText speed={80}>
            Nothing here is decoration. Every piece is a wound made legible — the
            static turned into signal, the collapse rebuilt into form.
          </ScrollMorphText>
        </p>
        <div
          style={{
            display: "flex",
            gap: isMobile ? 14 : 28,
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: 44,
          }}
        >
          {MANTRAS.map((m) => (
            <div
              key={m}
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: 9,
                letterSpacing: 3,
                color: P.cyan,
                textTransform: "uppercase",
                opacity: 0.65,
              }}
            >
              <HoverMorphText>{m}</HoverMorphText>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SHOP CTA ────────────────────────────────────────────
function ShopCta({ isMobile }) {
  const [hover, setHover] = useState(false);
  return (
    <section style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "0 24px 70px" : "0 32px 100px" }}>
      <Link
        to="/shop"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          position: "relative",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "flex-start" : "center",
          justifyContent: "space-between",
          gap: 20,
          textDecoration: "none",
          overflow: "hidden",
          borderRadius: 4,
          border: `1px solid ${hover ? P.gold + "66" : P.gold + "22"}`,
          padding: isMobile ? "36px 28px" : "48px 52px",
          background: `linear-gradient(120deg, ${P.void} 0%, ${P.surface} 100%)`,
          transition: "border-color 0.3s ease",
          boxShadow: hover ? `0 0 40px ${P.gold}1f` : "none",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${ART_IMGS[0]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.1,
          }}
        />
        <div style={{ position: "relative", zIndex: 2 }}>
          <div
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 9,
              letterSpacing: 6,
              color: P.gold,
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            Prints & Originals
          </div>
          <div
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: isMobile ? 22 : 30,
              fontWeight: 700,
              letterSpacing: 2,
              color: P.ghost,
              textTransform: "uppercase",
            }}
          >
            <ScrollMorphText>Take a piece home</ScrollMorphText>
          </div>
        </div>
        <span
          style={{
            position: "relative",
            zIndex: 2,
            fontFamily: "'Courier New', monospace",
            fontSize: 11,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: hover ? P.abyss : P.gold,
            background: hover ? P.gold : "transparent",
            border: `1px solid ${P.gold}`,
            borderRadius: 2,
            padding: "14px 26px",
            transition: "all 0.3s ease",
            whiteSpace: "nowrap",
          }}
        >
          Visit the Shop →
        </span>
      </Link>
    </section>
  );
}

// ─── PAGE ────────────────────────────────────────────────
export default function HomePage() {
  const isMobile = useIsMobile();
  return (
    <main
      style={{
        background: `radial-gradient(ellipse at 50% 0%, ${P.deep} 0%, ${P.abyss} 60%)`,
      }}
    >
      <SEO />
      <HeroSection isMobile={isMobile} />
      <FeaturedWorks isMobile={isMobile} />
      <Destinations isMobile={isMobile} />
      <Manifesto isMobile={isMobile} />
      <ShopCta isMobile={isMobile} />
    </main>
  );
}
