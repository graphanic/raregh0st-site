import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { P } from "../data/palette";
import { PIECES } from "../data/pieces";
import { getAdaptationsForWork, getCategory, getWorkHref } from "../data/catalog";
import { ScrollMorphText } from "../components/MorphText";
import { PortfolioPlaceholder } from "../components/PortfolioPlaceholder";
import { SEO } from "../components/SEO";

const ShowcaseDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const piece = PIECES.find(p => String(p.id) === id);
  const [vis, setVis] = useState(false);
  const [imgHover, setImgHover] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIdx, setGalleryIdx] = useState(0);
  useEffect(() => { setTimeout(() => setVis(true), 50); }, []);

  if (!piece) return null;

  const isVideo = piece.mediaType === "video" && piece.img;
  const category = getCategory("photoshop-originals");
  const adaptations = getAdaptationsForWork(piece.id);
  const galleryImages = [
    // Skip the hero src in the image lightbox if it's a video — video gets its own native player.
    ...(!isVideo && piece.img ? [{ src: piece.img, label: piece.title }] : []),
    ...(piece.details || []).map((d, i) => ({ src: d.img, label: d.label || `Detail ${i + 1}` })),
  ].filter(g => g.src);

  return (
    <div style={{ minHeight: "100vh", paddingTop: 100, paddingBottom: 80 }}>
      <SEO title={piece.title} description={piece.description} path={`/portfolio/${id}`} />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>
        <button onClick={() => navigate("/portfolio?category=photoshop-originals")} style={{ background: "none", border: "none", color: P.bone, fontFamily: "'Courier New', monospace", fontSize: 11, letterSpacing: 4, cursor: "pointer", opacity: 0.4, marginBottom: 32, textTransform: "uppercase" }}>&larr; Photoshop Originals</button>
        <div style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(12px)", transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)" }}>
          <div className="showcase-grid" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 52, marginBottom: 48 }}>
            <div>
              <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 5, color: piece.colors[0], textTransform: "uppercase", marginBottom: 12 }}>{category.label} &mdash; {piece.series} &mdash; {piece.year}</div>
              <h2 style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 400, color: P.ghost, margin: "0 0 16px 0", lineHeight: 1.1 }}><ScrollMorphText speed={80}>{piece.title}</ScrollMorphText></h2>
              <p style={{ fontFamily: "'Georgia', serif", fontSize: 15, lineHeight: 1.7, color: P.bone, opacity: 0.6, margin: 0, maxWidth: 480, animation: "morphBreathSoft 1s ease-in-out infinite" }}>{piece.description}</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28, paddingTop: 16, borderTop: `1px solid ${P.steel}20` }}>
                {[["Medium", piece.medium], ["Edition", piece.printEdition ? `Signed print edition of ${piece.printEdition.size}` : null], ["Tags", piece.tags.join(" \u00B7 ")]].filter(([, value]) => value).map(([l, v]) => (
                  <div key={l} style={{ display: "flex", gap: 12 }}>
                    <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 3, color: P.bone, opacity: 0.3, textTransform: "uppercase", minWidth: 55 }}>{l}</span>
                    <span style={{ fontFamily: "'Georgia', serif", fontSize: 12, color: P.bone, opacity: 0.55 }}>{v}</span>
                  </div>
                ))}
              </div>
              {piece.printEdition && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6, padding: "14px 16px", border: `1px solid ${P.gold}25`, background: `${P.gold}08` }}>
                  <span style={{ fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 3, color: P.gold, textTransform: "uppercase" }}>Print release coming soon</span>
                  <span style={{ fontFamily: "'Georgia', serif", fontSize: 11, color: P.bone, opacity: 0.45, lineHeight: 1.5 }}>One shared, signed edition of ten across all future print formats.</span>
                  <button type="button" onClick={() => navigate("/contact#signal")} style={{ marginTop: 8, background: "transparent", border: `1px solid ${P.gold}44`, color: P.gold, fontFamily: "'Courier New', monospace", fontSize: 8, letterSpacing: 2, padding: "8px 11px", cursor: "pointer", textTransform: "uppercase" }}>Join the print release list</button>
                </div>
              )}
              {adaptations.length > 0 && (
                <div style={{ marginTop: 18 }}>
                  <div style={{ fontFamily: "'Courier New', monospace", fontSize: 8, letterSpacing: 3, color: P.purple, textTransform: "uppercase", marginBottom: 8 }}>AI Adaptations</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {adaptations.map((adaptation) => (
                      <button key={adaptation.id} onClick={() => navigate(getWorkHref(adaptation))} style={{ background: `${P.purple}0a`, border: `1px solid ${P.purple}25`, color: P.bone, fontFamily: "'Courier New', monospace", fontSize: 8, letterSpacing: 1, padding: "7px 10px", cursor: "pointer" }}>
                        {adaptation.title} ↗
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {isVideo ? (
            <div style={{ position: "relative", overflow: "hidden", marginBottom: 48, border: `1px solid ${piece.colors[0]}15` }}>
              <video
                src={piece.img}
                controls
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                style={{ width: "100%", height: "auto", display: "block", background: P.abyss }}
              />
            </div>
          ) : (
            <div
              style={{ position: "relative", overflow: "hidden", cursor: "pointer", marginBottom: 48, border: `1px solid ${piece.colors[0]}15` }}
              onMouseEnter={() => setImgHover(true)}
              onMouseLeave={() => setImgHover(false)}
              onClick={() => { if (piece.img) { setGalleryIdx(0); setGalleryOpen(true); } }}
              onContextMenu={(e) => e.preventDefault()}
            >
              {piece.img ? (
                <img src={piece.img} alt={piece.title} style={{
                  width: "100%", height: "auto", display: "block",
                  filter: imgHover ? "blur(6px) brightness(0.7)" : "blur(0) brightness(1)",
                  transform: imgHover ? "scale(1.03)" : "scale(1)",
                  transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
                  pointerEvents: "none",
                }} />
              ) : <PortfolioPlaceholder colors={piece.colors} aspect="21/9" />}
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                opacity: imgHover ? 1 : 0, transition: "opacity 0.4s ease", pointerEvents: "none",
              }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", border: `2px solid ${P.ghost}88`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12, background: `${P.abyss}44`, backdropFilter: "blur(4px)" }}>
                  <span style={{ fontSize: 22, color: P.ghost }}>{"\u26F6"}</span>
                </div>
                <span style={{ fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 5, color: P.ghost, textTransform: "uppercase", textShadow: `0 2px 12px ${P.abyss}` }}>View Full Size</span>
              </div>
            </div>
          )}

          <div style={{ marginBottom: 48 }}>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 6, color: P.bone, opacity: 0.25, textTransform: "uppercase", marginBottom: 20 }}>Details & Close-ups</div>
            <div className="detail-closeups" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              {(piece.details && piece.details.length > 0 ? piece.details : [
                { label: "Detail I \u2014 Center", aspect: "1" },
                { label: "Detail II \u2014 Texture", aspect: "1" },
                { label: "Detail III \u2014 Symbol", aspect: "1" },
              ]).map(({ label, aspect, img: detailImg }, i) => (
                <div key={i} style={{ cursor: detailImg ? "pointer" : "default" }} onClick={() => { if (detailImg) { setGalleryIdx(i + 1); setGalleryOpen(true); } }}>
                  {detailImg ? (
                    <div style={{ aspectRatio: aspect || "1", overflow: "hidden", position: "relative" }}>
                      <img src={detailImg} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }} />
                    </div>
                  ) : (
                    <PortfolioPlaceholder colors={[piece.colors[i % 2], piece.colors[(i + 1) % 2]]} aspect={aspect || "1"} />
                  )}
                  <div style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: P.bone, opacity: 0.2, marginTop: 6, letterSpacing: 2, textTransform: "uppercase" }}>{label}</div>
                </div>
              ))}
            </div>
            {(!piece.details || piece.details.length === 0) && (
              <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: P.bone, opacity: 0.15, marginTop: 12, letterSpacing: 2, textAlign: "center" }}>REPLACE WITH CLOSE-UP CROPS FROM PHOTOSHOP</div>
            )}
          </div>

          <div style={{ padding: 28, borderLeft: `2px solid ${piece.colors[0]}22`, marginBottom: 40, maxWidth: 600 }}>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 6, color: piece.colors[0], opacity: 0.6, textTransform: "uppercase", marginBottom: 10 }}>Process & Provenance</div>
            <div style={{ fontFamily: "'Georgia', serif", fontSize: 13, color: P.bone, opacity: 0.5, lineHeight: 1.7, fontStyle: "italic" }}>
              Built through the cumulative Photoshop process behind 1RareGh0st: source material is selected, altered, layered, coloured, lit, and resolved through sustained human judgment. Every hidden face and recurring symbol is placed in conversation with the whole.
            </div>
          </div>
        </div>
      </div>

      {galleryOpen && galleryImages.length > 0 && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9000,
          background: `${P.abyss}f2`, backdropFilter: "blur(20px)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          animation: "fadeSlideIn 0.3s ease",
        }} onClick={() => setGalleryOpen(false)}>
          <button onClick={() => setGalleryOpen(false)} style={{
            position: "absolute", top: 24, right: 28,
            background: "none", border: `1px solid ${P.ghost}22`, color: P.ghost,
            width: 40, height: 40, fontSize: 20, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Courier New', monospace", transition: "all 0.3s",
          }}>&times;</button>

          <div style={{ maxWidth: "90vw", maxHeight: "75vh", position: "relative" }} onClick={(e) => e.stopPropagation()}>
            <img src={galleryImages[galleryIdx]?.src} alt={galleryImages[galleryIdx]?.label} style={{
              maxWidth: "90vw", maxHeight: "75vh", objectFit: "contain",
              pointerEvents: "none", display: "block",
            }} />
          </div>

          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 4, color: P.ghost, opacity: 0.4, textTransform: "uppercase", marginTop: 16 }}>
            {galleryImages[galleryIdx]?.label}
            {galleryImages.length > 1 && <span style={{ opacity: 0.4, marginLeft: 12 }}>{galleryIdx + 1} / {galleryImages.length}</span>}
          </div>

          {galleryImages.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); setGalleryIdx(i => i <= 0 ? galleryImages.length - 1 : i - 1); }} style={{
                position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)",
                background: `${P.abyss}88`, border: `1px solid ${P.ghost}15`, color: P.ghost,
                width: 48, height: 48, fontSize: 20, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Courier New', monospace", backdropFilter: "blur(8px)",
              }}>&lsaquo;</button>
              <button onClick={(e) => { e.stopPropagation(); setGalleryIdx(i => i >= galleryImages.length - 1 ? 0 : i + 1); }} style={{
                position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)",
                background: `${P.abyss}88`, border: `1px solid ${P.ghost}15`, color: P.ghost,
                width: 48, height: 48, fontSize: 20, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Courier New', monospace", backdropFilter: "blur(8px)",
              }}>&rsaquo;</button>
            </>
          )}

          {galleryImages.length > 1 && (
            <div style={{ display: "flex", gap: 8, marginTop: 16 }} onClick={(e) => e.stopPropagation()}>
              {galleryImages.map((g, i) => (
                <div key={i} onClick={() => setGalleryIdx(i)} style={{
                  width: 56, height: 56, overflow: "hidden", cursor: "pointer",
                  border: `2px solid ${i === galleryIdx ? piece.colors[0] : P.ghost + "15"}`,
                  opacity: i === galleryIdx ? 1 : 0.5, transition: "all 0.3s",
                }}>
                  <img src={g.src} alt={g.label} style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShowcaseDetail;
