import test from "node:test";
import assert from "node:assert/strict";
import {
  createCommissionReferencePath,
  isCommissionReferencePath,
  signCommissionReferenceCleanup,
  validateUploadDeclarations,
  verifyCommissionReferenceCleanup,
} from "../api/_lib/commission-references.js";
import {
  MAX_REFERENCE_FILE_BYTES,
  validateReferenceSourceFile,
} from "../src/lib/commissionReferences.js";

test("reference upload declarations enforce prepared WebP limits", () => {
  assert.deepEqual(validateUploadDeclarations([{ name: "photo.webp", type: "image/webp", size: 2048 }]), [
    { name: "photo.webp", type: "image/webp", size: 2048 },
  ]);
  assert.throws(() => validateUploadDeclarations([{ name: "photo.jpg", type: "image/jpeg", size: 2048 }]), /WebP/);
  assert.throws(() => validateUploadDeclarations([{ name: "huge.webp", type: "image/webp", size: MAX_REFERENCE_FILE_BYTES + 1 }]), /8 MB/);
});

test("reference source validation accepts common images and rejects unsafe inputs", () => {
  assert.equal(validateReferenceSourceFile({ type: "image/jpeg", size: 1000 }), null);
  assert.match(validateReferenceSourceFile({ type: "image/svg+xml", size: 1000 }), /JPEG, PNG, or WebP/);
  assert.match(validateReferenceSourceFile({ type: "image/png", size: 26 * 1024 * 1024 }), /25 MB/);
});

test("cleanup authorization is scoped to a generated private path", () => {
  const previous = process.env.SUPABASE_SECRET_KEY;
  process.env.SUPABASE_SECRET_KEY = "test-secret-only";
  try {
    const path = createCommissionReferencePath("11111111-1111-4111-8111-111111111111");
    assert.equal(isCommissionReferencePath(path), true);
    const token = signCommissionReferenceCleanup(path);
    assert.equal(verifyCommissionReferenceCleanup(path, token), true);
    assert.equal(verifyCommissionReferenceCleanup(path.replace(".webp", "-changed.webp"), token), false);
  } finally {
    if (previous == null) delete process.env.SUPABASE_SECRET_KEY;
    else process.env.SUPABASE_SECRET_KEY = previous;
  }
});
