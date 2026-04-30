import { supabaseAdmin } from "./_lib/supabase.js";

// GET /api/settings — returns the public-safe subset of settings.
// (Admin settings are fetched/updated via /api/admin/settings.)

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const sb = supabaseAdmin();
    const { data, error } = await sb
      .from("store_settings")
      .select("shop_live, shop_announcement")
      .eq("id", "singleton")
      .maybeSingle();

    if (error) throw error;

    return res.status(200).json({
      shop_live: data?.shop_live ?? false,
      shop_announcement: data?.shop_announcement ?? "",
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
