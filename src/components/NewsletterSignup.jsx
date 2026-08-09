import { useState } from "react";
import { P } from "../data/palette";
import { submitForm } from "../lib/api";

export function NewsletterSignup({
  source,
  accent = P.cyan,
  meta = {},
  buttonLabel = "Join",
  placeholder = "your@email.com",
  compact = false,
  className = "",
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (status === "sending" || !email.trim()) return;
    setStatus("sending");
    setError("");
    try {
      await submitForm({
        kind: "newsletter",
        email: email.trim(),
        source,
        meta,
      });
      setStatus("success");
    } catch (err) {
      setError(err.message || "Could not subscribe. Please try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return <div role="status" className={className} style={{ fontFamily: "'Courier New', monospace", fontSize: 12, color: P.green, letterSpacing: 2, lineHeight: 1.5 }}>✓ You’re on the signal.</div>;
  }

  return (
    <div className={className}>
      <form className="newsletter-signup" onSubmit={handleSubmit} style={{ display: "flex", gap: 8, flexWrap: compact ? "nowrap" : "wrap" }}>
        <label style={{ flex: 1, minWidth: compact ? 0 : 210 }}>
          <span className="sr-only">Email address</span>
          <input
            className="ui-input"
            type="email"
            required
            autoComplete="email"
            placeholder={placeholder}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={status === "sending"}
            style={{ width: "100%", minHeight: 46, padding: "11px 14px", background: P.abyss, border: `1px solid ${P.steel}46`, color: P.ghost, fontFamily: "'Courier New', monospace", fontSize: 14, outline: "none", borderRadius: 2 }}
          />
        </label>
        <button
          className="ui-action"
          type="submit"
          disabled={status === "sending"}
          style={{ minHeight: 46, minWidth: 96, background: `${accent}12`, border: `1px solid ${accent}66`, color: accent, fontFamily: "'Courier New', monospace", fontSize: 11, letterSpacing: 2, padding: "11px 16px", cursor: status === "sending" ? "wait" : "pointer", textTransform: "uppercase", opacity: status === "sending" ? 0.6 : 1 }}
        >
          {status === "sending" ? "Joining…" : buttonLabel}
        </button>
      </form>
      {error && <div role="alert" style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: P.red, marginTop: 8, lineHeight: 1.5 }}>{error}</div>}
    </div>
  );
}
