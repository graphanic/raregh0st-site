import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SEO } from "../components/SEO";
import { useAuth } from "../components/AuthContext";
import { verifyAdminAccess } from "../lib/admin";
import { P } from "../data/palette";

export default function AdminLogin() {
  const { session, loading: authLoading, error: authError, signIn, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const destination = location.state?.from || "/admin/store";

  useEffect(() => {
    if (!authLoading && session) navigate(destination, { replace: true });
  }, [authLoading, session, destination, navigate]);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const { data, error: signInError } = await signIn(email, password);
      if (signInError) throw signInError;
      if (!data.session?.access_token) throw new Error("Supabase did not return a session.");

      try {
        await verifyAdminAccess(data.session.access_token);
      } catch (accessError) {
        await signOut().catch(() => {});
        throw accessError;
      }

      navigate(destination, { replace: true });
    } catch (submitError) {
      setError(submitError.message || "Sign in failed.");
      setBusy(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", padding: "110px 24px 80px", background: P.abyss, color: P.ghost }}>
      <SEO title="Admin Sign In" description="Restricted 1RareGh0st admin access" path="/admin/login" />
      <div style={{ width: "100%", maxWidth: 430, margin: "0 auto" }}>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 6, color: P.cyan, textTransform: "uppercase", marginBottom: 12 }}>
          Secure admin
        </div>
        <h1 style={{ fontFamily: "'Georgia', serif", fontSize: 32, fontWeight: 400, margin: 0 }}>Welcome back</h1>
        <div style={{ width: 40, height: 1, background: `linear-gradient(to right, ${P.cyan}, transparent)`, margin: "16px 0 32px" }} />

        {authError && <Notice color={P.red}>{authError}</Notice>}
        {error && <Notice color={P.red}>{error}</Notice>}

        <form onSubmit={submit}>
          <label htmlFor="admin-email" style={labelStyle}>Email</label>
          <input
            id="admin-email"
            type="email"
            autoComplete="username"
            autoFocus
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            style={inputStyle}
          />

          <label htmlFor="admin-password" style={{ ...labelStyle, marginTop: 18 }}>Password</label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            style={inputStyle}
          />

          <button
            type="submit"
            disabled={busy || authLoading || Boolean(authError)}
            style={{ ...buttonStyle, opacity: busy || authLoading || authError ? 0.5 : 1 }}
          >
            {busy ? "Verifying…" : "Sign in with Supabase"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Notice({ color, children }) {
  return (
    <div style={{ border: `1px solid ${color}40`, background: `${color}10`, color, padding: 12, marginBottom: 18, fontFamily: "'Courier New', monospace", fontSize: 11, lineHeight: 1.6 }}>
      {children}
    </div>
  );
}

const labelStyle = {
  display: "block",
  color: P.bone,
  opacity: 0.6,
  fontFamily: "'Courier New', monospace",
  fontSize: 9,
  letterSpacing: 3,
  textTransform: "uppercase",
  marginBottom: 7,
};

const inputStyle = {
  width: "100%",
  background: P.void,
  color: P.ghost,
  border: `1px solid ${P.steel}35`,
  padding: "12px 14px",
  borderRadius: 2,
  fontFamily: "'Courier New', monospace",
  fontSize: 13,
  outline: "none",
};

const buttonStyle = {
  width: "100%",
  marginTop: 22,
  background: `${P.cyan}15`,
  border: `1px solid ${P.cyan}45`,
  color: P.ghost,
  padding: 13,
  fontFamily: "'Courier New', monospace",
  fontSize: 10,
  letterSpacing: 3,
  textTransform: "uppercase",
  cursor: "pointer",
};
