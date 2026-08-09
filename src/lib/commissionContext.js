import { getWorkById } from "../data/catalog.js";

export function resolveCommissionPiece(pieceId) {
  if (pieceId == null || pieceId === "") return null;
  return getWorkById(String(pieceId)) || null;
}

export function buildCommissionMeta(form, piece = null) {
  return {
    intendedUse: form.intendedUse?.trim() || null,
    budget: form.budget?.trim() || null,
    timeline: form.timeline?.trim() || null,
    deliverable: "digital-master",
    ...(piece ? { pieceId: piece.id, pieceTitle: piece.title } : {}),
  };
}
