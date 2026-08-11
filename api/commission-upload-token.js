import { randomUUID } from "node:crypto";
import { supabaseAdmin } from "./_lib/supabase.js";
import {
  COMMISSION_REFERENCE_BUCKET,
  createCommissionReferencePath,
  signCommissionReferenceCleanup,
  validateUploadDeclarations,
} from "./_lib/commission-references.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  let body;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
  } catch {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  if (String(body.company || "").trim()) return res.status(200).json({ uploads: [] });

  try {
    const files = validateUploadDeclarations(body.files);
    const requestId = randomUUID();
    const sb = supabaseAdmin();
    const uploads = [];

    for (const file of files) {
      const path = createCommissionReferencePath(requestId);
      const { data, error } = await sb.storage
        .from(COMMISSION_REFERENCE_BUCKET)
        .createSignedUploadUrl(path, { upsert: false });
      if (error || !data?.token) {
        throw new Error(error?.message || "Could not create a secure reference upload.");
      }
      uploads.push({
        path,
        token: data.token,
        cleanupToken: signCommissionReferenceCleanup(path),
        contentType: file.type,
        size: file.size,
      });
    }

    return res.status(200).json({ uploads });
  } catch (error) {
    const message = /bucket|storage/i.test(error.message || "")
      ? "Private reference photo storage is not configured yet."
      : (error.message || "Could not prepare reference uploads.");
    return res.status(400).json({ error: message });
  }
}
