import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase, supabaseConfigError } from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(supabaseConfigError);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return undefined;
    }

    let active = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;
      setSession(nextSession);
      setLoading(false);
      setError(null);
    });

    supabase.auth.getSession()
      .then(({ data, error: sessionError }) => {
        if (!active) return;
        if (sessionError) setError(sessionError.message);
        setSession(data.session || null);
        setLoading(false);
      })
      .catch((sessionError) => {
        if (!active) return;
        setError(sessionError.message || "Could not restore the Supabase session.");
        setLoading(false);
      });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(() => ({
    session,
    user: session?.user || null,
    loading,
    error,
    async signIn(email, password) {
      if (!supabase) throw new Error(supabaseConfigError || "Supabase Auth is unavailable.");
      return supabase.auth.signInWithPassword({ email: email.trim(), password });
    },
    async signOut() {
      if (!supabase) return;
      const { error: signOutError } = await supabase.auth.signOut({ scope: "local" });
      if (signOutError) throw signOutError;
    },
  }), [session, loading, error]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
