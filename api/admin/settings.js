import { supabaseAdmin } from "../_lib/supabase.js";
import { requireAdmin } from "../_lib/auth.js";

const ALLOWED = [
  "shop_live",
  "income_tax_pct",
  "savings_buffer_pct",
  "aish_monthly_threshold",
  "business_province",
  "printful_enabled",
  "shop_announcement",
];

async function handler(req, res) {
  const sb = supabaseAdmin();

  if (req.method === "GET") {
    const { data, error } = await sb.from("store_settings").select("*").eq("id", "singleton").maybeSingle();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ settings: data || {} });
  }

  if (req.method === "POST" || req.method === "PATCH") {
    try {
      const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
      const update = {};
      for (const k of ALLOWED) {
        if (k in body) update[k] = body[k];
      }
      if (Object.keys(update).length === 0) return res.status(400).json({ error: "No valid fields to update" });
      update.updated_at = new Date().toISOString();
      const { data, error } = await sb.from("store_settings").update(update).eq("id", "singleton").select().maybeSingle();
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ settings: data });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}

export default requireAdmin(handler);
