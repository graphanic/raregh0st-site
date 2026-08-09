import test from "node:test";
import assert from "node:assert/strict";
import { buildCommissionMeta, resolveCommissionPiece } from "../src/lib/commissionContext.js";

test("invalid commission piece IDs are ignored", () => {
  assert.equal(resolveCommissionPiece("not-a-work"), null);
  assert.equal(resolveCommissionPiece(""), null);
});

test("commission context derives title locally and retains metadata", () => {
  const piece = resolveCommissionPiece("1");
  assert.equal(piece?.title, "Sanity Is In Rare Supply");
  assert.deepEqual(
    buildCommissionMeta({ intendedUse: " Gift ", budget: "", timeline: "October" }, piece),
    {
      intendedUse: "Gift",
      budget: null,
      timeline: "October",
      deliverable: "digital-master",
      pieceId: "1",
      pieceTitle: "Sanity Is In Rare Supply",
    },
  );
});
