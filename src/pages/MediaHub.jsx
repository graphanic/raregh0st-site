import { useState, useEffect, useRef } from "react";
import { P } from "../data/palette";
import { VIDEO_GENRES, VIDEOS } from "../data/videos";
import { SOCIALS } from "../data/socials";
import { ScrollMorphText, HoverMorphText } from "../components/MorphText";
import { HScrollRow } from "../components/HScrollRow";
import { Collapsible } from "../components/Collapsible";
import { SEO } from "../components/SEO";
import { EmbedFrame } from "../components/EmbedFrame";

/* ── Video card (existing content system, kept as-is) ── */
const VideoCard = ({ video, featured = false }) => {
  const [h, setH] = useState(false);
  const w = featured ? 390 : 280;
  const ht = featured ? 219 : 158;
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ minWidth: w, maxWidth: w, cursor: "pointer", transform: h ? "translateY(-3px)" : "none", transition: "transform 0.3s" }}>
      <div style={{ width: w, height: ht, borderRadius: 3, position: "relative", overflow: "hidden", background: `linear-gradient(135deg, ${P.abyss}, ${video.color}10, ${P.abyss})`, border: `1px solid ${h ? video.color + "38" : P.steel + "15"}`, transition: "all 0.4s", boxShadow: h ? `0 6px 24px ${video.color}10` : "none" }}>
        <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.006) 3px, rgba(255,255,255,0.006) 6px)" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: `translate(-50%,-50%) scale(${h ? 1.08 : 1})`, width: 42, height: 42, borderRadius: "50%", background: `${P.abyss}aa`, border: `1px solid ${video.color}44`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s" }}><span style={{ color: video.color, fontSize: 14, marginLeft: 2 }}>{"\u25B6"}</span></div>
        <div style={{ position: "absolute", bottom: 8, right: 10, fontFamily: "'Courier New', monospace", fontSize: 10, color: P.ghost, background: `${P.abyss}cc`, padding: "2px 8px", borderRadius: 2 }}>{video.duration}</div>
        {video.episode && <div style={{ position: "absolute", top: 8, left: 10, fontFamily: "'Courier New', monospace", fontSize: 9, color: video.color, background: `${P.abyss}cc`, padding: "3px 8px", borderRadius: 2, letterSpacing: 2, border: `1px solid ${video.color}25` }}>{video.episode}</div>}
      </div>
      <div style={{ marginTop: 10 }}>
        <div style={{ fontFamily: "'Georgia', serif", fontSize: featured ? 14 : 13, color: h ? video.color : P.ghost, transition: "color 0.3s", lineHeight: 1.4, marginBottom: 4 }}><HoverMorphText>{video.title}</HoverMorphText></div>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: P.bone, opacity: 0.3 }}>{video.series}</div>
        {featured && <div style={{ fontFamily: "'Georgia', serif", fontSize: 12, color: P.bone, opacity: 0.4, marginTop: 6, lineHeight: 1.6 }}>{video.description}</div>}
      </div>
    </div>
  );
};

/* ── Profile link button (reused across sections) ── */
const ProfileLink = ({ url, color, label }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      background: `${color}10`,
      border: `1px solid ${color}25`,
      color,
      fontFamily: "'Courier New', monospace",
      fontSize: 9,
      letterSpacing: 2,
      padding: "5px 14px",
      cursor: "pointer",
      borderRadius: 2,
      textTransform: "uppercase",
      textDecoration: "none",
      display: "inline-block",
      transition: "all 0.3s",
    }}
  >
    {label || "View Profile"}
  </a>
);

/* ── Section header (handle + follow CTA) ── */
const SectionHeader = ({ social }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
    <span style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: social.color, opacity: 0.5 }}>{social.handle}</span>
    <ProfileLink url={social.profileUrl} color={social.color} label="Follow" />
    <ProfileLink url={social.profileUrl} color={social.color} label="View Profile" />
  </div>
);

/* ── Placeholder notice for demo embeds ── */
const PlaceholderNotice = ({ color }) => (
  <div style={{
    fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 2,
    color: P.bone, opacity: 0.25, textTransform: "uppercase",
    marginBottom: 14, padding: "4px 0",
  }}>
    {"// placeholder embeds -- swap in real IDs when ready"}
  </div>
);

/* ═══════════════════════════════════════════════════════
   YOUTUBE SECTION
   ═══════════════════════════════════════════════════════ */
const YouTubeSection = ({ social }) => {
  const { embed } = social;
  if (!embed || embed.type !== "youtube") return null;
  return (
    <div>
      <SectionHeader social={social} />
      <PlaceholderNotice color={social.color} />
      {/* Featured video -- large */}
      <div style={{ marginBottom: 20 }}>
        <EmbedFrame
          src={`https://www.youtube.com/embed/${embed.featured}?rel=0&modestbranding=1`}
          title="Featured YouTube video"
          width="100%"
          height={360}
          color={social.color}
          fallbackUrl={social.profileUrl}
          fallbackLabel="Watch on YouTube"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          style={{ maxWidth: 640, width: "100%", minWidth: "auto" }}
        />
      </div>
      {/* Row of additional videos */}
      <HScrollRow arrowColor={social.color}>
        {embed.videos.map((vid, i) => (
          <EmbedFrame
            key={vid + i}
            src={`https://www.youtube.com/embed/${vid}?rel=0&modestbranding=1`}
            title={`YouTube video ${i + 1}`}
            width={320}
            height={180}
            color={social.color}
            fallbackUrl={`https://www.youtube.com/watch?v=${vid}`}
            fallbackLabel="Watch on YouTube"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        ))}
      </HScrollRow>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   TWITCH SECTION
   ═══════════════════════════════════════════════════════ */
const TwitchSection = ({ social }) => {
  const { embed } = social;
  if (!embed || embed.type !== "twitch") return null;
  const [parentDomain, setParentDomain] = useState("localhost");

  useEffect(() => {
    setParentDomain(window.location.hostname);
  }, []);

  return (
    <div>
      <SectionHeader social={social} />
      <EmbedFrame
        src={`https://player.twitch.tv/?channel=${embed.channel}&parent=${parentDomain}&muted=true`}
        title="Twitch stream"
        width="100%"
        height={400}
        color={social.color}
        fallbackUrl={social.profileUrl}
        fallbackLabel="Watch on Twitch"
        style={{ maxWidth: 800, width: "100%", minWidth: "auto" }}
      />
      <div style={{
        marginTop: 12, fontFamily: "'Georgia', serif", fontSize: 12,
        color: P.bone, opacity: 0.4, lineHeight: 1.6,
      }}>
        Follow to get notified when the stream goes live.
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   TIKTOK SECTION
   ═══════════════════════════════════════════════════════ */
const TikTokSection = ({ social }) => {
  const { embed } = social;
  if (!embed || embed.type !== "tiktok") return null;
  return (
    <div>
      <SectionHeader social={social} />
      <PlaceholderNotice color={social.color} />
      <HScrollRow arrowColor={social.color}>
        {embed.videos.map((vid, i) => (
          <EmbedFrame
            key={vid + i}
            src={`https://www.tiktok.com/embed/v2/${vid}`}
            title={`TikTok video ${i + 1}`}
            width={325}
            height={578}
            color={social.color}
            fallbackUrl={social.profileUrl}
            fallbackLabel="Watch on TikTok"
          />
        ))}
      </HScrollRow>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   INSTAGRAM SECTION
   ═══════════════════════════════════════════════════════ */
const InstagramSection = ({ social }) => {
  const { embed } = social;
  if (!embed || embed.type !== "instagram") return null;
  return (
    <div>
      <SectionHeader social={social} />
      <PlaceholderNotice color={social.color} />
      <HScrollRow arrowColor={social.color}>
        {embed.posts.map((code, i) => (
          <EmbedFrame
            key={code + i}
            src={`https://www.instagram.com/p/${code}/embed`}
            title={`Instagram post ${i + 1}`}
            width={400}
            height={500}
            color={social.color}
            fallbackUrl={social.profileUrl}
            fallbackLabel="View on Instagram"
          />
        ))}
      </HScrollRow>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   X (TWITTER) TIMELINE SECTION
   ═══════════════════════════════════════════════════════ */
const XTimelineSection = ({ social }) => {
  const { embed } = social;
  if (!embed || embed.type !== "x-timeline") return null;
  const ref = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Load Twitter widget script dynamically
    if (typeof window !== "undefined" && !window.twttr) {
      const s = document.createElement("script");
      s.src = "https://platform.twitter.com/widgets.js";
      s.async = true;
      s.onload = () => {
        if (window.twttr && ref.current) {
          window.twttr.widgets.createTimeline(
            { sourceType: "profile", screenName: social.handle.replace("@", "") },
            ref.current,
            { theme: "dark", chrome: "noheader nofooter noborders transparent", width: 400, height: 600, tweetLimit: 5 }
          ).then(() => setLoaded(true));
        }
      };
      document.head.appendChild(s);
    } else if (window.twttr && ref.current) {
      window.twttr.widgets.createTimeline(
        { sourceType: "profile", screenName: social.handle.replace("@", "") },
        ref.current,
        { theme: "dark", chrome: "noheader nofooter noborders transparent", width: 400, height: 600, tweetLimit: 5 }
      ).then(() => setLoaded(true));
    }
  }, [social.handle]);

  return (
    <div>
      <SectionHeader social={social} />
      <div
        ref={ref}
        style={{
          maxWidth: 400,
          minHeight: 200,
          borderRadius: 3,
          overflow: "hidden",
          background: `linear-gradient(135deg, ${P.abyss}, ${social.color}06, ${P.abyss})`,
          border: `1px solid ${P.steel}15`,
          position: "relative",
        }}
      >
        {!loaded && (
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", height: 200, gap: 12,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              border: `2px solid ${social.color}30`, borderTopColor: social.color,
              animation: "spin 1s linear infinite",
            }} />
            <span style={{
              fontFamily: "'Courier New', monospace", fontSize: 9,
              letterSpacing: 3, color: P.bone, opacity: 0.3, textTransform: "uppercase",
            }}>Loading timeline</span>
          </div>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   FACEBOOK SECTION
   ═══════════════════════════════════════════════════════ */
const FacebookSection = ({ social }) => {
  const { embed } = social;
  if (!embed || embed.type !== "facebook") return null;

  const encodedUrl = encodeURIComponent(embed.pageUrl);
  const src = `https://www.facebook.com/plugins/page.php?href=${encodedUrl}&tabs=timeline&width=400&height=500&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false&appId`;

  return (
    <div>
      <SectionHeader social={social} />
      <EmbedFrame
        src={src}
        title="Facebook page"
        width={400}
        height={500}
        color={social.color}
        fallbackUrl={social.profileUrl}
        fallbackLabel="Visit on Facebook"
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
      />
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   LINK-ONLY SECTION (for platforms without free embeds)
   ═══════════════════════════════════════════════════════ */
const LinkOnlySection = ({ social }) => (
  <div>
    <SectionHeader social={social} />
    <a
      href={social.profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "22px 24px",
        background: `linear-gradient(135deg, ${P.deep}, ${social.color}06, ${P.deep})`,
        border: `1px solid ${P.steel}15`,
        borderRadius: 3,
        textDecoration: "none",
        transition: "all 0.3s",
        maxWidth: 400,
      }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: "50%",
        background: `${social.color}10`, border: `1px solid ${social.color}20`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 18, color: social.color,
      }}>
        {social.icon}
      </div>
      <div>
        <div style={{
          fontFamily: "'Georgia', serif", fontSize: 14, color: P.ghost,
          marginBottom: 4,
        }}>
          {social.handle}
        </div>
        <div style={{
          fontFamily: "'Courier New', monospace", fontSize: 9,
          letterSpacing: 2, color: social.color, textTransform: "uppercase",
        }}>
          {"View on " + social.label + " \u2192"}
        </div>
      </div>
    </a>
  </div>
);

/* ═══════════════════════════════════════════════════════
   EMBED ROUTER -- picks the right section per platform
   ═══════════════════════════════════════════════════════ */
const SocialEmbedSection = ({ social }) => {
  const type = social.embed?.type;
  switch (type) {
    case "youtube": return <YouTubeSection social={social} />;
    case "twitch": return <TwitchSection social={social} />;
    case "tiktok": return <TikTokSection social={social} />;
    case "instagram": return <InstagramSection social={social} />;
    case "x-timeline": return <XTimelineSection social={social} />;
    case "facebook": return <FacebookSection social={social} />;
    case "link-only":
    default: return <LinkOnlySection social={social} />;
  }
};

/* ═══════════════════════════════════════════════════════
   MEDIA HUB PAGE
   ═══════════════════════════════════════════════════════ */
export const MediaHub = () => {
  const [genre, setGenre] = useState("all");
  const filtered = genre === "all" ? VIDEOS : VIDEOS.filter(v => v.genre === genre);
  const ac = VIDEO_GENRES.find(g => g.id === genre);

  return (
    <div style={{ minHeight: "100vh", paddingTop: 120, paddingBottom: 80 }}>
      <SEO
        title="Media"
        description="Watch, listen, and follow RareGh0st -- video content, music, and social feeds."
        path="/media"
      />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>
        {/* Page header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{
            fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 6,
            color: P.cyan, textTransform: "uppercase", marginBottom: 12,
          }}>
            <ScrollMorphText speed={75}>Media</ScrollMorphText>
          </div>
          <h2 style={{
            fontFamily: "'Georgia', serif", fontSize: "clamp(28px, 4vw, 42px)",
            fontWeight: 400, color: P.ghost, margin: 0,
          }}>
            <ScrollMorphText speed={70}>{'Watch \u00B7 Listen \u00B7 Follow'}</ScrollMorphText>
          </h2>
          <div style={{
            width: 40, height: 1, marginTop: 20,
            background: `linear-gradient(to right, ${P.cyan}, transparent)`,
          }} />
        </div>

        {/* ── Video content (existing card system) ── */}
        <Collapsible
          title="Video"
          icon={"\u25B6"}
          color={ac?.color || P.cyan}
          defaultOpen={true}
          count={VIDEOS.length}
        >
          <div style={{ display: "flex", gap: 4, marginBottom: 18, flexWrap: "wrap" }}>
            {VIDEO_GENRES.map(g => (
              <button
                key={g.id}
                onClick={() => setGenre(g.id)}
                style={{
                  background: genre === g.id ? `${g.color}12` : "transparent",
                  border: `1px solid ${genre === g.id ? g.color + "35" : P.steel + "18"}`,
                  color: genre === g.id ? g.color : P.bone,
                  fontFamily: "'Courier New', monospace", fontSize: 10,
                  letterSpacing: 3, padding: "7px 15px", cursor: "pointer",
                  textTransform: "uppercase", borderRadius: 2, transition: "all 0.3s",
                }}
              >
                {g.label}
              </button>
            ))}
          </div>
          <HScrollRow arrowColor={ac?.color || P.cyan}>
            {filtered.map(v => (
              <VideoCard key={v.id} video={v} featured={genre === "codename-angel"} />
            ))}
          </HScrollRow>
        </Collapsible>

        {/* ── Social platform embeds ── */}
        <div style={{ marginTop: 6 }}>
          <div style={{
            fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 4,
            color: P.bone, opacity: 0.2, textTransform: "uppercase",
            margin: "18px 0 8px 4px",
          }}>
            <ScrollMorphText speed={70}>Social Feeds</ScrollMorphText>
          </div>
          {SOCIALS.map(s => (
            <Collapsible key={s.id} title={s.label} icon={s.icon} color={s.color} defaultOpen={false}>
              <SocialEmbedSection social={s} />
            </Collapsible>
          ))}
        </div>
      </div>
    </div>
  );
};
