import test from "node:test";
import assert from "node:assert/strict";
import { sanitizeSubmissionMeta } from "../api/submit.js";

test("sanitizeSubmissionMeta keeps only supported commission and artwork fields", () => {
  assert.deepEqual(
    sanitizeSubmissionMeta({
      intendedUse: "  Personal memorial  ",
      budget: "$500–$1,000",
      timeline: "Autumn 2026",
      deliverable: "digital-master",
      pieceId: "4",
      pieceTitle: "The Beast",
      unexpected: "discard me",
    }),
    {
      intendedUse: "Personal memorial",
      budget: "$500–$1,000",
      timeline: "Autumn 2026",
      deliverable: "digital-master",
      pieceId: "4",
      pieceTitle: "The Beast",
    },
  );
});

test("sanitizeSubmissionMeta rejects arrays and trims field lengths", () => {
  assert.deepEqual(sanitizeSubmissionMeta(["not", "metadata"]), {});
  assert.equal(sanitizeSubmissionMeta({ budget: "x".repeat(240) }).budget.length, 200);
});
