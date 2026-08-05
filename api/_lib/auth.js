import { createHash, createHmac, timingSafeEqual } from "node:crypto";

// V2 deliberately uses a new variable and session format so a stale V1 password
// or browser token can never be mistaken for the active store-admin credential.
export const STORE_ADMIN_PASSWORD_ENV = "STORE_ADMIN_PASSWORD_V2";

function getAdminPassword() {
  return (process.env[STORE_ADMIN_PASSWORD_ENV] || "").trim();
}

function utcDate() {
  return new Date().toISOString().split("T")[0];
}

function constantTimeStringEqual(left, right) {
  const leftHash = createHash("sha256").update(String(left), "utf8").digest();
  const rightHash = createHash("sha256").update(String(right), "utf8").digest();
  return timingSafeEqual(leftHash, rightHash);
}

function sign(payload, password) {
  return createHmac("sha256", password).update(payload, "utf8").digest("base64url");
}

export function isAdminConfigured() {
  return getAdminPassword().length > 0;
}

export function authenticateAdminPassword(submittedPassword) {
  const expected = getAdminPassword();
  if (!expected) {
    return {
      ok: false,
      status: 500,
      error: `${STORE_ADMIN_PASSWORD_ENV} is not configured on this deployment`,
    };
  }

  if (!constantTimeStringEqual(String(submittedPassword || "").trim(), expected)) {
    return { ok: false, status: 401, error: "Invalid password" };
  }

  return { ok: true };
}

export function issueAdminToken() {
  const password = getAdminPassword();
  if (!password) throw new Error(`${STORE_ADMIN_PASSWORD_ENV} is not configured`);

  const payload = Buffer.from(
    JSON.stringify({ version: 2, date: utcDate() }),
    "utf8"
  ).toString("base64url");

  return `${payload}.${sign(payload, password)}`;
}

export function verifyAdminToken(req) {
  const password = getAdminPassword();
  if (!password) {
    return {
      ok: false,
      status: 500,
      error: `${STORE_ADMIN_PASSWORD_ENV} is not configured on this deployment`,
    };
  }

  const header = req.headers["x-admin-token"] || req.headers["X-Admin-Token"] || "";
  if (!header) return { ok: false, status: 401, error: "Missing admin token" };

  const [payload, providedSignature, ...extra] = String(header).split(".");
  if (!payload || !providedSignature || extra.length > 0) {
    return { ok: false, status: 401, error: "Invalid admin session" };
  }

  const expectedSignature = sign(payload, password);
  if (!constantTimeStringEqual(providedSignature, expectedSignature)) {
    return { ok: false, status: 401, error: "Invalid admin session" };
  }

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (session.version !== 2 || session.date !== utcDate()) {
      return { ok: false, status: 401, error: "Admin session expired — please sign in again" };
    }
  } catch {
    return { ok: false, status: 401, error: "Invalid admin session" };
  }

  return { ok: true };
}

export function requireAdmin(handler) {
  return async (req, res) => {
    const result = verifyAdminToken(req);
    if (!result.ok) return res.status(result.status).json({ error: result.error });
    return handler(req, res);
  };
}
