import { put } from "@vercel/blob";
import { supabaseAdmin } from "../_lib/supabase.js";
import { requireAdmin } from "../_lib/auth.js";

// POST /api/admin/digital-upload
// Multipart-style upload via raw body; uses @vercel/blob to store the file privately.
// Body: raw file bytes
// Headers: x-filename, x-product-id  — the file is associated with that product as digital_blob_url.

export const config = { api: { bodyParser: false } };

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", c => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const filename = String(req.headers["x-filename"] || "").trim();
    const productId = Number(req.headers["x-product-id"]);
    if (!filename) return res.status(400).json({ error: "Missing X-Filename header" });
    if (!productId) return res.status(400).json({ error: "Missing X-Product-Id header" });

    const body = await readRawBody(req);
    if (!body || body.length === 0) return res.status(400).json({ error: "Empty body" });

    const safe = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const blob = await put(`digital/${productId}/${Date.now()}-${safe}`, body, {
      access: "public",
      contentType: req.headers["content-type"] || "application/octet-stream",
    });

    const sb = supabaseAdmin();
    const { data, error } = await sb
      .from("products")
      .update({ digital_blob_url: blob.url, is_digital: true, updated_at: new Date().toISOString() })
      .eq("id", productId)
      .select()
      .maybeSingle();
    if (error) throw error;

    return res.status(200).json({ url: blob.url, product: data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export default requireAdmin(handler);
