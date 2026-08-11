import test from "node:test";
import assert from "node:assert/strict";
import {
  buildCommissionMeta,
  resolveCommissionPiece,
  resolveCommissionReference,
} from "../src/lib/commissionContext.js";

test("invalid commission piece IDs are ignored", () => {
  assert.equal(resolveCommissionPiece("not-a-work"), null);
  assert.equal(resolveCommissionPiece(""), null);
});

test("commission context derives title locally and retains metadata", () => {
  const reference = resolveCommissionReference("1");
  assert.equal(reference?.title, "Sanity Is In Rare Supply");
  assert.deepEqual(
    buildCommissionMeta(
      { intendedUse: " Gift ", budget: "", timeline: "October" },
      [{ ...reference, note: " The colour and hidden faces. " }],
    ),
    {
      intendedUse: "Gift",
      budget: null,
      timeline: "October",
      deliverable: "digital-master",
      references: [{
        type: "portfolio",
        workId: "1",
        title: "Sanity Is In Rare Supply",
        note: "The colour and hidden faces.",
      }],
    },
  );
});

test("commission metadata deduplicates references and keeps private upload paths", () => {
  const portfolio = resolveCommissionReference("4");
  const upload = {
    type: "upload",
    storagePath: "requests/11111111-1111-4111-8111-111111111111/22222222-2222-4222-8222-222222222222.webp",
    originalName: "family photo.jpg",
    mimeType: "image/webp",
    size: 12345,
    note: "The warmth in this moment",
  };
  const result = buildCommissionMeta({}, [portfolio, portfolio, upload, upload]);
  assert.equal(result.references.length, 2);
  assert.equal(result.references[0].workId, "4");
  assert.equal(result.references[1].storagePath, upload.storagePath);
});
