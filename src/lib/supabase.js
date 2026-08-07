import { createClient } from "@supabase/supabase-js";
import {
  PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  resolveSupabaseUrl,
} from "../../config/supabase";

const supabaseUrl = resolveSupabaseUrl(import.meta.env.VITE_SUPABASE_URL);
const supabasePublishableKey = PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const supabaseConfigError = null;

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
