import test from "node:test";
import assert from "node:assert/strict";
import {
  getBearerToken,
  isAuthorizedAdmin,
  parseAdminUserIds,
} from "../api/_lib/auth.js";

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
