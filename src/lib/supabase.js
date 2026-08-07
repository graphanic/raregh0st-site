import { createClient } from "@supabase/supabase-js";

const supabaseUrl = String(import.meta.env.VITE_SUPABASE_URL || "").trim();
const supabasePublishableKey = String(
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    ""
).trim();

export const supabaseConfigError = !supabaseUrl
  ? "VITE_SUPABASE_URL is not configured."
  : !supabasePublishableKey
    ? "VITE_SUPABASE_PUBLISHABLE_KEY is not configured."
    : null;

// The publishable key is intentionally browser-safe. Authorization still happens
// on the server, where each access token is verified before an admin API runs.
export const supabase = supabaseConfigError
  ? null
  : createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
