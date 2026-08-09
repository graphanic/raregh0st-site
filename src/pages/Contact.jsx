import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { P } from "../data/palette";
import { HoverMorphText, ScrollMorphText } from "../components/MorphText";
import { SEO } from "../components/SEO";
import { submitForm } from "../lib/api";
import { NewsletterSignup } from "../components/NewsletterSignup";
import { buildCommissionMeta, resolveCommissionPiece } from "../lib/commissionContext";
import { getWorkHref } from "../data/catalog";
import { SOCIALS } from "../data/socials";
import { COMMISSION_COPY, NEWSLETTER_COPY, SEO_COPY } from "../data/siteCopy";

const CONNECT_IDS = ["instagram", "x", "youtube", "tiktok"];
const CONNECT = [
  ...CONNECT_IDS
    .map((id) => SOCIALS.find((social) => social.id === id))
    .filter(Boolean)
    .map((social) => ({
      platform: social.label,
      handle: social.handle.startsWith("@") ? social.handle : `@${social.handle}`,
      url: social.profileUrl,
    })),
  { platform: "Email", handle: "hello@raregh0st.com", url: "mailto:hello@raregh0st.com" },
];

const INQUIRY_TYPES = [
  ["general", "General Inquiry"],
  ["commission", "Personal Commission"],
  ["collaboration", "Creative Collaboration"],
  ["licensing", "Licensing / Print Rights"],
  ["press", "Press / Media"],
];

const emptyForm = (type = "general") => ({
  name: "",
  email: "",
  type,
  message: "",
  intendedUse: "",
  budget: "",
  timeline: "",
});

export const Contact = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const requestedType = searchParams.get("type");
  const requestedPieceId = searchParams.get("piece");
  const safeType = INQUIRY_TYPES.some(([value]) => value === requestedType) ? requestedType : "general";
  const requestedPiece = safeType === "commission" ? resolveCommissionPiece(requestedPieceId) : null;
  const [form, setForm] = useState(() => emptyForm(safeType));
  const [pieceContext, setPieceContext] = useState(requestedPiece);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef(null);

  useEffect(() => {
    if (!requestedType || !INQUIRY_TYPES.some(([value]) => value === requestedType)) return;
    setForm((current) => ({ ...current, type: requestedType }));
  }, [requestedType]);

  useEffect(() => {
    setPieceContext(safeType === "commission" ? resolveCommissionPiece(requestedPieceId) : null);
  }, [requestedPieceId, safeType]);

  useEffect(() => {
    if (location.hash !== "#signal") return;
    const frame = window.requestAnimationFrame(() => document.getElementById("signal")?.scrollIntoView({ behavior: "smooth", block: "center" }));
    return () => window.cancelAnimationFrame(frame);
  }, [location.hash]);

  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const isCommission = form.type === "commission";

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim() || sending) return;
    setSending(true);
    setError("");
    try {
      await submitForm({
        kind: "contact",
        name: form.name,
        email: form.email,
        category: form.type,
        message: form.message,
        source: "contact-page",
        meta: isCommission ? buildCommissionMeta(form, pieceContext) : {},
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", paddingTop: 120, paddingBottom: 90 }}>
      <SEO title="Commission & Contact" description={SEO_COPY.contact} path="/contact" />
      <div className="page-shell" style={{ maxWidth: 1120, margin: "0 auto", padding: "0 40px" }}>
        <header style={{ maxWidth: 820, marginBottom: 58 }}>
          <div style={kickerStyle}><ScrollMorphText speed={75}>{COMMISSION_COPY.kicker}</ScrollMorphText></div>
          <h1 style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(34px, 6vw, 64px)", lineHeight: 1.05, fontWeight: 400, color: P.ghost, margin: "0 0 22px" }}>
            <ScrollMorphText speed={80}>{COMMISSION_COPY.headline}</ScrollMorphText>
          </h1>
          <p style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(15px, 2vw, 19px)", color: P.bone, opacity: 0.68, lineHeight: 1.75, margin: 0, maxWidth: 740 }}>{COMMISSION_COPY.intro}</p>
          <p style={{ ...mono, fontSize: 9, color: P.gold, letterSpacing: 2, lineHeight: 1.7, margin: "18px 0 0", textTransform: "uppercase" }}>{COMMISSION_COPY.response}</p>
        </header>

        <section aria-labelledby="commission-process-title" style={{ marginBottom: 72 }}>
          <div id="commission-process-title" style={{ ...mono, fontSize: 11, letterSpacing: 5, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 16 }}>How the collaboration unfolds</div>
          <div className="commission-process-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {COMMISSION_COPY.stages.map((stage) => (
              <article key={stage.number} style={{ padding: "22px 18px", borderTop: `1px solid ${P.gold}40`, background: `${P.surface}44` }}>
                <div style={{ ...mono, fontSize: 8, letterSpacing: 3, color: P.gold, marginBottom: 12 }}>{stage.number}</div>
                <h2 style={{ fontFamily: "'Georgia', serif", fontSize: 16, fontWeight: 400, color: P.ghost, margin: "0 0 10px" }}>{stage.title}</h2>
                <p style={{ fontFamily: "'Georgia', serif", fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65, margin: 0 }}>{stage.body}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.2fr) minmax(300px, 0.8fr)", gap: 50, alignItems: "start" }}>
          <section ref={formRef} id="commission-inquiry" style={{ padding: "32px", border: `1px solid ${isCommission ? P.gold + "35" : P.steel + "20"}`, background: `linear-gradient(145deg, ${P.void}, ${P.surface}88)` }}>
            <div style={{ ...mono, fontSize: 9, letterSpacing: 5, color: isCommission ? P.gold : P.cyan, textTransform: "uppercase", marginBottom: 10 }}>{isCommission ? "Commission Request" : "Direct to the Studio"}</div>
            <h2 style={{ fontFamily: "'Georgia', serif", fontSize: 25, fontWeight: 400, color: P.ghost, margin: "0 0 24px" }}>{isCommission ? "Tell me what you want made visible." : "What would you like to begin?"}</h2>

            {submitted ? (
              <div role="status" style={{ padding: "38px 20px", border: `1px solid ${P.green}30`, textAlign: "center" }}>
                <div style={{ fontSize: 28, color: P.green, marginBottom: 14 }}>✓</div>
                <div style={{ fontFamily: "'Georgia', serif", fontSize: 20, color: P.ghost, marginBottom: 10 }}>Signal received.</div>
                <div style={{ ...mono, fontSize: 12, color: "var(--text-muted)", lineHeight: 1.7 }}>Your message is in the studio. Eric will reach back within 2–3 business days.</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
                {isCommission && pieceContext && (
                  <div className="commission-piece-context" style={{ display: "grid", gridTemplateColumns: "86px minmax(0, 1fr) 44px", gap: 14, alignItems: "center", padding: 12, border: `1px solid ${P.gold}45`, background: `${P.gold}09` }}>
                    {pieceContext.img && <img src={pieceContext.img} alt="" style={{ width: 86, height: 72, objectFit: "cover", display: "block" }} />}
                    <div style={{ minWidth: 0 }}>
                      <div style={{ ...mono, fontSize: 11, letterSpacing: 2, color: P.gold, textTransform: "uppercase", marginBottom: 5 }}>Inspired by…</div>
                      <Link to={getWorkHref(pieceContext)} style={{ fontFamily: "'Georgia', serif", fontSize: 15, lineHeight: 1.35, color: P.ghost, textDecoration: "none" }}>{pieceContext.title} ↗</Link>
                    </div>
                    <button type="button" onClick={() => setPieceContext(null)} aria-label="Remove inspired-by artwork" style={{ width: 44, height: 44, background: "none", border: `1px solid ${P.steel}35`, color: P.bone, cursor: "pointer", fontSize: 18 }}>×</button>
                  </div>
                )}
                <Field label="Name" required value={form.name} onChange={(value) => setField("name", value)} />
                <Field label="Email" type="email" required value={form.email} onChange={(value) => setField("email", value)} />
                <Field label="Inquiry Type" select value={form.type} onChange={(value) => setField("type", value)} options={INQUIRY_TYPES} />
                <Field label={isCommission ? "Your story or vision" : "Message"} textarea required value={form.message} onChange={(value) => setField("message", value)} placeholder={isCommission ? "Share the memory, relationship, event, symbols, or transformation you want the work to hold." : "Tell me what you are thinking about."} />
                {isCommission && (
                  <div className="contact-field-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <Field label="Intended use" value={form.intendedUse} onChange={(value) => setField("intendedUse", value)} placeholder="Personal, gift, memorial…" />
                    <Field label="Target date" value={form.timeline} onChange={(value) => setField("timeline", value)} placeholder="If there is one" />
                    <div style={{ gridColumn: "1 / -1" }}>
                      <Field label={COMMISSION_COPY.budgetLabel} value={form.budget} onChange={(value) => setField("budget", value)} placeholder="A range is helpful, but optional" help={COMMISSION_COPY.budgetHelp} />
                    </div>
                  </div>
                )}
                <button type="submit" disabled={sending} style={{ ...mono, background: isCommission ? P.gold : P.cyan, border: `1px solid ${isCommission ? P.gold : P.cyan}`, color: P.abyss, fontSize: 10, letterSpacing: 4, padding: "15px 24px", cursor: sending ? "wait" : "pointer", textTransform: "uppercase", opacity: sending ? 0.55 : 1 }}>
                  {sending ? "Sending…" : <HoverMorphText>{isCommission ? "Send Commission Request" : "Send Inquiry"}</HoverMorphText>}
                </button>
                {error && <div role="alert" style={{ ...mono, fontSize: 10, color: P.red, lineHeight: 1.6 }}>{error}</div>}
              </form>
            )}
          </section>

          <aside style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            <div style={{ padding: 26, borderLeft: `2px solid ${P.gold}55`, background: `${P.gold}06` }}>
              <div style={{ ...mono, fontSize: 8, letterSpacing: 4, color: P.gold, textTransform: "uppercase", marginBottom: 12 }}>Base Commission</div>
              <p style={{ fontFamily: "'Georgia', serif", fontSize: 13, color: P.bone, opacity: 0.6, lineHeight: 1.75, margin: "0 0 14px" }}>A high-resolution personal-use digital master, developed through close collaboration and major-stage reviews.</p>
              <p style={{ ...mono, fontSize: 12, color: "var(--text-muted)", lineHeight: 1.7, margin: 0 }}>Physical prints, commercial use, licensing, and expanded deliverables are scoped and quoted separately. An inquiry is a conversation, not a booking.</p>
            </div>

            <div id="signal" style={{ padding: 26, border: `1px solid ${P.cyan}20`, background: `${P.void}88` }}>
              <div style={{ ...mono, fontSize: 8, letterSpacing: 5, color: P.cyan, textTransform: "uppercase", marginBottom: 10 }}>{NEWSLETTER_COPY.kicker}</div>
              <div style={{ fontFamily: "'Georgia', serif", fontSize: 17, color: P.ghost, marginBottom: 8 }}>{NEWSLETTER_COPY.headline}</div>
              <p style={{ ...mono, fontSize: 12, color: "var(--text-muted)", lineHeight: 1.65, margin: "0 0 18px" }}>{NEWSLETTER_COPY.body}</p>
              <NewsletterSignup source="contact-signal" accent={P.cyan} compact />
            </div>

            <div>
              <div style={{ ...mono, fontSize: 11, letterSpacing: 4, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 12 }}>Elsewhere</div>
              {CONNECT.map(({ platform, handle, url }) => (
                <a key={platform} href={url} {...(url.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${P.steel}12`, textDecoration: "none" }}>
                  <span style={{ ...mono, fontSize: 11, color: "var(--text-secondary)", letterSpacing: 2 }}>{platform}</span>
                  <span style={{ ...mono, fontSize: 10, color: P.ghost, opacity: 0.65 }}>{handle}</span>
                </a>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

function Field({ label, value, onChange, type = "text", textarea, select, options = [], required, placeholder, help }) {
  const id = `field-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <label htmlFor={id} style={{ display: "block" }}>
      <span style={{ ...mono, fontSize: 11, letterSpacing: 3, color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: 7 }}>{label}{required ? " *" : ""}</span>
      {select ? (
        <select id={id} value={value} onChange={(event) => onChange(event.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
          {options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue} style={{ background: P.void }}>{optionLabel}</option>)}
        </select>
      ) : textarea ? (
        <textarea id={id} required={required} rows={5} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} style={{ ...inputStyle, minHeight: 132, resize: "vertical" }} />
      ) : (
        <input id={id} type={type} required={required} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} style={inputStyle} />
      )}
      {help && <span style={{ ...mono, display: "block", fontSize: 11, color: "var(--text-muted)", marginTop: 6, lineHeight: 1.5 }}>{help}</span>}
    </label>
  );
}

const mono = { fontFamily: "'Courier New', monospace" };
const kickerStyle = { ...mono, fontSize: 9, letterSpacing: 6, color: P.gold, textTransform: "uppercase", marginBottom: 14 };
const inputStyle = { width: "100%", padding: "12px 14px", background: P.abyss, border: `1px solid ${P.steel}35`, color: P.ghost, fontFamily: "'Courier New', monospace", fontSize: 12, outline: "none", borderRadius: 2 };
