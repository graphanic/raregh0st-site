import { useState } from "react";
import { P } from "../data/palette";
import { ScrollMorphText } from "../components/MorphText";
import { SEO } from "../components/SEO";
import { submitForm } from "../lib/api";
import { SOCIALS } from "../data/socials";

// Build the "Connect" list from the single source of truth in socials.js,
// plus a direct email row.
const CONNECT_IDS = ["instagram", "x", "youtube", "tiktok"];
const CONNECT = [
  ...CONNECT_IDS
    .map(id => SOCIALS.find(s => s.id === id))
    .filter(Boolean)
    .map(s => ({ platform: s.label, handle: s.handle.startsWith("@") ? s.handle : `@${s.handle}`, url: s.profileUrl })),
  { platform: "Email", handle: "hello@raregh0st.com", url: "mailto:hello@raregh0st.com" },
];

export const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", type: "general", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [newsletter, setNewsletter] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subError, setSubError] = useState("");

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message || sending) return;
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
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleSubscribe = async () => {
    if (!newsletter || !newsletter.includes("@")) return;
    setSubError("");
    try {
      await submitForm({ kind: "newsletter", email: newsletter, source: "contact-page" });
      setSubscribed(true);
    } catch (err) {
      setSubError(err.message || "Could not subscribe. Please try again.");
    }
  };

  const inputStyle = {
    width: "100%", padding: "12px 16px", background: P.void, border: `1px solid ${P.steel}22`,
    color: P.ghost, fontFamily: "'Courier New', monospace", fontSize: 12, outline: "none",
    transition: "border-color 0.3s",
  };

  return (
    <div style={{ minHeight: "100vh", paddingTop: 120, paddingBottom: 80 }}>
      <SEO title="Contact" description="Commissions, collaborations, and creative partnerships with 1RareGh0st." path="/contact" />
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 40px" }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 6, color: P.gold, textTransform: "uppercase", marginBottom: 12 }}><ScrollMorphText speed={75}>Contact</ScrollMorphText></div>
          <h2 style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 400, color: P.ghost, margin: 0 }}><ScrollMorphText speed={80}>Get In Touch</ScrollMorphText></h2>
          <div style={{ width: 40, height: 1, background: `linear-gradient(to right, ${P.gold}, transparent)`, marginTop: 16, marginBottom: 8 }} />
          <div style={{ fontFamily: "'Georgia', serif", fontSize: 13, color: P.bone, opacity: 0.4, lineHeight: 1.6 }}>Commissions, collaborations, and creative partnerships.</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "start" }}>
          <div>
            {submitted ? (
              <div style={{ padding: 40, border: `1px solid ${P.green}22`, textAlign: "center" }}>
                <div style={{ fontSize: 28, marginBottom: 16 }}>{"✓"}</div>
                <div style={{ fontFamily: "'Georgia', serif", fontSize: 18, color: P.ghost, marginBottom: 8 }}>Message Sent</div>
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: P.bone, opacity: 0.5 }}>I'll get back to you as soon as possible.</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 4, color: P.bone, opacity: 0.4, textTransform: "uppercase", display: "block", marginBottom: 6, animation: "morphBreathSoft 1s ease-in-out infinite" }}>Name</label>
                  <input style={inputStyle} value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
                    onFocus={(e) => e.target.style.borderColor = P.gold + "44"}
                    onBlur={(e) => e.target.style.borderColor = P.steel + "22"} />
                </div>
                <div>
                  <label style={{ fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 4, color: P.bone, opacity: 0.4, textTransform: "uppercase", display: "block", marginBottom: 6, animation: "morphBreathSoft 1s ease-in-out infinite 0.5s" }}>Email</label>
                  <input type="email" style={inputStyle} value={form.email} onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                    onFocus={(e) => e.target.style.borderColor = P.gold + "44"}
                    onBlur={(e) => e.target.style.borderColor = P.steel + "22"} />
                </div>
                <div>
                  <label style={{ fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 4, color: P.bone, opacity: 0.4, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Type</label>
                  <select style={{ ...inputStyle, cursor: "pointer", appearance: "none" }} value={form.type} onChange={(e) => setForm(p => ({ ...p, type: e.target.value }))}>
                    <option value="general" style={{ background: P.void }}>General Inquiry</option>
                    <option value="commission" style={{ background: P.void }}>Commission</option>
                    <option value="collaboration" style={{ background: P.void }}>Collaboration</option>
                    <option value="licensing" style={{ background: P.void }}>Licensing / Print Rights</option>
                    <option value="press" style={{ background: P.void }}>Press / Media</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 4, color: P.bone, opacity: 0.4, textTransform: "uppercase", display: "block", marginBottom: 6, animation: "morphBreathSoft 1s ease-in-out infinite 1.5s" }}>Message</label>
                  <textarea style={{ ...inputStyle, minHeight: 120, resize: "vertical" }} value={form.message} onChange={(e) => setForm(p => ({ ...p, message: e.target.value }))}
                    onFocus={(e) => e.target.style.borderColor = P.gold + "44"}
                    onBlur={(e) => e.target.style.borderColor = P.steel + "22"} />
                </div>
                <button onClick={handleSubmit} disabled={sending} style={{
                  background: "none", border: `1px solid ${P.gold}33`, color: P.gold,
                  fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 5,
                  padding: "14px 28px", cursor: sending ? "wait" : "pointer", textTransform: "uppercase",
                  transition: "all 0.3s", marginTop: 4, opacity: sending ? 0.5 : 1,
                }}
                  onMouseEnter={(e) => { if (sending) return; e.target.style.borderColor = P.gold; e.target.style.boxShadow = `0 0 20px ${P.gold}15`; }}
                  onMouseLeave={(e) => { e.target.style.borderColor = P.gold + "33"; e.target.style.boxShadow = "none"; }}
                >{sending ? "Sending\u2026" : "Send Message"}</button>
                {error && (
                  <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: P.red, letterSpacing: 1, marginTop: 4 }}>{error}</div>
                )}
              </div>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            <div style={{ padding: 28, border: `1px solid ${P.steel}11`, background: P.void + "88" }}>
              <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 6, color: P.cyan, textTransform: "uppercase", marginBottom: 12 }}>Join the Signal</div>
              <div style={{ fontFamily: "'Georgia', serif", fontSize: 16, color: P.ghost, marginBottom: 8 }}>Newsletter</div>
              <div style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: P.bone, opacity: 0.4, lineHeight: 1.6, marginBottom: 20 }}>
                New artwork drops, shop releases, behind-the-scenes process, and transmissions from the void. No spam. Unsubscribe anytime.
              </div>
              {subscribed ? (
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: P.green, letterSpacing: 2 }}>{"✓"} You're in. Welcome to the signal.</div>
              ) : (
                <div style={{ display: "flex", gap: 8 }}>
                  <input type="email" placeholder="your@email.com" value={newsletter} onChange={(e) => setNewsletter(e.target.value)}
                    style={{ ...inputStyle, flex: 1 }}
                    onFocus={(e) => e.target.style.borderColor = P.cyan + "44"}
                    onBlur={(e) => e.target.style.borderColor = P.steel + "22"} />
                  <button onClick={handleSubscribe} style={{
                    background: "none", border: `1px solid ${P.cyan}33`, color: P.cyan,
                    fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 3,
                    padding: "12px 18px", cursor: "pointer", textTransform: "uppercase",
                    transition: "all 0.3s", whiteSpace: "nowrap",
                  }}
                    onMouseEnter={(e) => { e.target.style.borderColor = P.cyan; }}
                    onMouseLeave={(e) => { e.target.style.borderColor = P.cyan + "33"; }}
                  >Subscribe</button>
                </div>
              )}
              {subError && (
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: P.red, letterSpacing: 1, marginTop: 10 }}>{subError}</div>
              )}
            </div>
            <div>
              <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 4, color: P.bone, opacity: 0.3, textTransform: "uppercase", marginBottom: 16 }}>Connect</div>
              {CONNECT.map(({ platform, handle, url }) => (
                <a key={platform} href={url} target="_blank" rel="noopener noreferrer" style={{
                  display: "flex", justifyContent: "space-between", padding: "10px 0",
                  borderBottom: `1px solid ${P.steel}0a`, textDecoration: "none", transition: "all 0.3s",
                }}
                  onMouseEnter={(e) => e.currentTarget.style.paddingLeft = "6px"}
                  onMouseLeave={(e) => e.currentTarget.style.paddingLeft = "0"}
                >
                  <span style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: P.bone, opacity: 0.5, letterSpacing: 2 }}>{platform}</span>
                  <span style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: P.ghost, opacity: 0.7 }}>{handle}</span>
                </a>
              ))}
            </div>
            <div style={{ padding: 20, borderLeft: `2px solid ${P.magenta}22` }}>
              <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 4, color: P.magenta, opacity: 0.6, textTransform: "uppercase", marginBottom: 8 }}>Commissions</div>
              <div style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: P.bone, opacity: 0.4, lineHeight: 1.7 }}>
                Currently accepting select commissions for custom artwork, brand collaborations, and creative direction. Response time is typically 2-3 business days.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
