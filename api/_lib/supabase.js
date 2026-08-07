import { createClient } from "@supabase/supabase-js";
import { resolveSupabaseUrl } from "../../config/supabase.js";

let client = null;

function getServerConfig() {
  return {
    url: resolveSupabaseUrl(
      process.env.SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      ""
    ),
    secretKey: String(
      process.env.SUPABASE_SECRET_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      ""
    ).trim(),
  };
}

export function isSupabaseServerConfigured() {
  const { url, secretKey } = getServerConfig();
  return Boolean(url && secretKey);
}

// Server-only client. The secret/service-role key bypasses RLS and must never
// be imported by browser code or returned from an API response.
export function supabaseAdmin() {
  if (client) return client;

  const { url, secretKey } = getServerConfig();
  if (!url || !secretKey) {
    throw new Error("Supabase server credentials are not configured");
  }

  client = createClient(url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}

export function nowIso() {
  return new Date().toISOString();
}
