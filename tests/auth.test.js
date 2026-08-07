import test from "node:test";
import assert from "node:assert/strict";
import {
  getBearerToken,
  isAuthorizedAdmin,
  parseAdminEmails,
  parseAdminUserIds,
} from "../api/_lib/auth.js";
import {
  PUBLIC_SUPABASE_URL,
  resolveSupabaseUrl,
} from "../config/supabase.js";

test("parseAdminUserIds trims, splits, and de-duplicates IDs", () => {
  assert.deepEqual(
    parseAdminUserIds(" first,second\nfirst  third "),
    ["first", "second", "third"]
  );
});

test("getBearerToken accepts a case-insensitive Bearer header", () => {
  assert.equal(
    getBearerToken({ headers: { authorization: "bearer access-token" } }),
    "access-token"
  );
  assert.equal(getBearerToken({ headers: {} }), "");
});

test("isAuthorizedAdmin matches only an explicitly allowed user ID", () => {
  const allowed = ["owner-id"];
  assert.equal(isAuthorizedAdmin("owner-id", allowed), true);
  assert.equal(isAuthorizedAdmin("other-id", allowed), false);
  assert.equal(isAuthorizedAdmin("", allowed), false);
});

test("parseAdminEmails normalizes and de-duplicates email addresses", () => {
  assert.deepEqual(
    parseAdminEmails(" Owner@Example.com,second@example.com\nowner@example.com "),
    ["owner@example.com", "second@example.com"]
  );
});

test("isAuthorizedAdmin accepts a verified email but ignores user metadata", () => {
  const allowedEmails = ["owner@example.com"];
  assert.equal(
    isAuthorizedAdmin({ id: "other-id", email: "OWNER@example.com" }, [], allowedEmails),
    true
  );
  assert.equal(
    isAuthorizedAdmin({ id: "other-id", email: "other@example.com", user_metadata: { email: "owner@example.com" } }, [], allowedEmails),
    false
  );
});

test("resolveSupabaseUrl rejects malformed and unrelated project URLs", () => {
  assert.equal(resolveSupabaseUrl("not-a-url"), PUBLIC_SUPABASE_URL);
  assert.equal(resolveSupabaseUrl("https://wrong-project.supabase.co"), PUBLIC_SUPABASE_URL);
  assert.equal(resolveSupabaseUrl(`${PUBLIC_SUPABASE_URL}/rest/v1`), PUBLIC_SUPABASE_URL);
});
