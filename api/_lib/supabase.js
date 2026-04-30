import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client. Uses the SERVICE ROLE KEY so it bypasses RLS.
// Never import this file from any code that ships to the browser.
let _client = null;

export function supabaseAdmin() {
  if (_client) return _client;
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Supabase env vars missing (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)");
  }
  _client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _client;
}

// Convenience helper — bumps updated_at to now() on a row.
export function nowIso() {
  return new Date().toISOString();
}
