import { supabaseAdmin } from "./_lib/supabase.js";
import {
  COMMISSION_REFERENCE_BUCKET,
  verifyCommissionReferenceCleanup,
} from "./_lib/commission-references.js";
import { MAX_UPLOAD_REFERENCES } from "../src/lib/commissionReferences.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  let body;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
  } catch {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  const uploads = Array.isArray(body.uploads) ? body.uploads : [];
  if (uploads.length === 0) return res.status(200).json({ ok: true, removed: 0 });
  if (uploads.length > MAX_UPLOAD_REFERENCES) {
    return res.status(400).json({ error: `Choose no more than ${MAX_UPLOAD_REFERENCES} reference photos.` });
  }
  if (!uploads.every((upload) => verifyCommissionReferenceCleanup(upload?.path, upload?.cleanupToken))) {
    return res.status(403).json({ error: "Invalid cleanup authorization" });
  }

  try {
    const paths = [...new Set(uploads.map((upload) => upload.path))];
    const { error } = await supabaseAdmin().storage.from(COMMISSION_REFERENCE_BUCKET).remove(paths);
    if (error) throw error;
    return res.status(200).json({ ok: true, removed: paths.length });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Could not clean up reference photos." });
  }
}
