// Mirrors the token format issued by api/auth.js: base64(password + ":" + YYYY-MM-DD).
// Tokens are only valid on the day they were issued — re-login is required daily.

export function verifyAdminToken(req) {
  const expected = (process.env.ADMIN_PASSWORD || "").trim();
  if (!expected) return { ok: false, status: 500, error: "ADMIN_PASSWORD not configured on server" };

  const header = req.headers["x-admin-token"] || req.headers["X-Admin-Token"] || "";
  if (!header) return { ok: false, status: 401, error: "Missing admin token" };

  let decoded;
  try {
    decoded = Buffer.from(String(header), "base64").toString("utf8");
  } catch {
    return { ok: false, status: 401, error: "Invalid token" };
  }

  const idx = decoded.lastIndexOf(":");
  if (idx === -1) return { ok: false, status: 401, error: "Invalid token format" };
  const password = decoded.slice(0, idx);
  const date = decoded.slice(idx + 1);

  if (password !== expected) return { ok: false, status: 401, error: "Invalid token" };

  const today = new Date().toISOString().split("T")[0];
  if (date !== today) return { ok: false, status: 401, error: "Token expired \u2014 please log in again" };

  return { ok: true };
}

export function requireAdmin(handler) {
  return async (req, res) => {
    const v = verifyAdminToken(req);
    if (!v.ok) return res.status(v.status).json({ error: v.error });
    return handler(req, res);
  };
}
