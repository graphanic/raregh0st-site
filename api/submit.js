import { supabaseAdmin } from "./_lib/supabase.js";
import { isCommissionReferencePath } from "./_lib/commission-references.js";
import { getWorkById } from "../src/data/catalog.js";
import {
  MAX_PORTFOLIO_REFERENCES,
  MAX_REFERENCE_FILE_BYTES,
  MAX_REFERENCE_NOTE_LENGTH,
  MAX_UPLOAD_REFERENCES,
} from "../src/lib/commissionReferences.js";

// ─── Public submission endpoint ───
// Accepts contact messages, artwork inquiries/commissions, and newsletter signups.
// No auth: this is a public form target. Protected by input validation + a honeypot field.
// Writes go through the service-role client (RLS denies all direct client access).

const KINDS = new Set(["contact", "inquiry", "newsletter"]);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(v, max) {
  if (v == null) return null;
  const s = String(v).trim();
  if (!s) return null;
  return s.slice(0, max);
}

const META_FIELDS = {
  intendedUse: 500,
  budget: 200,
  timeline: 200,
  deliverable: 100,
  pieceId: 100,
  pieceTitle: 300,
};

export function sanitizeSubmissionReferences(value) {
  if (!Array.isArray(value)) return [];
  let portfolioCount = 0;
  let uploadCount = 0;
  const seenPortfolioIds = new Set();
  const seenUploadPaths = new Set();

  return value.flatMap((reference) => {
    if (!reference || typeof reference !== "object" || Array.isArray(reference)) return [];
    const note = clean(reference.note, MAX_REFERENCE_NOTE_LENGTH);

    if (reference.type === "portfolio" && portfolioCount < MAX_PORTFOLIO_REFERENCES) {
      const workId = clean(reference.workId, 100);
      const work = workId ? getWorkById(workId) : null;
      if (!work || seenPortfolioIds.has(work.id)) return [];
      seenPortfolioIds.add(work.id);
      portfolioCount += 1;
      return [{
        type: "portfolio",
        workId: work.id,
        title: work.title,
        ...(note ? { note } : {}),
      }];
    }

    if (reference.type === "upload" && uploadCount < MAX_UPLOAD_REFERENCES) {
      const storagePath = clean(reference.storagePath, 500);
      const originalName = clean(reference.originalName, 200) || "Reference photo";
      const mimeType = clean(reference.mimeType, 100);
      const size = Number(reference.size);
      if (!isCommissionReferencePath(storagePath) || mimeType !== "image/webp") return [];
      if (!Number.isFinite(size) || size <= 0 || size > MAX_REFERENCE_FILE_BYTES) return [];
      if (seenUploadPaths.has(storagePath)) return [];
      seenUploadPaths.add(storagePath);
      uploadCount += 1;
      return [{
        type: "upload",
        storagePath,
        originalName,
        mimeType,
        size: Math.round(size),
        ...(note ? { note } : {}),
      }];
    }

    return [];
  });
}

export function sanitizeSubmissionMeta(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const scalarMeta = Object.fromEntries(
    Object.entries(META_FIELDS)
      .map(([key, max]) => [key, clean(value[key], max)])
      .filter(([, fieldValue]) => fieldValue !== null),
  );
  const references = sanitizeSubmissionReferences(value.references);
  return references.length > 0 ? { ...scalarMeta, references } : scalarMeta;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let body;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
  } catch {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  // Honeypot: real users never fill this hidden field. Bots do — silently accept + drop.
  if (clean(body.company, 200)) {
    return res.status(200).json({ ok: true });
  }

  const kind = KINDS.has(body.kind) ? body.kind : "contact";

  const email = clean(body.email, 320);
  if (!email || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: "A valid email is required." });
  }

  const message = clean(body.message, 5000);
  if (kind !== "newsletter" && !message) {
    return res.status(400).json({ error: "A message is required." });
  }

  const row = {
    kind,
    name: clean(body.name, 200),
    email,
    category: clean(body.category, 100),
    subject: clean(body.subject, 300),
    message,
    source: clean(body.source, 100),
    meta: sanitizeSubmissionMeta(body.meta),
  };

  try {
    const sb = supabaseAdmin();

    if (kind === "newsletter") {
      // Idempotent: a repeat signup should feel like success, not an error.
      // The partial unique index (lower(email) where kind='newsletter') is the real
      // guard against races; this check just avoids surfacing that as an error.
      const { data: existing } = await sb
        .from("submissions")
        .select("id")
        .eq("kind", "newsletter")
        .ilike("email", email)
        .maybeSingle();
      if (existing) return res.status(200).json({ ok: true, kind, already: true });

      const { error } = await sb.from("submissions").insert(row);
      // A duplicate slipping through the race is still a success from the user's view.
      if (error && !/duplicate|unique/i.test(error.message)) {
        return res.status(500).json({ error: error.message });
      }
      return res.status(200).json({ ok: true, kind });
    }

    const { error } = await sb.from("submissions").insert(row);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true, kind });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Server error" });
  }
}
