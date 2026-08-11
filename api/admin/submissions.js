import { supabaseAdmin } from "../_lib/supabase.js";
import { requireAdmin } from "../_lib/auth.js";
import {
  COMMISSION_REFERENCE_BUCKET,
  getCommissionUploadReferences,
} from "../_lib/commission-references.js";

// ─── Admin leads inbox ───
// GET   → list submissions (optional ?kind= and ?status= filters)
// PATCH → update a submission's status ({ id, status })
// DELETE → remove a submission (?id=)

const STATUSES = new Set(["new", "read", "archived"]);

async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const sb = supabaseAdmin();

  if (req.method === "GET") {
    if (req.query.references === "1") {
      const id = Number(req.query.id);
      if (!id) return res.status(400).json({ error: "id is required" });
      const { data: submission, error: submissionError } = await sb
        .from("submissions")
        .select("id, meta")
        .eq("id", id)
        .maybeSingle();
      if (submissionError) return res.status(500).json({ error: submissionError.message });
      if (!submission) return res.status(404).json({ error: "Submission not found" });

      const uploadReferences = getCommissionUploadReferences(submission.meta);
      if (uploadReferences.length === 0) return res.status(200).json({ references: [] });
      const paths = uploadReferences.map((reference) => reference.storagePath);
      const { data: signed, error: signedError } = await sb.storage
        .from(COMMISSION_REFERENCE_BUCKET)
        .createSignedUrls(paths, 600);
      if (signedError) return res.status(500).json({ error: signedError.message });
      const signedByPath = new Map((signed || []).map((item) => [item.path, item.signedUrl]));
      return res.status(200).json({
        references: uploadReferences.map((reference) => ({
          storagePath: reference.storagePath,
          previewUrl: signedByPath.get(reference.storagePath) || null,
        })),
      });
    }

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

    const { data: submission, error: submissionError } = await sb
      .from("submissions")
      .select("id, meta")
      .eq("id", id)
      .maybeSingle();
    if (submissionError) return res.status(500).json({ error: submissionError.message });
    if (!submission) return res.status(404).json({ error: "Submission not found" });

    const uploadPaths = getCommissionUploadReferences(submission.meta).map((reference) => reference.storagePath);
    if (uploadPaths.length > 0) {
      const { error: storageError } = await sb.storage.from(COMMISSION_REFERENCE_BUCKET).remove(uploadPaths);
      if (storageError) return res.status(500).json({ error: `Reference cleanup failed: ${storageError.message}` });
    }

    const { error } = await sb.from("submissions").delete().eq("id", id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}

export default requireAdmin(handler);
