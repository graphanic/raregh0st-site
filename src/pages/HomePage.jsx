import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { P, ART_IMGS, HERO_LOGO_STATIONARY_IMG, HERO_LOGO_TURN_IMG } from "../data/palette";
import { PIECES } from "../data/pieces";
import { SEO } from "../components/SEO";
import { MorphText, HoverMorphText, ScrollMorphText } from "../components/MorphText";
import { useIsMobile } from "../hooks/useIsMobile";
import { GalleryFocus } from "../components/home/GalleryFocus";
import { InquireModal } from "../components/home/InquireModal";
import { AVAILABILITY } from "../components/home/availability";
import { submitForm } from "../lib/api";

// Destination cards — functionally replace the orbiting solar-system nav
const DESTINATIONS = [
  { label: "Portfolio", dest: "/portfolio", color: P.cyan, desc: "Curated Works" },
  { label: "Shop", dest: "/shop", color: P.gold, desc: "Prints & Originals" },
  { label: "Media", dest: "/media", color: P.magenta, desc: "Motion & Sound" },
  { label: "About", dest: "/about", color: P.bone, desc: "The Artist" },
  { label: "Contact", dest: "/contact", color: P.bone, desc: "Get In Touch" },
];

const MANTRAS = ["Coherence over intensity", "Presence over performance", "Join the signal"];
const HERO_LOGO_TURN_MS = 1000;
const HERO_LOGO_SETTLE_BUFFER_MS = 40;

// ─── HERO ────────────────────────────────────────────────
function HeroSection({ isMobile }) {
  const [heroLogoSrc, setHeroLogoSrc] = useState(HERO_LOGO_STATIONARY_IMG);
  const turnStartedAt = useRef(0);
  const settleTimer = useRef(null);
  const pointerOverLogo = useRef(false);
  const isTurning = useRef(false);

  useEffect(() => {
    const turnPreload = new Image();
    turnPreload.src = HERO_LOGO_TURN_IMG;
    return () => {
      if (settleTimer.current) window.clearTimeout(settleTimer.current);
    };
  }, []);

  const startLogoTurn = (event) => {
    if (event.pointerType !== "mouse") return;
    pointerOverLogo.current = true;

    if (settleTimer.current) {
      window.clearTimeout(settleTimer.current);
      settleTimer.current = null;
    }

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.body.hasAttribute("data-calm")
    ) return;

    if (!isTurning.current) {
      isTurning.current = true;
      turnStartedAt.current = performance.now();
      setHeroLogoSrc(HERO_LOGO_TURN_IMG);
    }
  };

  const finishLogoTurn = (event) => {
    if (event.pointerType !== "mouse") return;
    pointerOverLogo.current = false;
    if (!isTurning.current) return;

    const elapsed = performance.now() - turnStartedAt.current;
    const cycleProgress = elapsed % HERO_LOGO_TURN_MS;
    const remaining = elapsed >= HERO_LOGO_TURN_MS && cycleProgress < 20
      ? 0
      : HERO_LOGO_TURN_MS - cycleProgress;

    settleTimer.current = window.setTimeout(() => {
      if (pointerOverLogo.current) return;
      isTurning.current = false;
      settleTimer.current = null;
      setHeroLogoSrc(HERO_LOGO_STATIONARY_IMG);
    }, remaining + HERO_LOGO_SETTLE_BUFFER_MS);
  };

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
          backgroundImage: `url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Art%20Collage-5GLlE6Fy49KuQ8zCwDUIKhNS3BgoCi.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.18,
          filter: "saturate(1.2)",
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
          src={heroLogoSrc}
          alt="1RareGh0st"
          className="hero-logo"
          onPointerEnter={startLogoTurn}
          onPointerLeave={finishLogoTurn}
          style={{
            width: isMobile ? 132 : 188,
            height: "auto",
            marginBottom: isMobile ? 22 : 30,
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
          <span style={{ color: P.ghost }}>1</span><span style={{ color: P.cyan }}>RARE</span>
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
            fontWeight: 400,
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

// ─── GALLERY ─────────────────────────────────────────────
function AvailabilityDot({ availability }) {
  const av = AVAILABILITY[availability] || AVAILABILITY.available;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: av.color, boxShadow: `0 0 6px ${av.color}` }} />
      <span style={{ fontFamily: "'Courier New', monospace", fontSize: 8, letterSpacing: 2, color: av.color, textTransform: "uppercase" }}>{av.label}</span>
    </span>
  );
}

function GalleryCard({ piece, onOpen, isMobile }) {
  const [hover, setHover] = useState(false);
  const accent = piece.colors?.[0] || P.cyan;
  const isVideo = piece.mediaType === "video";
  return (
    <button
      onClick={onOpen}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={`Open ${piece.title} in focus view`}
      style={{
        position: "relative",
        display: "block",
        padding: 0,
        cursor: "pointer",
        textAlign: "left",
        borderRadius: 3,
        overflow: "hidden",
        border: `1px solid ${hover ? accent + "66" : P.steel + "22"}`,
        background: P.void,
        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
        boxShadow: hover ? `0 0 32px ${accent}22` : "none",
        minHeight: isMobile ? 260 : 300,
      }}
    >
      {isVideo ? (
        <video
          src={piece.img}
          muted
          loop
          playsInline
          autoPlay
          style={imgStyle(hover)}
        />
      ) : (
        <img src={piece.img} alt={piece.title} style={imgStyle(hover)} />
      )}

      {/* Media-type chip */}
      {isVideo && (
        <span style={{ position: "absolute", top: 12, left: 12, zIndex: 3, fontFamily: "'Courier New', monospace", fontSize: 7, letterSpacing: 2, color: P.abyss, background: accent, borderRadius: 2, padding: "3px 7px", textTransform: "uppercase" }}>
          Motion
        </span>
      )}
      <span style={{ position: "absolute", top: 12, right: 12, zIndex: 3, background: `${P.abyss}cc`, borderRadius: 2, padding: "4px 8px", backdropFilter: "blur(4px)" }}>
        <AvailabilityDot availability={piece.availability} />
      </span>

      {/* Gradient + copy */}
      <div style={{ position: "absolute", inset: 0, zIndex: 2, background: `linear-gradient(to top, ${P.abyss}f5 0%, ${P.abyss}55 50%, transparent 100%)` }} />
      <div style={{ position: "absolute", left: 16, right: 16, bottom: 14, zIndex: 3 }}>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 8, letterSpacing: 3, color: accent, textTransform: "uppercase", marginBottom: 6 }}>
          {piece.series} · {piece.year}
        </div>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 14, fontWeight: 400, letterSpacing: 1, color: P.ghost, textTransform: "uppercase", lineHeight: 1.2 }}>
          <HoverMorphText>{piece.title}</HoverMorphText>
        </div>
        {/* Hover-reveal metadata */}
        <div
          style={{
            maxHeight: hover ? 80 : 0,
            opacity: hover ? 1 : 0,
            overflow: "hidden",
            transition: "max-height 0.4s ease, opacity 0.3s ease",
            marginTop: hover ? 8 : 0,
          }}
        >
          <div style={{ fontFamily: "'Georgia', serif", fontStyle: "italic", fontSize: 11, color: P.bone, opacity: 0.7, lineHeight: 1.4 }}>
            {piece.medium}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
            {typeof piece.price === "number" && piece.price > 0 && (
              <span style={{ fontFamily: "'Courier New', monospace", fontSize: 11, letterSpacing: 1, color: P.gold }}>${piece.price} CAD</span>
            )}
            <span style={{ fontFamily: "'Courier New', monospace", fontSize: 8, letterSpacing: 3, color: accent, textTransform: "uppercase" }}>Open ↗</span>
          </div>
        </div>
      </div>
    </button>
  );
}

function imgStyle(hover) {
  return {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    opacity: hover ? 1 : 0.8,
    transform: hover ? "scale(1.05)" : "scale(1)",
    transition: "transform 0.6s ease, opacity 0.4s ease",
  };
}

function FilterPill({ active, color, onClick, children }) {
  const [hover, setHover] = useState(false);
  const on = active || hover;
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        fontFamily: "'Courier New', monospace",
        fontSize: 9,
        letterSpacing: 3,
        textTransform: "uppercase",
        cursor: "pointer",
        color: active ? P.abyss : on ? color : P.bone,
        background: active ? color : "transparent",
        border: `1px solid ${on ? color : P.steel + "44"}`,
        borderRadius: 2,
        padding: "8px 14px",
        transition: "all 0.25s ease",
      }}
    >
      {children}
    </button>
  );
}

function Gallery({ isMobile, onInquire }) {
  const navigate = useNavigate();
  const [series, setSeries] = useState("All");
  const [avail, setAvail] = useState("All");
  const [focus, setFocus] = useState(null); // index into filtered list

  const seriesOptions = useMemo(() => ["All", ...Array.from(new Set(PIECES.map((p) => p.series)))], []);
  const availOptions = ["All", "available", "sold", "commission"];

  const filtered = useMemo(
    () =>
      PIECES.filter(
        (p) => (series === "All" || p.series === series) && (avail === "All" || p.availability === avail)
      ),
    [series, avail]
  );

  const onAcquire = (piece) => {
    setFocus(null);
    navigate(`/portfolio/${piece.id}`);
  };
  const handleInquire = (piece, mode) => {
    setFocus(null);
    onInquire(piece, mode);
  };

  return (
    <section style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "60px 24px" : "90px 32px" }}>
      <SectionHead kicker="Selected Works" title="The Gallery" color={P.cyan} link="/portfolio" linkLabel="View All →" />

      {/* Filter rail */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginBottom: 28 }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: "'Courier New', monospace", fontSize: 8, letterSpacing: 3, color: P.bone, opacity: 0.4, textTransform: "uppercase", marginRight: 2 }}>Series</span>
          {seriesOptions.map((s) => (
            <FilterPill key={s} active={series === s} color={P.cyan} onClick={() => setSeries(s)}>{s}</FilterPill>
          ))}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: "'Courier New', monospace", fontSize: 8, letterSpacing: 3, color: P.bone, opacity: 0.4, textTransform: "uppercase", marginRight: 2 }}>Status</span>
          {availOptions.map((a) => (
            <FilterPill key={a} active={avail === a} color={a === "All" ? P.magenta : (AVAILABILITY[a]?.color || P.magenta)} onClick={() => setAvail(a)}>
              {a === "All" ? "All" : AVAILABILITY[a].label}
            </FilterPill>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 12, letterSpacing: 2, color: P.bone, opacity: 0.5, padding: "40px 0", textAlign: "center" }}>
          No works match this filter.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: 14,
          }}
        >
          {filtered.map((piece, i) => (
            <GalleryCard key={piece.id} piece={piece} isMobile={isMobile} onOpen={() => setFocus(i)} />
          ))}
        </div>
      )}

      {focus !== null && filtered[focus] && (
        <GalleryFocus
          pieces={filtered}
          index={focus}
          isMobile={isMobile}
          onClose={() => setFocus(null)}
          onNav={(dir) => setFocus((cur) => (cur + dir + filtered.length) % filtered.length)}
          onAcquire={onAcquire}
          onInquire={handleInquire}
        />
      )}
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
            fontWeight: 400,
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

// ─── CONNECT: COMMISSION + NOTIFY ────────────────────────
  function NotifyForm({ isMobile }) {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    const [focus, setFocus] = useState(false);
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState("");
    const submit = async (e) => {
      e.preventDefault();
      if (!email.trim() || busy) return;
      setBusy(true);
      setErr("");
      try {
        await submitForm({ kind: "newsletter", email: email.trim(), source: "home-signal" });
        setSent(true);
      } catch (e2) {
        setErr(e2.message || "Could not subscribe. Try again.");
      } finally {
        setBusy(false);
      }
    };
  return (
    <div
      style={{
        border: `1px solid ${P.cyan}22`,
        borderRadius: 4,
        padding: isMobile ? "28px 24px" : "36px 36px",
        background: `linear-gradient(150deg, ${P.void} 0%, ${P.surface} 100%)`,
      }}
    >
      <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 5, color: P.cyan, textTransform: "uppercase", marginBottom: 12 }}>
        The Signal
      </div>
      <div style={{ fontFamily: "'Courier New', monospace", fontSize: isMobile ? 18 : 22, fontWeight: 400, letterSpacing: 2, color: P.ghost, textTransform: "uppercase", marginBottom: 10 }}>
        <ScrollMorphText>Get New Drops First</ScrollMorphText>
      </div>
      <p style={{ fontFamily: "'Georgia', serif", fontStyle: "italic", fontSize: 13, lineHeight: 1.6, color: P.bone, opacity: 0.6, margin: "0 0 22px" }}>
        No noise. Just new work, print releases, and rare originals as they surface.
      </p>
      {sent ? (
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 12, letterSpacing: 2, color: P.green, textTransform: "uppercase" }}>
          <MorphText speed={60}>✓ You're on the signal</MorphText>
        </div>
      ) : (
        <form onSubmit={submit} style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 10 }}>
          <input
            type="email"
            required
            value={email}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@signal.void"
            style={{
              flex: 1,
              fontFamily: "'Courier New', monospace",
              fontSize: 13,
              color: P.ghost,
              background: P.abyss,
              border: `1px solid ${focus ? P.cyan + "88" : P.steel + "55"}`,
              borderRadius: 2,
              padding: "13px 14px",
              outline: "none",
              transition: "border-color 0.2s ease",
              boxSizing: "border-box",
            }}
          />
          <button
            type="submit"
            disabled={busy}
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 10,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: P.abyss,
              background: P.cyan,
              border: `1px solid ${P.cyan}`,
              borderRadius: 2,
              padding: "13px 22px",
              cursor: busy ? "wait" : "pointer",
              whiteSpace: "nowrap",
              opacity: busy ? 0.6 : 1,
            }}
          >
            {busy ? "Sending\u2026" : <HoverMorphText>Notify Me</HoverMorphText>}
          </button>
        </form>
      )}
      {err && !sent && (
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: P.red, letterSpacing: 1, marginTop: 10 }}>{err}</div>
      )}
    </div>
  );
}

function CommissionCard({ isMobile, onCommission }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      style={{
        position: "relative",
        borderRadius: 4,
        overflow: "hidden",
        border: `1px solid ${P.gold}22`,
        padding: isMobile ? "28px 24px" : "36px 36px",
        background: `linear-gradient(150deg, ${P.void} 0%, ${P.surface} 100%)`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 22,
      }}
    >
      <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: `url(${ART_IMGS[3]})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.08 }} />
      <div style={{ position: "relative", zIndex: 2 }}>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 5, color: P.gold, textTransform: "uppercase", marginBottom: 12 }}>
          Commissions Open
        </div>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: isMobile ? 18 : 22, fontWeight: 400, letterSpacing: 2, color: P.ghost, textTransform: "uppercase", marginBottom: 10 }}>
          <ScrollMorphText>Make Your Story Visible</ScrollMorphText>
        </div>
        <p style={{ fontFamily: "'Georgia', serif", fontStyle: "italic", fontSize: 13, lineHeight: 1.6, color: P.bone, opacity: 0.6, margin: 0 }}>
          Custom digital collage built around your own survival — a one-of-one piece made with you.
        </p>
      </div>
      <button
        onClick={onCommission}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          position: "relative",
          zIndex: 2,
          alignSelf: "flex-start",
          fontFamily: "'Courier New', monospace",
          fontSize: 10,
          letterSpacing: 3,
          textTransform: "uppercase",
          cursor: "pointer",
          color: hover ? P.abyss : P.gold,
          background: hover ? P.gold : "transparent",
          border: `1px solid ${P.gold}`,
          borderRadius: 2,
          padding: "13px 22px",
          transition: "all 0.25s ease",
        }}
      >
        <HoverMorphText>Start a Commission</HoverMorphText>
      </button>
    </div>
  );
}

function ConnectSection({ isMobile, onCommission }) {
  return (
    <section style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "60px 24px" : "90px 32px", borderTop: `1px solid ${P.steel}12` }}>
      <SectionHead kicker="Connect" title="Own It · Make It · Follow It" color={P.gold} />
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
        <CommissionCard isMobile={isMobile} onCommission={onCommission} />
        <NotifyForm isMobile={isMobile} />
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
              fontWeight: 400,
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
  const [inquire, setInquire] = useState({ open: false, mode: "inquire", piece: null });

  const openInquire = (piece, mode = "inquire") => setInquire({ open: true, mode, piece });
  const closeInquire = () => setInquire((s) => ({ ...s, open: false }));

  return (
    <main
      style={{
        background: `radial-gradient(ellipse at 50% 0%, ${P.deep} 0%, ${P.abyss} 60%)`,
      }}
    >
      <SEO />
      <HeroSection isMobile={isMobile} />
      <Gallery isMobile={isMobile} onInquire={openInquire} />
      <Destinations isMobile={isMobile} />
      <Manifesto isMobile={isMobile} />
      <ConnectSection isMobile={isMobile} onCommission={() => openInquire(null, "commission")} />
      <ShopCta isMobile={isMobile} />

      <InquireModal
        open={inquire.open}
        mode={inquire.mode}
        piece={inquire.piece}
        isMobile={isMobile}
        onClose={closeInquire}
      />
    </main>
  );
}
