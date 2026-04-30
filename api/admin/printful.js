import { supabaseAdmin } from "../_lib/supabase.js";
import { requireAdmin } from "../_lib/auth.js";
import { listSyncProducts, getSyncProduct, syncProductToRow } from "../_lib/printful.js";

// POST /api/admin/printful  (action=sync-catalog)
//   Pulls all sync products from Printful, upserts them into our products table.
//   Existing rows (matched by printful_product_id) are updated; new ones inserted.
//   Will not delete products that have been removed from Printful \u2014 owner can hide them via admin.

async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const list = await listSyncProducts();
    if (!Array.isArray(list)) return res.status(500).json({ error: "Unexpected Printful response" });

    const sb = supabaseAdmin();
    let inserted = 0;
    let updated = 0;
    const errors = [];

    for (const summary of list) {
      try {
        const detail = await getSyncProduct(summary.id);
        const row = syncProductToRow({ ...summary, variants: detail?.sync_variants || [] });

        // Check if we already have this Printful product.
        const { data: existing } = await sb
          .from("products")
          .select("id")
          .eq("printful_product_id", row.printful_product_id)
          .maybeSingle();

        if (existing) {
          await sb.from("products").update({ ...row, updated_at: new Date().toISOString() }).eq("id", existing.id);
          updated++;
        } else {
          // Avoid slug collisions with manually-seeded products
          const { data: bySlug } = await sb.from("products").select("id").eq("slug", row.slug).maybeSingle();
          if (bySlug) row.slug = `${row.slug}-pf-${row.printful_product_id}`;
          await sb.from("products").insert(row);
          inserted++;
        }
      } catch (e) {
        errors.push({ printful_id: summary.id, error: e.message });
      }
    }

    return res.status(200).json({ ok: true, inserted, updated, errors, total: list.length });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export default requireAdmin(handler);
