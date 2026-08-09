import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { P } from "../data/palette";
import { DESIGN_PROJECTS } from "../data/portfolio";
import { PortfolioPlaceholder, Lightbox } from "../components/PortfolioPlaceholder";
import { SEO } from "../components/SEO";

const CaseStudyDetail = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const project = DESIGN_PROJECTS.find(p => p.slug === slug) || DESIGN_PROJECTS.find(p => p.id === slug);
  const [vis, setVis] = useState(false);
  const [lightboxItem, setLightboxItem] = useState(null);
  useEffect(() => { setTimeout(() => setVis(true), 50); }, []);

  if (!project) return null;

  // Build gallery items for lightbox — main image + gallery images
  const galleryItems = [];
  if (project.img) {
    galleryItems.push({ id: `${project.id}-main`, title: project.title, img: project.img, colors: project.colors, description: project.description, tags: project.tags });
  }
  if (project.gallery && project.gallery.length > 0) {
    project.gallery.forEach((g, i) => {
      galleryItems.push({ id: `${project.id}-gallery-${i}`, title: g.title || `${project.title} — ${i + 1}`, img: g.img, colors: project.colors, description: g.caption || "", tags: project.tags });
    });
  }

  return (
    <div style={{ minHeight: "100vh", paddingTop: 100, paddingBottom: 80 }}>
      <SEO title={project.title} description={project.description} path={`/portfolio/design/${project.slug || project.id}`} />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 40px" }}>
        <button onClick={() => navigate("/portfolio")} style={{ background: "none", border: "none", color: P.bone, fontFamily: "'Courier New', monospace", fontSize: 11, letterSpacing: 4, cursor: "pointer", opacity: 0.4, marginBottom: 32, textTransform: "uppercase" }}>&larr; Portfolio</button>
        <div style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(12px)", transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)" }}>
          {/* Main hero image — clickable into lightbox */}
          {project.img ? (
            <div
              onClick={() => setLightboxItem(galleryItems[0])}
              style={{ cursor: "zoom-in", overflow: "hidden" }}
            >
              <img src={project.img} alt={project.title} style={{ width: "100%", display: "block" }} />
            </div>
          ) : (
            <PortfolioPlaceholder colors={project.colors} aspect="21/9" />
          )}
          <div style={{ marginTop: 40 }}>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 5, color: project.colors[0], textTransform: "uppercase", marginBottom: 8 }}>{project.category} &mdash; {project.year}</div>
            <h2 style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 400, color: P.ghost, margin: "0 0 6px", lineHeight: 1.15 }}>{project.title}</h2>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: P.bone, opacity: 0.3, letterSpacing: 2, marginBottom: 28 }}>{project.role}</div>

            <div className="casestudy-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginBottom: 40 }}>
              <div>
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 4, color: P.bone, opacity: 0.3, textTransform: "uppercase", marginBottom: 10 }}>Brief</div>
                <p style={{ fontFamily: "'Georgia', serif", fontSize: 13, lineHeight: 1.7, color: P.bone, opacity: 0.55, margin: 0 }}>{project.brief}</p>
              </div>
              <div>
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 4, color: P.bone, opacity: 0.3, textTransform: "uppercase", marginBottom: 10 }}>Approach</div>
                <p style={{ fontFamily: "'Georgia', serif", fontSize: 13, lineHeight: 1.7, color: P.bone, opacity: 0.55, margin: 0 }}>{project.approach || project.description}</p>
              </div>
            </div>

            {project.deliverables && project.deliverables.length > 0 && (
              <>
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 4, color: P.bone, opacity: 0.3, textTransform: "uppercase", marginBottom: 12 }}>Deliverables</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 40 }}>
                  {project.deliverables.map(d => <span key={d} style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: project.colors[0], letterSpacing: 2, padding: "6px 14px", border: `1px solid ${project.colors[0]}22`, textTransform: "uppercase" }}>{d}</span>)}
                </div>
              </>
            )}

            {/* Gallery section */}
            {galleryItems.length > 1 && (
              <>
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 4, color: P.bone, opacity: 0.3, textTransform: "uppercase", marginBottom: 16 }}>Gallery</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 40 }}>
                  {galleryItems.slice(1).map((item, i) => (
                    <div
                      key={item.id}
                      onClick={() => setLightboxItem(item)}
                      style={{ cursor: "zoom-in", overflow: "hidden", border: `1px solid ${P.steel}0a`, transition: "border-color 0.3s" }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = `${project.colors[0]}33`}
                      onMouseLeave={e => e.currentTarget.style.borderColor = `${P.steel}0a`}
                    >
                      <img src={item.img} alt={item.title} style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block", transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)" }} />
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Placeholder when no gallery yet */}
            {galleryItems.length <= 1 && (
              <>
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 4, color: P.bone, opacity: 0.3, textTransform: "uppercase", marginBottom: 16 }}>Gallery</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 40 }}>
                  {[1, 2, 3, 4].map(i => <PortfolioPlaceholder key={i} colors={project.colors} aspect="4/3" />)}
                </div>
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: P.bone, opacity: 0.15, letterSpacing: 2, textAlign: "center" }}>REPLACE WITH PROJECT SCREENSHOTS & DELIVERABLE IMAGES</div>
              </>
            )}

            <div style={{ marginTop: 48, padding: "28px", borderLeft: `2px solid ${project.colors[0]}55`, background: `${project.colors[0]}06` }}>
              <div style={{ fontFamily: "'Courier New', monospace", fontSize: 8, letterSpacing: 4, color: project.colors[0], textTransform: "uppercase", marginBottom: 10 }}>Commissioned Design</div>
              <div style={{ fontFamily: "'Georgia', serif", fontSize: 18, color: P.ghost, marginBottom: 9 }}>Need a visual world built around a message or story?</div>
              <p style={{ fontFamily: "'Georgia', serif", fontSize: 12, color: P.bone, opacity: 0.5, lineHeight: 1.65, margin: "0 0 16px" }}>Share the purpose, audience, references, and desired deliverables. Commercial scope and usage rights are quoted separately.</p>
              <button type="button" onClick={() => navigate("/contact?type=commission")} style={{ background: "transparent", border: `1px solid ${project.colors[0]}55`, color: project.colors[0], fontFamily: "'Courier New', monospace", fontSize: 8, letterSpacing: 3, padding: "10px 14px", cursor: "pointer", textTransform: "uppercase" }}>Commission Your Story</button>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        item={lightboxItem}
        items={galleryItems.length > 0 ? galleryItems : undefined}
        onNavigate={setLightboxItem}
        onClose={() => setLightboxItem(null)}
      />
    </div>
  );
};

export default CaseStudyDetail;
