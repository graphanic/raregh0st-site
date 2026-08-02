import { supabaseAdmin } from "../_lib/supabase.js";
import { requireAdmin } from "../_lib/auth.js";

// ─── Admin leads inbox ───
// GET   → list submissions (optional ?kind= and ?status= filters)
// PATCH → update a submission's status ({ id, status })
// DELETE → remove a submission (?id=)

const STATUSES = new Set(["new", "read", "archived"]);

async function handler(req, res) {
  const sb = supabaseAdmin();

  if (req.method === "GET") {
    let q = sb.from("submissions").select("*").order("created_at", { ascending: false });
    if (req.query.kind) q = q.eq("kind", String(req.query.kind));
    if (req.query.status) q = q.eq("status", String(req.query.status));
    const { data, error } = await q;
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ submissions: data || [] });
  }

  if (req.method === "PATCH") {
    try {
      const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
      const id = Number(body.id);
      if (!id) return res.status(400).json({ error: "id is required" });
      if (!STATUSES.has(body.status)) return res.status(400).json({ error: "invalid status" });
      const { data, error } = await sb
        .from("submissions")
        .update({ status: body.status })
        .eq("id", id)
        .select()
        .maybeSingle();
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ submission: data });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === "DELETE") {
    const id = Number(req.query.id);
    if (!id) return res.status(400).json({ error: "id is required" });
    const { error } = await sb.from("submissions").delete().eq("id", id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}

export default requireAdmin(handler);
