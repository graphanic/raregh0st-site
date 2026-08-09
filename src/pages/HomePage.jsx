import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { P, ART_IMGS, HERO_LOGO_STATIONARY_IMG, HERO_LOGO_TURN_IMG } from "../data/palette";
import { FEATURED_WORKS, getCategory, getWorkHref } from "../data/catalog";
import { SEO } from "../components/SEO";
import { MorphText, HoverMorphText, ScrollMorphText } from "../components/MorphText";
import { useIsMobile } from "../hooks/useIsMobile";
import { GalleryFocus } from "../components/home/GalleryFocus";
import { NewsletterSignup } from "../components/NewsletterSignup";
import {
  ACTION_COPY,
  ARTIST_PORTRAIT_URL,
  BRAND_COPY,
  COLLECTOR_COPY,
  COMMISSION_COPY,
  NEWSLETTER_COPY,
  SHOP_COPY,
} from "../data/siteCopy";

const HERO_LOGO_TURN_MS = 1533;
const HERO_LOGO_SETTLE_BUFFER_MS = 34;

// ─── HERO ────────────────────────────────────────────────
function HeroSection({ isMobile }) {
  const [heroLogoSrc, setHeroLogoSrc] = useState(HERO_LOGO_STATIONARY_IMG);
  const turnStartedAt = useRef(0);
  const settleTimer = useRef(null);
  const isTurning = useRef(false);
  const turnReady = useRef(false);

  useEffect(() => {
    fetch(HERO_LOGO_TURN_IMG, { cache: "force-cache" }).catch(() => {});
    return () => {
      if (settleTimer.current) window.clearTimeout(settleTimer.current);
    };
  }, []);

  const returnLogoToRest = () => {
    isTurning.current = false;
    turnReady.current = false;
    settleTimer.current = null;
    setHeroLogoSrc(HERO_LOGO_STATIONARY_IMG);
  };

  const scheduleLogoSettle = () => {
    if (!turnReady.current) return;
    if (settleTimer.current) window.clearTimeout(settleTimer.current);

    const elapsed = performance.now() - turnStartedAt.current;
    const cycleProgress = elapsed % HERO_LOGO_TURN_MS;
    const remaining = elapsed >= HERO_LOGO_TURN_MS && cycleProgress < 20
      ? 0
      : HERO_LOGO_TURN_MS - cycleProgress;

    settleTimer.current = window.setTimeout(
      returnLogoToRest,
      remaining + HERO_LOGO_SETTLE_BUFFER_MS,
    );
  };

  const playLogoTurnOnce = () => {
    if (isTurning.current) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.body.hasAttribute("data-calm")
    ) return;

    if (settleTimer.current) {
      window.clearTimeout(settleTimer.current);
      settleTimer.current = null;
    }
    isTurning.current = true;
    turnReady.current = false;
    setHeroLogoSrc(HERO_LOGO_TURN_IMG);
  };

  const handleLogoKeyDown = (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    playLogoTurnOnce();
  };

  const handleLogoLoad = () => {
    if (!isTurning.current) return;
    turnStartedAt.current = performance.now();
    turnReady.current = true;
    scheduleLogoSettle();
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

      <div style={{ position: "relative", zIndex: 2, width: "100%", animation: "fadeSlideIn 1s ease both" }}>
        <img
          src={heroLogoSrc}
          alt="1RareGh0st"
          className="hero-logo"
          draggable="false"
          role="button"
          tabIndex={0}
          aria-label="Spin the 1RareGh0st logo"
          onClick={playLogoTurnOnce}
          onKeyDown={handleLogoKeyDown}
          onLoad={handleLogoLoad}
          onError={returnLogoToRest}
          style={{
            width: isMobile ? 132 : 188,
            height: "auto",
            marginBottom: isMobile ? 22 : 30,
            cursor: "pointer",
            touchAction: "manipulation",
          }}
        />
        <div
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: isMobile ? 9 : 11,
            letterSpacing: isMobile ? 1.8 : 5,
            color: P.magenta,
            textTransform: "uppercase",
            margin: "0 auto 20px",
            width: "100%",
            maxWidth: 720,
            lineHeight: 1.6,
          }}
        >
          <MorphText speed={90} allowWrap>{BRAND_COPY.kicker}</MorphText>
        </div>
        <h1
          aria-label="1RareGh0st"
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: isMobile ? "clamp(38px, 11.6vw, 48px)" : "clamp(88px, 8vw, 124px)",
            fontWeight: 400,
            letterSpacing: isMobile ? 2 : 10,
            lineHeight: 0.92,
            margin: 0,
          }}
        >
          <span aria-hidden="true" style={{ color: P.ghost }}>1</span><span aria-hidden="true" style={{ color: P.cyan }}>RARE</span>
          <span aria-hidden="true" style={{ color: P.magenta }}>GH</span>
          <span aria-hidden="true" style={{ color: P.ghost }}>0</span>
          <span aria-hidden="true" style={{ color: P.magenta }}>ST</span>
        </h1>
        <div
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: isMobile ? 8 : 9,
            letterSpacing: isMobile ? 3.2 : 6,
            color: P.cyan,
            textTransform: "uppercase",
            marginTop: isMobile ? 24 : 30,
            opacity: 0.75,
          }}
        >
          <MorphText speed={70} allowWrap>{BRAND_COPY.craftLine}</MorphText>
        </div>
        <p style={{ fontFamily: "'Georgia', serif", fontStyle: "italic", fontSize: isMobile ? 13 : 16, color: P.bone, opacity: 0.62, maxWidth: 620, lineHeight: 1.65, margin: "18px auto 0" }}>
          {BRAND_COPY.supporting}
        </p>

        <div
          style={{
            display: "flex",
            gap: 14,
            justifyContent: "center",
            marginTop: 40,
            flexWrap: "wrap",
          }}
        >
          <CtaButton to="/shop" color={P.gold}>{ACTION_COPY.collect}</CtaButton>
          <CtaButton to="/contact?type=commission" color={P.gold}>{ACTION_COPY.commission}</CtaButton>
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
      className="hero-cta"
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
function SectionHead({ number, kicker, title, color = P.cyan, link, linkLabel }) {
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
            fontSize: 11,
            letterSpacing: 6,
            color,
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          {number && <span style={{ color: P.ghost, marginRight: 12 }}>{number}</span>}{kicker}
        </div>
        <h2
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: "clamp(27px, 4vw, 42px)",
            fontWeight: 400,
            letterSpacing: 0,
            color: P.ghost,
            margin: 0,
            lineHeight: 1.12,
          }}
        >
          <ScrollMorphText>{title}</ScrollMorphText>
        </h2>
        <div aria-hidden style={{ width: 72, height: 1, marginTop: 13, background: `linear-gradient(to right, ${color}, transparent)` }} />
      </div>
      {link && (
        <Link
          to={link}
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: 11,
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
function GalleryCard({ piece, onOpen, isMobile }) {
  const [hover, setHover] = useState(false);
  const accent = piece.colors?.[0] || P.cyan;
  const isVideo = piece.mediaType === "video";
  const category = getCategory(piece.primaryCategory);
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
          aria-hidden="true"
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
          Film
        </span>
      )}
      {piece.printEdition && (
        <span style={{ position: "absolute", top: 12, right: 12, zIndex: 3, background: `${P.abyss}dd`, border: `1px solid ${accent}44`, borderRadius: 2, padding: "4px 8px", backdropFilter: "blur(4px)", fontFamily: "'Courier New', monospace", fontSize: 7, letterSpacing: 2, color: accent, textTransform: "uppercase" }}>
          Edition of {piece.printEdition.size}
        </span>
      )}

      {/* Gradient + copy */}
      <div style={{ position: "absolute", inset: 0, zIndex: 2, background: `linear-gradient(to top, ${P.abyss}f5 0%, ${P.abyss}55 50%, transparent 100%)` }} />
      <div style={{ position: "absolute", left: 16, right: 16, bottom: 14, zIndex: 3 }}>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 8, letterSpacing: 3, color: accent, textTransform: "uppercase", marginBottom: 6 }}>
          {category?.label}{piece.year ? ` · ${piece.year}` : ""}
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
            {piece.medium || piece.series || category?.description}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
            <span style={{ fontFamily: "'Courier New', monospace", fontSize: 8, letterSpacing: 3, color: accent, textTransform: "uppercase" }}>Explore work ↗</span>
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

function Gallery({ isMobile }) {
  const navigate = useNavigate();
  const [focus, setFocus] = useState(null);
  const featured = FEATURED_WORKS;

  const onView = (piece) => {
    setFocus(null);
    navigate(getWorkHref(piece));
  };

  return (
    <section style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "60px 24px 30px" : "90px 32px 38px" }}>
      <SectionHead number="01" kicker="Selected Works" title="Explore the Worlds" color={P.cyan} link="/portfolio" linkLabel="Explore All →" />
      <p style={{ fontFamily: "'Georgia', serif", fontSize: 15, color: P.bone, opacity: 0.72, lineHeight: 1.75, maxWidth: 680, margin: "-18px 0 28px" }}>
        A collector-first passage through original compositions, film, adaptation, photography, and commissioned design.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 14 }}>
        {featured.map((piece, index) => (
          <GalleryCard key={piece.id} piece={piece} isMobile={isMobile} onOpen={() => setFocus(index)} />
        ))}
      </div>

      {focus !== null && featured[focus] && (
        <GalleryFocus
          pieces={featured}
          index={focus}
          isMobile={isMobile}
          onClose={() => setFocus(null)}
          onNav={(dir) => setFocus((cur) => (cur + dir + featured.length) % featured.length)}
          onView={onView}
        />
      )}
    </section>
  );
}

// ─── COLLECTOR STATEMENT ─────────────────────────────────
function CollectorStatement({ isMobile }) {
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
          <span style={{ color: P.ghost, marginRight: 12 }}>02</span>{COLLECTOR_COPY.kicker}
        </div>
        <h2 style={{ fontFamily: "'Georgia', serif", fontSize: isMobile ? 30 : 48, fontWeight: 400, color: P.ghost, margin: "0 0 24px" }}>
          <ScrollMorphText speed={75}>{COLLECTOR_COPY.headline}</ScrollMorphText>
        </h2>
        <p
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: isMobile ? 17 : 23,
            lineHeight: 1.65,
            color: P.bone,
            margin: 0,
            fontStyle: "italic",
            opacity: 0.78,
          }}
        >
          {COLLECTOR_COPY.body}
        </p>
        <p style={{ fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 1, color: P.bone, opacity: 0.42, lineHeight: 1.8, maxWidth: 660, margin: "28px auto 34px" }}>
          {COLLECTOR_COPY.note}
        </p>
        <CtaButton to="/portfolio" color={P.cyan}>{ACTION_COPY.explore}</CtaButton>
      </div>
    </section>
  );
}

function PathwayAction({ to, color, children }) {
  return (
    <Link
      to={to}
      className="home-pathway-action"
      style={{
        "--pathway-accent": color,
        color,
        border: `1px solid ${color}66`,
      }}
    >
      <HoverMorphText>{children}</HoverMorphText>
      <span aria-hidden>→</span>
    </Link>
  );
}

function HomeNewsletterCard({ isMobile }) {
  return (
    <div style={{ padding: isMobile ? "28px 24px" : "34px 36px", height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ fontFamily: "'Courier New', monospace", fontSize: 11, letterSpacing: 5, color: P.cyan, textTransform: "uppercase", marginBottom: 12 }}>
        {NEWSLETTER_COPY.kicker}
      </div>
      <h2 style={{ fontFamily: "'Georgia', serif", fontSize: isMobile ? 25 : 30, fontWeight: 400, color: P.ghost, margin: "0 0 12px", lineHeight: 1.15 }}>
        <ScrollMorphText>{NEWSLETTER_COPY.headline}</ScrollMorphText>
      </h2>
      <p style={{ fontFamily: "'Georgia', serif", fontSize: 15, lineHeight: 1.7, color: P.bone, opacity: 0.72, margin: "0 0 24px" }}>
        {NEWSLETTER_COPY.body}
      </p>
      <NewsletterSignup source="home-signal" accent={P.cyan} className="home-signal-signup" />
    </div>
  );
}

function HomePathways({ isMobile }) {
  const cardPadding = isMobile ? "28px 24px" : "34px 36px";
  const headingStyle = {
    fontFamily: "'Georgia', serif",
    fontSize: isMobile ? 25 : 30,
    fontWeight: 400,
    lineHeight: 1.15,
    color: P.ghost,
    margin: "0 0 14px",
  };
  const bodyStyle = {
    fontFamily: "'Georgia', serif",
    fontSize: 13,
    lineHeight: 1.7,
    color: P.bone,
    opacity: 0.58,
    margin: 0,
  };
  const kicker = (color) => ({
    fontFamily: "'Courier New', monospace",
    fontSize: 8,
    letterSpacing: 5,
    color,
    textTransform: "uppercase",
    marginBottom: 12,
  });

  return (
    <section aria-label="Collect, commission, meet the artist, and join the signal" style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "64px 24px 88px" : "86px 32px 112px", borderTop: `1px solid ${P.steel}12` }}>
      <SectionHead number="03" kicker="Paths Forward" title="Continue Through the System" color={P.gold} />
      <div
        className="home-pathways-grid"
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(2, minmax(0, 1fr))",
          gridAutoRows: isMobile ? "auto" : "minmax(320px, 1fr)",
          gap: 1,
          padding: 1,
          background: `${P.steel}20`,
          boxShadow: `0 0 70px ${P.purple}0a`,
        }}
      >
        <article className="home-pathway-card" style={{ position: "relative", overflow: "hidden", padding: cardPadding, borderTop: `2px solid ${P.gold}`, background: `linear-gradient(145deg, ${P.void}, ${P.surface}b8)`, display: "flex", flexDirection: "column" }}>
          <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: `url(${ART_IMGS[3]})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.075 }} />
          <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={kicker(P.gold)}>Commission</div>
            <h2 style={headingStyle}><ScrollMorphText allowWrap>{COMMISSION_COPY.headline}</ScrollMorphText></h2>
            <p style={bodyStyle}>{COMMISSION_COPY.intro}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, margin: "22px 0 24px" }}>
              {COMMISSION_COPY.stages.map((stage) => (
                <span key={stage.number} style={{ fontFamily: "'Courier New', monospace", fontSize: 8, letterSpacing: 1.5, color: P.gold, border: `1px solid ${P.gold}24`, padding: "6px 8px", textTransform: "uppercase" }}>
                  {stage.number} {stage.title}
                </span>
              ))}
            </div>
            <div style={{ marginTop: "auto" }}>
              <PathwayAction to="/contact?type=commission" color={P.gold}>{ACTION_COPY.commission}</PathwayAction>
            </div>
          </div>
        </article>

        <article className="home-pathway-card" style={{ position: "relative", overflow: "hidden", padding: cardPadding, borderTop: `2px solid ${P.gold}`, background: `linear-gradient(145deg, ${P.void}, ${P.surface}b8)`, display: "flex", flexDirection: "column" }}>
          <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: `url(${ART_IMGS[0]})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.075 }} />
          <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={kicker(P.gold)}>Available Releases</div>
            <h2 style={headingStyle}><ScrollMorphText allowWrap>{SHOP_COPY.headline}</ScrollMorphText></h2>
            <p style={bodyStyle}>{SHOP_COPY.intro}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, margin: "22px 0 24px" }}>
              <div style={{ borderTop: `1px solid ${P.magenta}30`, paddingTop: 10 }}>
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: P.magenta, letterSpacing: 2, textTransform: "uppercase", marginBottom: 5 }}>Open Releases</div>
                <div style={{ fontFamily: "'Georgia', serif", fontSize: 11, color: P.bone, opacity: 0.45 }}>Apparel, objects, and art-led goods.</div>
              </div>
              <div style={{ borderTop: `1px solid ${P.gold}30`, paddingTop: 10 }}>
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: P.gold, letterSpacing: 2, textTransform: "uppercase", marginBottom: 5 }}>Selected Editions</div>
                <div style={{ fontFamily: "'Georgia', serif", fontSize: 11, color: P.bone, opacity: 0.45 }}>Always identified individually when released.</div>
              </div>
            </div>
            <div style={{ marginTop: "auto" }}>
              <PathwayAction to="/shop" color={P.gold}>{ACTION_COPY.collect}</PathwayAction>
            </div>
          </div>
        </article>

        <article className="home-pathway-card" style={{ padding: cardPadding, borderTop: `2px solid ${P.cyan}`, background: `linear-gradient(145deg, ${P.void}, ${P.surface}b8)` }}>
          <div className="home-pathway-artist" style={{ display: "grid", gridTemplateColumns: isMobile ? "96px minmax(0, 1fr)" : "132px minmax(0, 1fr)", gap: isMobile ? 18 : 26, alignItems: "start", height: "100%" }}>
            <div style={{ position: "relative" }}>
              <div aria-hidden style={{ position: "absolute", inset: -1, background: `linear-gradient(135deg, ${P.cyan}66, ${P.magenta}44, transparent 72%)` }} />
              <img src={ARTIST_PORTRAIT_URL} alt="Eric Fallis, artist behind 1RareGh0st" style={{ position: "relative", width: "100%", aspectRatio: "4 / 5", objectFit: "cover", objectPosition: "center 20%", display: "block", filter: "saturate(0.82) contrast(1.08)" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", minWidth: 0, height: "100%" }}>
              <div style={kicker(P.cyan)}>The Artist</div>
              <h2 style={{ ...headingStyle, fontSize: isMobile ? 22 : 27 }}><ScrollMorphText allowWrap>Eric Fallis is 1RareGh0st.</ScrollMorphText></h2>
              <p style={bodyStyle}>I build visual worlds from photography, illustration, cultural debris, memory, and emerging tools—then resolve them through sustained composition and human judgment.</p>
              <p style={{ fontFamily: "'Courier New', monospace", fontSize: 9, lineHeight: 1.65, color: P.bone, opacity: 0.36, margin: "14px 0 22px" }}>AI can generate raw possibility. Authorship lives in what is selected, altered, layered, coloured, lit, and kept.</p>
              <div style={{ marginTop: "auto" }}>
                <PathwayAction to="/about" color={P.cyan}>Meet the Artist</PathwayAction>
              </div>
            </div>
          </div>
        </article>

        <article id="signal" className="home-pathway-card" style={{ borderTop: `2px solid ${P.cyan}`, background: `linear-gradient(145deg, ${P.void}, ${P.surface}b8)` }}>
          <HomeNewsletterCard isMobile={isMobile} />
        </article>
      </div>
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
      <Gallery isMobile={isMobile} />
      <CollectorStatement isMobile={isMobile} />
      <HomePathways isMobile={isMobile} />
    </main>
  );
}
