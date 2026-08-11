import { getWorkById } from "../data/catalog.js";
import {
  MAX_PORTFOLIO_REFERENCES,
  MAX_REFERENCE_NOTE_LENGTH,
  MAX_UPLOAD_REFERENCES,
  createPortfolioReference,
} from "./commissionReferences.js";

export function resolveCommissionPiece(pieceId) {
  if (pieceId == null || pieceId === "") return null;
  return getWorkById(String(pieceId)) || null;
}

export function resolveCommissionReference(pieceId) {
  const work = resolveCommissionPiece(pieceId);
  return work ? createPortfolioReference(work) : null;
}

function serializeCommissionReferences(references = []) {
  let portfolioCount = 0;
  let uploadCount = 0;
  const seenPortfolioIds = new Set();
  const seenUploadPaths = new Set();

  return references.flatMap((reference) => {
    const note = String(reference?.note || "").trim().slice(0, MAX_REFERENCE_NOTE_LENGTH) || null;

    if (reference?.type === "portfolio" && portfolioCount < MAX_PORTFOLIO_REFERENCES) {
      const work = resolveCommissionPiece(reference.workId);
      if (!work || seenPortfolioIds.has(work.id)) return [];
      seenPortfolioIds.add(work.id);
      portfolioCount += 1;
      return [{
        type: "portfolio",
        workId: work.id,
        title: work.title,
        note,
      }];
    }

    if (reference?.type === "upload" && reference.storagePath && uploadCount < MAX_UPLOAD_REFERENCES) {
      if (seenUploadPaths.has(reference.storagePath)) return [];
      seenUploadPaths.add(reference.storagePath);
      uploadCount += 1;
      return [{
        type: "upload",
        storagePath: String(reference.storagePath),
        originalName: String(reference.originalName || "Reference photo"),
        mimeType: String(reference.mimeType || "image/webp"),
        size: Number(reference.size) || 0,
        note,
      }];
    }

    return [];
  });
}

export function buildCommissionMeta(form, references = []) {
  const serializedReferences = serializeCommissionReferences(references);
  return {
    intendedUse: form.intendedUse?.trim() || null,
    budget: form.budget?.trim() || null,
    timeline: form.timeline?.trim() || null,
    deliverable: "digital-master",
    ...(serializedReferences.length > 0 ? { references: serializedReferences } : {}),
  };
}
