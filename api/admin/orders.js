import { supabaseAdmin } from "../_lib/supabase.js";
import { requireAdmin } from "../_lib/auth.js";

// GET /api/admin/orders?from=YYYY-MM-DD&to=YYYY-MM-DD&status=paid&limit=200

async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const sb = supabaseAdmin();
    let q = sb.from("orders").select("*").order("created_at", { ascending: false }).limit(Math.min(500, Number(req.query.limit) || 200));
    if (req.query.from) q = q.gte("created_at", String(req.query.from));
    if (req.query.to) q = q.lte("created_at", String(req.query.to));
    if (req.query.status) q = q.eq("status", String(req.query.status));

    const { data, error } = await q;
    if (error) throw error;
    return res.status(200).json({ orders: data || [] });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export default requireAdmin(handler);
