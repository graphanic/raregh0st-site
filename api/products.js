import { supabaseAdmin } from "./_lib/supabase.js";
import { verifyAdminToken } from "./_lib/auth.js";

// GET /api/products
//   ?category=apparel       — filter by category
//   ?slug=resistance-tee    — fetch single product by slug
// If shop_live is false in settings, only admins receive products.

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const sb = supabaseAdmin();

    // Check shop_live status. If shop is offline and caller isn't admin, return empty list.
    const { data: settings } = await sb.from("store_settings").select("shop_live").eq("id", "singleton").maybeSingle();
    const shopLive = settings?.shop_live === true;
    const adminOk = verifyAdminToken(req).ok;

    if (!shopLive && !adminOk) {
      return res.status(200).json({ products: [], shop_live: false });
    }

    let q = sb.from("products").select("*").eq("is_active", true).order("display_order", { ascending: true });
    if (req.query.category) q = q.eq("category", String(req.query.category));
    if (req.query.slug) q = q.eq("slug", String(req.query.slug)).limit(1);

    const { data, error } = await q;
    if (error) throw error;

    return res.status(200).json({ products: data || [], shop_live: shopLive });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
