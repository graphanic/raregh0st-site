// These values identify the public Supabase API used by raregh0st.studio.
// Supabase publishable keys are intentionally safe to include in browser code;
// privileged server access still requires the secret key stored in Vercel.
export const PUBLIC_SUPABASE_URL = "https://vlxmucmtvrzdnfpgwpgf.supabase.co";
export const PUBLIC_SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_KxwnkpTjX3FmtPBs23Fqzg__jFw_8go";

const PUBLIC_SUPABASE_HOST = new URL(PUBLIC_SUPABASE_URL).host;

export function resolveSupabaseUrl(value) {
  try {
    const candidate = new URL(String(value || "").trim());
    if (candidate.protocol === "https:" && candidate.host === PUBLIC_SUPABASE_HOST) {
      return candidate.origin;
    }
  } catch {
    // Fall through to the canonical project URL.
  }

  return PUBLIC_SUPABASE_URL;
}
