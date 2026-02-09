import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { P } from "../data/palette";
import { PIECES, ART_IMGS } from "../data/pieces";
import { PORTFOLIO_TABS, DESIGN_PROJECTS, PHOTO_GALLERY, AI_WORKS, MOTION_WORKS } from "../data/portfolio";
import { HoverMorphText, ScrollMorphText } from "../components/MorphText";
import { HScrollRow } from "../components/HScrollRow";
import { PortfolioPlaceholder, Lightbox } from "../components/PortfolioPlaceholder";
import { SEO } from "../components/SEO";

const CuratedCard = ({ piece, onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ cursor: "pointer", transition: "all 0.4s" }}>
      <div style={{ overflow: "hidden", border: `1px solid ${hov ? piece.colors[0] + "33" : P.steel + "0a"}`, transition: "all 0.4s" }}>
        {piece.img ? <img src={piece.img} alt={piece.title} style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", transform: hov ? "scale(1.03)" : "scale(1)", transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)" }} />
        : <div style={{ transform: hov ? "scale(1.03)" : "scale(1)", transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)" }}><PortfolioPlaceholder colors={piece.colors} /></div>}
      </div>
      <div style={{ marginTop: 14 }}>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 4, color: piece.colors[0], textTransform: "uppercase", opacity: 0.7 }}>{piece.series} &mdash; {piece.year}</div>
        <div style={{ fontFamily: "'Georgia', serif", fontSize: 16, color: P.ghost, marginTop: 4, lineHeight: 1.3 }}><HoverMorphText>{piece.title}</HoverMorphText></div>
        <div style={{ fontFamily: "'Georgia', serif", fontSize: 11, color: P.bone, opacity: 0.4, marginTop: 6, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", animation: "morphBreathSoft 1.2s ease-in-out infinite" }}>{piece.description}</div>
      </div>
    </div>
  );
};

const CaseStudyCard = ({ project, onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ cursor: "pointer", border: `1px solid ${hov ? project.colors[0] + "22" : P.steel + "0a"}`, transition: "all 0.4s", overflow: "hidden" }}>
      <PortfolioPlaceholder colors={project.colors} aspect="16/9" />
      <div style={{ padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 3, color: project.colors[0], textTransform: "uppercase" }}>{project.category} &mdash; {project.year}</div>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: P.bone, opacity: 0.25, letterSpacing: 2, textTransform: "uppercase" }}>{project.role}</div>
        </div>
        <div style={{ fontFamily: "'Georgia', serif", fontSize: 16, color: P.ghost, marginBottom: 8, lineHeight: 1.3 }}><HoverMorphText>{project.title}</HoverMorphText></div>
        <div style={{ fontFamily: "'Georgia', serif", fontSize: 11, color: P.bone, opacity: 0.4, lineHeight: 1.5, marginBottom: 12, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", animation: "morphBreathSoft 1.2s ease-in-out infinite" }}>{project.description}</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {project.deliverables.slice(0, 4).map(d => <span key={d} style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: P.bone, opacity: 0.35, letterSpacing: 1, padding: "3px 8px", background: `${P.steel}11` }}>{d}</span>)}
          {project.deliverables.length > 4 && <span style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: P.bone, opacity: 0.2, padding: "3px 8px" }}>+{project.deliverables.length - 4}</span>}
        </div>
      </div>
    </div>
  );
};

const getThumbnailUrl = (url) => {
  if (!url) return null;
  return url.includes('vercel-storage.com') ? `${url}?width=400&quality=75` : url;
};

const GridItem = ({ item, onClick, showProcess }) => {
  const [hov, setHov] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <div onClick={() => onClick(item)} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ cursor: "pointer", position: "relative", overflow: "hidden" }}>
      <div style={{ overflow: "hidden", border: `1px solid ${hov ? item.colors[0] + "22" : "transparent"}`, transition: "all 0.3s" }}>
        <div style={{ transform: hov ? "scale(1.05)" : "scale(1)", transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)" }}>
          {item.img ? (
            <div style={{ position: "relative", width: "100%", aspectRatio: "1", background: `linear-gradient(135deg, ${P.abyss}, ${item.colors[0]}0c, ${item.colors[1] || item.colors[0]}0e, ${P.abyss})` }}>
              <img
                src={getThumbnailUrl(item.img)}
                alt={item.title}
                loading="lazy"
                decoding="async"
                onLoad={() => setLoaded(true)}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block", opacity: loaded ? 1 : 0, transition: "opacity 0.4s ease" }}
              />
            </div>
          ) : (
            <PortfolioPlaceholder colors={item.colors} aspect="1" />
          )}
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "30px 12px 10px", background: `linear-gradient(to top, ${P.abyss}cc, transparent)`, opacity: hov ? 1 : 0, transition: "opacity 0.3s" }}>
        <div style={{ fontFamily: "'Georgia', serif", fontSize: 12, color: P.ghost }}>{item.title}</div>
        {showProcess && item.process && <div style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: item.colors[0], letterSpacing: 2, marginTop: 4 }}>{item.process}</div>}
      </div>
      <div style={{ position: "absolute", inset: 0, background: "transparent" }} onContextMenu={(e) => e.preventDefault()} />
    </div>
  );
};

const MotionItem = ({ work, onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={() => onClick(work)} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ cursor: "pointer", transition: "all 0.3s" }}>
      <div style={{ position: "relative", overflow: "hidden", border: `1px solid ${hov ? work.colors[0] + "22" : P.steel + "0a"}`, transition: "all 0.3s" }}>
        <PortfolioPlaceholder colors={work.colors} aspect="16/9" />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", border: `2px solid ${P.ghost}44`, display: "flex", alignItems: "center", justifyContent: "center", background: `${P.abyss}88`, backdropFilter: "blur(4px)", transform: hov ? "scale(1.15)" : "scale(1)", transition: "transform 0.3s" }}>
            <span style={{ color: P.ghost, fontSize: 18, marginLeft: 3 }}>{"\u25B6"}</span>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 8, right: 10, fontFamily: "'Courier New', monospace", fontSize: 9, color: P.ghost, opacity: 0.5, letterSpacing: 1, background: `${P.abyss}aa`, padding: "2px 8px" }}>{work.duration}</div>
        <div style={{ position: "absolute", top: 8, left: 10 }}>
          <span style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: work.colors[0], letterSpacing: 2, textTransform: "uppercase", background: `${P.abyss}cc`, padding: "3px 8px" }}>{work.type.replace(/-/g, " ")}</span>
        </div>
      </div>
      <div style={{ marginTop: 10 }}>
        <div style={{ fontFamily: "'Georgia', serif", fontSize: 14, color: P.ghost }}><HoverMorphText>{work.title}</HoverMorphText></div>
        <div style={{ fontFamily: "'Georgia', serif", fontSize: 11, color: P.bone, opacity: 0.4, marginTop: 4, lineHeight: 1.4, animation: "morphBreathSoft 1.2s ease-in-out infinite" }}>{work.description}</div>
      </div>
    </div>
  );
};

const BATCH_SIZE = 20;

const Portfolio = ({ addToCart, portfolioTab, setPortfolioTab }) => {
  const navigate = useNavigate();
  const tab = portfolioTab;
  const setTab = setPortfolioTab;
  const [lightboxItem, setLightboxItem] = useState(null);
  const [tagFilter, setTagFilter] = useState(null);
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const loadMoreRef = useRef(null);
  const activeTab = PORTFOLIO_TABS.find(t => t.id === tab);

  // Reset visible count when tab or filter changes
  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [tab, tagFilter]);

  // Infinite scroll observer
  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount(prev => prev + BATCH_SIZE);
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [tab, tagFilter]);

  const PHOTO_SUBCATEGORIES = ["landscape", "portrait", "urban", "abstract", "studio", "street", "night", "nature", "event", "editorial"];

  const getTagsForTab = () => {
    if (tab === "design") return [...new Set(DESIGN_PROJECTS.map(p => p.category))];
    if (tab === "photography") return PHOTO_SUBCATEGORIES;
    if (tab === "ai-human") return [...new Set(AI_WORKS.flatMap(p => p.tags))];
    if (tab === "motion") return [...new Set(MOTION_WORKS.map(p => p.type))];
    return [];
  };
  const tags = getTagsForTab();

  return (
    <div style={{ minHeight: "100vh", paddingTop: 120, paddingBottom: 80 }}>
      <SEO title="Portfolio" description="Multi-disciplinary creative portfolio by RareGh0st — art, design, photography, motion, and AI collaboration." />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 6, color: P.cyan, textTransform: "uppercase", marginBottom: 12 }}><ScrollMorphText speed={75}>Portfolio</ScrollMorphText></div>
          <h2 style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 400, color: P.ghost, margin: 0 }}><ScrollMorphText speed={85}>The Work</ScrollMorphText></h2>
          <div style={{ width: 40, height: 1, background: `linear-gradient(to right, ${P.cyan}, transparent)`, marginTop: 20, marginBottom: 8 }} />
          <div style={{ fontFamily: "'Georgia', serif", fontSize: 13, color: P.bone, opacity: 0.4, lineHeight: 1.6 }}>Multi-disciplinary creative — art, design, photography, motion, and AI collaboration.</div>
        </div>

        <div className="portfolio-tabs" style={{ display: "flex", gap: 4, marginBottom: 8, flexWrap: "wrap" }}>
          {PORTFOLIO_TABS.map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); setTagFilter(null); }} style={{
              background: tab === t.id ? `${t.color}11` : "none",
              border: `1px solid ${tab === t.id ? t.color + "33" : P.steel + "15"}`,
              color: tab === t.id ? t.color : P.bone,
              fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 3,
              padding: "10px 18px", cursor: "pointer", textTransform: "uppercase",
              transition: "all 0.3s", display: "flex", alignItems: "center", gap: 8,
            }}
              onMouseEnter={(e) => { if (tab !== t.id) { e.target.style.borderColor = t.color + "22"; e.target.style.color = t.color; } }}
              onMouseLeave={(e) => { if (tab !== t.id) { e.target.style.borderColor = P.steel + "15"; e.target.style.color = P.bone; } }}
            ><span style={{ fontSize: 12 }}>{t.icon}</span> <HoverMorphText>{t.label}</HoverMorphText></button>
          ))}
        </div>

        <div style={{ fontFamily: "'Georgia', serif", fontSize: 12, color: P.bone, opacity: 0.35, marginBottom: 28, lineHeight: 1.5 }}>{activeTab?.description}</div>

        {tags.length > 0 && (
          <div style={{ display: "flex", gap: 6, marginBottom: 28, flexWrap: "wrap" }}>
            <button onClick={() => setTagFilter(null)} style={{ background: !tagFilter ? `${activeTab.color}11` : "none", border: `1px solid ${!tagFilter ? activeTab.color + "22" : P.steel + "11"}`, color: !tagFilter ? activeTab.color : P.bone, fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 2, padding: "6px 12px", cursor: "pointer", textTransform: "uppercase", opacity: !tagFilter ? 1 : 0.4, transition: "all 0.3s" }}>All</button>
            {tags.map(t => (
              <button key={t} onClick={() => setTagFilter(tagFilter === t ? null : t)} style={{ background: tagFilter === t ? `${activeTab.color}11` : "none", border: `1px solid ${tagFilter === t ? activeTab.color + "22" : P.steel + "11"}`, color: tagFilter === t ? activeTab.color : P.bone, fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 2, padding: "6px 12px", cursor: "pointer", textTransform: "uppercase", opacity: tagFilter === t ? 1 : 0.4, transition: "all 0.3s" }}>{t.replace(/-/g, " ")}</button>
            ))}
          </div>
        )}

        {tab === "curated" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 28, alignItems: "start" }}>
            {PIECES.map(p => <CuratedCard key={p.id} piece={p} onClick={() => navigate(`/portfolio/${p.id}`)} />)}
          </div>
        )}

        {tab === "design" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
            {DESIGN_PROJECTS.filter(p => !tagFilter || p.category === tagFilter).map(p => (
              <CaseStudyCard key={p.id} project={p} onClick={() => navigate(`/portfolio/design/${p.id}`)} />
            ))}
          </div>
        )}

        {tab === "photography" && (() => {
          const filtered = PHOTO_GALLERY.filter(p => !tagFilter || p.category === tagFilter);
          const visible = filtered.slice(0, visibleCount);
          const hasMore = visible.length < filtered.length;
          return (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}>
                {visible.map(p => (
                  <GridItem key={p.id} item={p} onClick={setLightboxItem} />
                ))}
              </div>
              {hasMore && (
                <div ref={loadMoreRef} style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
                  <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 3, color: P.bone, opacity: 0.25, textTransform: "uppercase" }}>Loading more...</div>
                </div>
              )}
            </>
          );
        })()}

        {tab === "ai-human" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
            {AI_WORKS.filter(p => !tagFilter || p.tags.includes(tagFilter)).map(p => (
              <GridItem key={p.id} item={p} onClick={setLightboxItem} showProcess />
            ))}
          </div>
        )}

        {tab === "motion" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
            {MOTION_WORKS.filter(p => !tagFilter || p.type === tagFilter).map(p => (
              <MotionItem key={p.id} work={p} onClick={setLightboxItem} />
            ))}
          </div>
        )}
      </div>
      <Lightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
    </div>
  );
};

export default Portfolio;
