import { useState } from "react";
import { P } from "../data/palette";
import { VIDEO_GENRES, VIDEOS } from "../data/videos";
import { SOCIALS } from "../data/socials";
import { ScrollMorphText, HoverMorphText } from "../components/MorphText";
import { HScrollRow } from "../components/HScrollRow";
import { Collapsible } from "../components/Collapsible";
import { SEO } from "../components/SEO";

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

const SocialCard = ({ index, color }) => (
  <div style={{ minWidth: 240, maxWidth: 240, height: 280, borderRadius: 3, background: `${P.deep}88`, border: `1px solid ${P.steel}10`, padding: 18, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
    <div>
      <div style={{ width: 30, height: 30, borderRadius: "50%", background: `${color}12`, border: `1px solid ${color}18`, marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: color, opacity: 0.5 }} />
      </div>
      <div style={{ fontFamily: "'Georgia', serif", fontSize: 12, color: P.ghost, lineHeight: 1.6, opacity: 0.5, animation: "morphBreathSoft 1.5s ease-in-out infinite" }}>
        {["New piece just dropped. The fractal doesn\u2019t sleep.", "Working on something wild.", "Photoshop at 3am hits different.", "The skull sees everything.", "When AI and artist collaborate, the mirrors multiply.", "Streaming tonight."][index % 6]}
      </div>
    </div>
    <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: P.bone, opacity: 0.15 }}>{index + 1}h ago</div>
  </div>
);

const TwitchPanel = () => {
  const [live] = useState(false);
  return (
    <div style={{ background: `linear-gradient(135deg, ${P.deep}, #9146ff06, ${P.deep})`, border: `1px solid ${live ? "#9146ff35" : P.steel + "15"}`, borderRadius: 3, padding: 22, marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <span style={{ fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 4, color: "#9146ff", textTransform: "uppercase" }}>{"\u25C6"} Twitch</span>
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: `${P.steel}18`, padding: "3px 10px", borderRadius: 10 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: P.steel }} />
              <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 2, color: P.bone, opacity: 0.4, textTransform: "uppercase" }}>Offline</span>
            </div>
          </div>
          <div style={{ fontFamily: "'Georgia', serif", fontSize: 16, color: P.ghost, marginBottom: 6, animation: "morphBreathSoft 1s ease-in-out infinite" }}>RareGh0st</div>
          <div style={{ fontFamily: "'Georgia', serif", fontSize: 12, color: P.bone, opacity: 0.4 }}>Currently offline. Follow to get notified.</div>
        </div>
        <button style={{ background: "#9146ff12", border: "1px solid #9146ff30", color: P.ghost, fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 3, padding: "8px 18px", cursor: "pointer", textTransform: "uppercase" }}>Follow</button>
      </div>
    </div>
  );
};

export const MediaHub = () => {
  const [genre, setGenre] = useState("all");
  const filtered = genre === "all" ? VIDEOS : VIDEOS.filter(v => v.genre === genre);
  const ac = VIDEO_GENRES.find(g => g.id === genre);
  return (
    <div style={{ minHeight: "100vh", paddingTop: 120, paddingBottom: 80 }}>
      <SEO title="Media" description="Watch, listen, and follow RareGh0st -- video content, music, and social feeds." path="/media" />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 6, color: P.cyan, textTransform: "uppercase", marginBottom: 12 }}><ScrollMorphText speed={75}>Media</ScrollMorphText></div>
          <h2 style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 400, color: P.ghost, margin: 0 }}><ScrollMorphText speed={70}>{'Watch \u00B7 Listen \u00B7 Follow'}</ScrollMorphText></h2>
          <div style={{ width: 40, height: 1, marginTop: 20, background: `linear-gradient(to right, ${P.cyan}, transparent)` }} />
        </div>
        <TwitchPanel />
        <Collapsible title="Video" icon={"\u25B6"} color={ac?.color || P.cyan} defaultOpen={true} count={VIDEOS.length}>
          <div style={{ display: "flex", gap: 4, marginBottom: 18, flexWrap: "wrap" }}>
            {VIDEO_GENRES.map(g => (
              <button key={g.id} onClick={() => setGenre(g.id)} style={{ background: genre === g.id ? `${g.color}12` : "transparent", border: `1px solid ${genre === g.id ? g.color + "35" : P.steel + "18"}`, color: genre === g.id ? g.color : P.bone, fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 3, padding: "7px 15px", cursor: "pointer", textTransform: "uppercase", borderRadius: 2, transition: "all 0.3s" }}>{g.label}</button>
            ))}
          </div>
          <HScrollRow arrowColor={ac?.color || P.cyan}>
            {filtered.map(v => <VideoCard key={v.id} video={v} featured={genre === "codename-angel"} />)}
          </HScrollRow>
        </Collapsible>
        <div style={{ marginTop: 6 }}>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 4, color: P.bone, opacity: 0.2, textTransform: "uppercase", margin: "18px 0 8px 4px" }}><ScrollMorphText speed={70}>Social Feeds</ScrollMorphText></div>
          {SOCIALS.map(s => (
            <Collapsible key={s.id} title={s.label} icon={s.icon} color={s.color} defaultOpen={false} count={6}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: s.color, opacity: 0.5 }}>{s.handle}</span>
                <button style={{ background: `${s.color}10`, border: `1px solid ${s.color}25`, color: s.color, fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 2, padding: "4px 12px", cursor: "pointer", borderRadius: 2, textTransform: "uppercase" }}>Follow</button>
              </div>
              <HScrollRow arrowColor={s.color}>
                {Array.from({ length: 6 }, (_, i) => <SocialCard key={i} index={i} color={s.color} />)}
              </HScrollRow>
            </Collapsible>
          ))}
        </div>
      </div>
    </div>
  );
};
