import { supabaseAdmin } from "../_lib/supabase.js";
import { requireAdmin } from "../_lib/auth.js";

const EDITABLE = [
  "slug", "title", "category", "subcategory", "description", "price_cad",
  "artwork", "tags", "colors", "sizes", "duration", "image_url",
  "is_digital", "digital_blob_url", "is_active", "display_order",
];

async function handler(req, res) {
  const sb = supabaseAdmin();

  if (req.method === "GET") {
    let q = sb.from("products").select("*").order("display_order", { ascending: true });
    if (req.query.category) q = q.eq("category", String(req.query.category));
    const { data, error } = await q;
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ products: data || [] });
  }

  if (req.method === "POST") {
    try {
      const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
      const row = pickEditable(body);
      if (!row.slug || !row.title || row.price_cad == null) {
        return res.status(400).json({ error: "slug, title, price_cad are required" });
      }
      const { data, error } = await sb.from("products").insert(row).select().maybeSingle();
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ product: data });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === "PATCH") {
    try {
      const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
      const id = Number(body.id);
      if (!id) return res.status(400).json({ error: "id is required" });
      const row = pickEditable(body);
      row.updated_at = new Date().toISOString();
      const { data, error } = await sb.from("products").update(row).eq("id", id).select().maybeSingle();
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ product: data });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === "DELETE") {
    const id = Number(req.query.id);
    if (!id) return res.status(400).json({ error: "id is required" });
    const { error } = await sb.from("products").delete().eq("id", id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}

function pickEditable(body) {
  const row = {};
  for (const k of EDITABLE) {
    if (k in body) row[k] = body[k];
  }
  return row;
}

export default requireAdmin(handler);
