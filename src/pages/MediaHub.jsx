import { useState, useRef, useEffect, useCallback } from "react";
import { P } from "../data/palette";
import { VIDEO_GENRES, VIDEOS } from "../data/videos";
import { SOCIALS } from "../data/socials";
import { ScrollMorphText, HoverMorphText } from "../components/MorphText";
import { HScrollRow } from "../components/HScrollRow";
import { Collapsible } from "../components/Collapsible";
import { SEO } from "../components/SEO";

/* ── Lazy iframe loader (IntersectionObserver) ── */
const LazyEmbed = ({ src, title, width = "100%", height = 320, style = {} }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { rootMargin: "200px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", width, height, borderRadius: 3, overflow: "hidden", background: `${P.deep}88`, border: `1px solid ${P.steel}10`, ...style }}>
      {!loaded && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 28, height: 28, border: `2px solid ${P.steel}30`, borderTop: `2px solid ${P.cyan}`, borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        </div>
      )}
      {visible && (
        <iframe
          src={src}
          title={title}
          width="100%"
          height="100%"
          style={{ border: 0, opacity: loaded ? 1 : 0, transition: "opacity 0.4s" }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          onLoad={() => setLoaded(true)}
        />
      )}
    </div>
  );
};

/* ── Link-out card (for platforms without free embeds) ── */
const LinkOutCard = ({ social }) => {
  const [h, setH] = useState(false);
  return (
    <a
      href={social.profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: "flex", alignItems: "center", gap: 16,
        padding: "18px 24px", borderRadius: 3, textDecoration: "none",
        background: h ? `${social.color}08` : `${P.deep}88`,
        border: `1px solid ${h ? social.color + "30" : P.steel + "10"}`,
        transition: "all 0.3s", cursor: "pointer",
      }}
    >
      <span style={{ fontSize: 22, color: social.color, opacity: 0.7 }}>{social.icon}</span>
      <div>
        <div style={{ fontFamily: "'Georgia', serif", fontSize: 14, color: h ? social.color : P.ghost, transition: "color 0.3s" }}>
          {social.handle}
        </div>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 2, color: P.bone, opacity: 0.3, marginTop: 4, textTransform: "uppercase" }}>
          {"Visit on " + social.label + " \u2192"}
        </div>
      </div>
    </a>
  );
};

/* ── YouTube section ── */
const YouTubeSection = ({ social }) => {
  const { embed } = social;
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <span style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: social.color, opacity: 0.5 }}>{social.handle}</span>
        <a href={social.profileUrl} target="_blank" rel="noopener noreferrer" style={{ background: `${social.color}10`, border: `1px solid ${social.color}25`, color: social.color, fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 2, padding: "4px 12px", cursor: "pointer", borderRadius: 2, textTransform: "uppercase", textDecoration: "none" }}>Subscribe</a>
      </div>
      {/* Featured video */}
      <LazyEmbed
        src={`https://www.youtube.com/embed/${embed.featured}?rel=0&modestbranding=1`}
        title="Featured YouTube video"
        height={380}
        style={{ marginBottom: 16 }}
      />
      {/* Video row */}
      <HScrollRow arrowColor={social.color}>
        {embed.videos.map((vid, i) => (
          <LazyEmbed
            key={vid + i}
            src={`https://www.youtube.com/embed/${vid}?rel=0&modestbranding=1`}
            title={`YouTube video ${i + 1}`}
            width={320}
            height={180}
            style={{ minWidth: 320, maxWidth: 320, flexShrink: 0 }}
          />
        ))}
      </HScrollRow>
    </div>
  );
};

/* ── Twitch section ── */
const TwitchSection = ({ social }) => {
  const [host, setHost] = useState("localhost");
  useEffect(() => { setHost(window.location.hostname); }, []);
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <span style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: social.color, opacity: 0.5 }}>{social.handle}</span>
        <a href={social.profileUrl} target="_blank" rel="noopener noreferrer" style={{ background: `${social.color}10`, border: `1px solid ${social.color}25`, color: social.color, fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 2, padding: "4px 12px", cursor: "pointer", borderRadius: 2, textTransform: "uppercase", textDecoration: "none" }}>Follow</a>
      </div>
      <LazyEmbed
        src={`https://player.twitch.tv/?channel=${social.embed.channel}&parent=${host}&muted=true`}
        title="Twitch stream"
        height={420}
      />
      <LazyEmbed
        src={`https://www.twitch.tv/embed/${social.embed.channel}/chat?parent=${host}&darkpopout`}
        title="Twitch chat"
        height={300}
        style={{ marginTop: 12 }}
      />
    </div>
  );
};

/* ── TikTok section ── */
const TikTokSection = ({ social }) => (
  <div>
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
      <span style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: social.color, opacity: 0.5 }}>{social.handle}</span>
      <a href={social.profileUrl} target="_blank" rel="noopener noreferrer" style={{ background: `${social.color}10`, border: `1px solid ${social.color}25`, color: social.color, fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 2, padding: "4px 12px", cursor: "pointer", borderRadius: 2, textTransform: "uppercase", textDecoration: "none" }}>Follow</a>
    </div>
    <HScrollRow arrowColor={social.color}>
      {social.embed.videos.map((vid, i) => (
        <LazyEmbed
          key={vid}
          src={`https://www.tiktok.com/embed/v2/${vid}`}
          title={`TikTok video ${i + 1}`}
          width={325}
          height={580}
          style={{ minWidth: 325, maxWidth: 325, flexShrink: 0 }}
        />
      ))}
    </HScrollRow>
  </div>
);

/* ── Instagram section ── */
const InstagramSection = ({ social }) => (
  <div>
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
      <span style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: social.color, opacity: 0.5 }}>{social.handle}</span>
      <a href={social.profileUrl} target="_blank" rel="noopener noreferrer" style={{ background: `${social.color}10`, border: `1px solid ${social.color}25`, color: social.color, fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 2, padding: "4px 12px", cursor: "pointer", borderRadius: 2, textTransform: "uppercase", textDecoration: "none" }}>Follow</a>
    </div>
    <HScrollRow arrowColor={social.color}>
      {social.embed.posts.map((code, i) => (
        <LazyEmbed
          key={code}
          src={`https://www.instagram.com/p/${code}/embed`}
          title={`Instagram post ${i + 1}`}
          width={330}
          height={440}
          style={{ minWidth: 330, maxWidth: 330, flexShrink: 0 }}
        />
      ))}
    </HScrollRow>
  </div>
);

/* ── X / Twitter section (syndication iframe - no widgets.js needed) ── */
const XTimelineSection = ({ social }) => (
  <div>
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
      <span style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: social.color, opacity: 0.5 }}>{social.handle}</span>
      <a href={social.profileUrl} target="_blank" rel="noopener noreferrer" style={{ background: `${social.color}10`, border: `1px solid ${social.color}25`, color: social.color, fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 2, padding: "4px 12px", cursor: "pointer", borderRadius: 2, textTransform: "uppercase", textDecoration: "none" }}>Follow</a>
    </div>
    <LazyEmbed
      src={`https://syndication.twitter.com/srv/timeline-profile/screen-name/RareGh0st?dnt=true&embedId=twitter-widget-0&frame=false&hideBorder=true&hideFooter=true&hideHeader=false&hideScrollBar=false&lang=en&transparent=true&theme=dark`}
      title="X Timeline"
      height={600}
    />
  </div>
);

/* ── Facebook section ── */
const FacebookSection = ({ social }) => (
  <div>
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
      <span style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: social.color, opacity: 0.5 }}>{social.handle}</span>
      <a href={social.profileUrl} target="_blank" rel="noopener noreferrer" style={{ background: `${social.color}10`, border: `1px solid ${social.color}25`, color: social.color, fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 2, padding: "4px 12px", cursor: "pointer", borderRadius: 2, textTransform: "uppercase", textDecoration: "none" }}>Follow</a>
    </div>
    <LazyEmbed
      src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(social.embed.pageUrl)}&tabs=timeline&width=500&height=500&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false`}
      title="Facebook Page"
      height={500}
    />
  </div>
);

/* ── Embed dispatcher ── */
const EmbedSection = ({ social }) => {
  const type = social.embed?.type;
  if (type === "youtube") return <YouTubeSection social={social} />;
  if (type === "twitch") return <TwitchSection social={social} />;
  if (type === "tiktok") return <TikTokSection social={social} />;
  if (type === "instagram") return <InstagramSection social={social} />;
  if (type === "x-timeline") return <XTimelineSection social={social} />;
  if (type === "facebook") return <FacebookSection social={social} />;
  return <LinkOutCard social={social} />;
};

/* ── Video card (existing) ── */
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

/* ── Main page ── */
export const MediaHub = () => {
  const [genre, setGenre] = useState("all");
  const filtered = genre === "all" ? VIDEOS : VIDEOS.filter(v => v.genre === genre);
  const ac = VIDEO_GENRES.find(g => g.id === genre);

  return (
    <div style={{ minHeight: "100vh", paddingTop: 120, paddingBottom: 80 }}>
      <SEO title="Media" description="Watch, listen, and follow RareGh0st -- video content, music, and social feeds." path="/media" />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>
        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 6, color: P.cyan, textTransform: "uppercase", marginBottom: 12 }}>
            <ScrollMorphText speed={75}>Media</ScrollMorphText>
          </div>
          <h2 style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 400, color: P.ghost, margin: 0 }}>
            <ScrollMorphText speed={70}>{'Watch \u00B7 Listen \u00B7 Follow'}</ScrollMorphText>
          </h2>
          <div style={{ width: 40, height: 1, marginTop: 20, background: `linear-gradient(to right, ${P.cyan}, transparent)` }} />
        </div>

        {/* Video section (existing genre filter + cards) */}
        <Collapsible title="Video" icon={"\u25B6"} color={ac?.color || P.cyan} defaultOpen={true} count={VIDEOS.length}>
          <div style={{ display: "flex", gap: 4, marginBottom: 18, flexWrap: "wrap" }}>
            {VIDEO_GENRES.map(g => (
              <button key={g.id} onClick={() => setGenre(g.id)} style={{
                background: genre === g.id ? `${g.color}12` : "transparent",
                border: `1px solid ${genre === g.id ? g.color + "35" : P.steel + "18"}`,
                color: genre === g.id ? g.color : P.bone,
                fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 3,
                padding: "7px 15px", cursor: "pointer", textTransform: "uppercase",
                borderRadius: 2, transition: "all 0.3s",
              }}>{g.label}</button>
            ))}
          </div>
          <HScrollRow arrowColor={ac?.color || P.cyan}>
            {filtered.map(v => <VideoCard key={v.id} video={v} featured={genre === "codename-angel"} />)}
          </HScrollRow>
        </Collapsible>

        {/* Social feeds -- each platform gets real embeds */}
        <div style={{ marginTop: 6 }}>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 4, color: P.bone, opacity: 0.2, textTransform: "uppercase", margin: "18px 0 8px 4px" }}>
            <ScrollMorphText speed={70}>Social Feeds</ScrollMorphText>
          </div>
          {SOCIALS.map(s => (
            <Collapsible key={s.id} title={s.label} icon={s.icon} color={s.color} defaultOpen={false}>
              <EmbedSection social={s} />
            </Collapsible>
          ))}
        </div>
      </div>
    </div>
  );
};
