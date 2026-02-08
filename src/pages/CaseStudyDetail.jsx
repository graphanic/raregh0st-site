import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { P } from "../data/palette";
import { DESIGN_PROJECTS } from "../data/portfolio";
import { PortfolioPlaceholder } from "../components/PortfolioPlaceholder";
import { SEO } from "../components/SEO";

const CaseStudyDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const project = DESIGN_PROJECTS.find(p => p.id === id);
  const [vis, setVis] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 50); }, []);

  if (!project) return null;

  return (
    <div style={{ minHeight: "100vh", paddingTop: 100, paddingBottom: 80 }}>
      <SEO title={project.title} description={project.description} />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 40px" }}>
        <button onClick={() => navigate("/portfolio")} style={{ background: "none", border: "none", color: P.bone, fontFamily: "'Courier New', monospace", fontSize: 11, letterSpacing: 4, cursor: "pointer", opacity: 0.4, marginBottom: 32, textTransform: "uppercase" }}>&larr; Portfolio</button>
        <div style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(12px)", transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)" }}>
          <PortfolioPlaceholder colors={project.colors} aspect="21/9" />
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
                <p style={{ fontFamily: "'Georgia', serif", fontSize: 13, lineHeight: 1.7, color: P.bone, opacity: 0.55, margin: 0 }}>{project.description}</p>
              </div>
            </div>

            <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 4, color: P.bone, opacity: 0.3, textTransform: "uppercase", marginBottom: 12 }}>Deliverables</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 40 }}>
              {project.deliverables.map(d => <span key={d} style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: project.colors[0], letterSpacing: 2, padding: "6px 14px", border: `1px solid ${project.colors[0]}22`, textTransform: "uppercase" }}>{d}</span>)}
            </div>

            <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 4, color: P.bone, opacity: 0.3, textTransform: "uppercase", marginBottom: 16 }}>Gallery</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 40 }}>
              {[1, 2, 3, 4].map(i => <PortfolioPlaceholder key={i} colors={project.colors} aspect="4/3" />)}
            </div>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: P.bone, opacity: 0.15, letterSpacing: 2, textAlign: "center" }}>REPLACE WITH PROJECT SCREENSHOTS & DELIVERABLE IMAGES</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseStudyDetail;
