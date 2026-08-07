import { useEffect, useState } from "react";
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { verifyAdminAccess } from "../lib/admin";
import { P } from "../data/palette";

const shellStyle = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 24,
  background: P.abyss,
  color: P.ghost,
};

export function ProtectedRoute() {
  const { session, loading: authLoading, error: authError, signOut } = useAuth();
  const location = useLocation();
  const [access, setAccess] = useState({ status: "idle", error: null });

  useEffect(() => {
    if (!session?.access_token) {
      setAccess({ status: "idle", error: null });
      return undefined;
    }

    let active = true;
    setAccess({ status: "checking", error: null });
    verifyAdminAccess(session.access_token)
      .then(() => {
        if (active) setAccess({ status: "allowed", error: null });
      })
      .catch((error) => {
        if (active) setAccess({ status: "denied", error });
      });

    return () => { active = false; };
  }, [session?.access_token]);

  if (authLoading) return <RouteStatus>Restoring secure session…</RouteStatus>;

  if (authError && !session) {
    return (
      <RouteStatus title="Auth configuration needed">
        {authError}
      </RouteStatus>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  if (access.status === "idle" || access.status === "checking") {
    return <RouteStatus>Verifying admin access…</RouteStatus>;
  }

  if (access.status === "denied") {
    return (
      <RouteStatus title="Access denied">
        <p style={{ margin: "8px 0 20px", color: P.bone, lineHeight: 1.6 }}>
          {access.error?.message || "This Supabase account is not authorized for the admin area."}
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button type="button" onClick={() => void signOut()} style={buttonStyle}>Sign out</button>
          <Link to="/" style={{ ...buttonStyle, textDecoration: "none" }}>Return home</Link>
        </div>
      </RouteStatus>
    );
  }

  return <Outlet />;
}

function RouteStatus({ title, children }) {
  return (
    <div style={shellStyle}>
      <div style={{ maxWidth: 520, textAlign: "center", fontFamily: "'Courier New', monospace" }}>
        {title && <h1 style={{ color: P.cyan, fontSize: 24, fontWeight: 400 }}>{title}</h1>}
        <div style={{ color: P.bone, fontSize: 12, letterSpacing: title ? 0 : 2 }}>{children}</div>
      </div>
    </div>
  );
}

const buttonStyle = {
  background: `${P.cyan}12`,
  border: `1px solid ${P.cyan}40`,
  color: P.ghost,
  padding: "10px 18px",
  fontFamily: "'Courier New', monospace",
  fontSize: 10,
  letterSpacing: 2,
  textTransform: "uppercase",
  cursor: "pointer",
};
