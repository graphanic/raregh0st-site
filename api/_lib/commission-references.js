import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import {
  COMMISSION_REFERENCE_BUCKET,
  MAX_REFERENCE_FILE_BYTES,
  MAX_UPLOAD_REFERENCES,
} from "../../src/lib/commissionReferences.js";

const STORAGE_PATH_RE = /^requests\/[0-9a-f-]{36}\/[0-9a-f-]{36}\.webp$/i;

function signingSecret() {
  const secret = String(process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  if (!secret) throw new Error("Supabase server credentials are not configured");
  return secret;
}

export { COMMISSION_REFERENCE_BUCKET };

export function isCommissionReferencePath(path) {
  return typeof path === "string" && STORAGE_PATH_RE.test(path);
}

export function validateUploadDeclarations(files) {
  if (!Array.isArray(files) || files.length === 0) {
    throw new Error("Choose at least one reference photo.");
  }
  if (files.length > MAX_UPLOAD_REFERENCES) {
    throw new Error(`Choose no more than ${MAX_UPLOAD_REFERENCES} reference photos.`);
  }

  return files.map((file) => {
    const name = String(file?.name || "reference.webp").trim().slice(0, 200);
    const type = String(file?.type || "").trim().toLowerCase();
    const size = Number(file?.size);
    if (type !== "image/webp") throw new Error("Reference photos must be prepared as WebP images.");
    if (!Number.isFinite(size) || size <= 0 || size > MAX_REFERENCE_FILE_BYTES) {
      throw new Error("Each prepared reference photo must be 8 MB or smaller.");
    }
    return { name, type, size };
  });
}

export function createCommissionReferencePath(requestId = randomUUID()) {
  return `requests/${requestId}/${randomUUID()}.webp`;
}

export function signCommissionReferenceCleanup(path) {
  if (!isCommissionReferencePath(path)) throw new Error("Invalid reference photo path.");
  return createHmac("sha256", signingSecret()).update(path).digest("hex");
}

export function verifyCommissionReferenceCleanup(path, token) {
  if (!isCommissionReferencePath(path) || typeof token !== "string" || !/^[0-9a-f]{64}$/i.test(token)) return false;
  const expected = Buffer.from(signCommissionReferenceCleanup(path), "hex");
  const received = Buffer.from(token, "hex");
  return expected.length === received.length && timingSafeEqual(expected, received);
}

export function getCommissionUploadReferences(meta) {
  if (!meta || !Array.isArray(meta.references)) return [];
  return meta.references.filter((reference) => (
    reference?.type === "upload" && isCommissionReferencePath(reference.storagePath)
  ));
}
