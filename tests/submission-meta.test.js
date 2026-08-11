import test from "node:test";
import assert from "node:assert/strict";
import { sanitizeSubmissionMeta, sanitizeSubmissionReferences } from "../api/submit.js";

const uploadPath = "requests/11111111-1111-4111-8111-111111111111/22222222-2222-4222-8222-222222222222.webp";

test("sanitizeSubmissionMeta keeps only supported commission and artwork fields", () => {
  assert.deepEqual(
    sanitizeSubmissionMeta({
      intendedUse: "  Personal memorial  ",
      budget: "$500–$1,000",
      timeline: "Autumn 2026",
      deliverable: "digital-master",
      pieceId: "4",
      pieceTitle: "The Beast",
      references: [
        { type: "portfolio", workId: "4", title: "Client supplied title", note: "  The electric colour  " },
        { type: "upload", storagePath: uploadPath, originalName: "  family.jpg  ", mimeType: "image/webp", size: 12345, note: "A shared memory" },
      ],
      unexpected: "discard me",
    }),
    {
      intendedUse: "Personal memorial",
      budget: "$500–$1,000",
      timeline: "Autumn 2026",
      deliverable: "digital-master",
      pieceId: "4",
      pieceTitle: "The Beast",
      references: [
        { type: "portfolio", workId: "4", title: "The Beast", note: "The electric colour" },
        { type: "upload", storagePath: uploadPath, originalName: "family.jpg", mimeType: "image/webp", size: 12345, note: "A shared memory" },
      ],
    },
  );
});

test("sanitizeSubmissionMeta rejects arrays and trims field lengths", () => {
  assert.deepEqual(sanitizeSubmissionMeta(["not", "metadata"]), {});
  assert.equal(sanitizeSubmissionMeta({ budget: "x".repeat(240) }).budget.length, 200);
});

test("sanitizeSubmissionReferences rejects invalid uploads and duplicate works", () => {
  const references = sanitizeSubmissionReferences([
    { type: "portfolio", workId: "1", title: "Wrong title" },
    { type: "portfolio", workId: "1", title: "Duplicate" },
    { type: "portfolio", workId: "not-real" },
    { type: "upload", storagePath: "public/photo.webp", mimeType: "image/webp", size: 100 },
    { type: "upload", storagePath: uploadPath, mimeType: "image/png", size: 100 },
  ]);
  assert.deepEqual(references, [{ type: "portfolio", workId: "1", title: "Sanity Is In Rare Supply" }]);
});
