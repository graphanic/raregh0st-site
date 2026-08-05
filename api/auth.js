import {
  authenticateAdminPassword,
  isAdminConfigured,
  issueAdminToken,
  STORE_ADMIN_PASSWORD_ENV,
  verifyAdminToken,
} from "./_lib/auth.js";

// Store-admin authentication handler — V2.
// GET safely reports whether this deployment received the new variable.
// POST authenticates and returns a signed daily session that contains no password.
export default function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "GET") {
    const suppliedToken = req.headers["x-admin-token"] || req.headers["X-Admin-Token"];
    const session = suppliedToken ? verifyAdminToken(req) : null;
    return res.status(200).json({
      version: 2,
      configured: isAdminConfigured(),
      sessionValid: session ? session.ok : null,
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const submitted = String(body.password || "").trim();
    if (!submitted) return res.status(400).json({ error: "Password is required" });

    const auth = authenticateAdminPassword(submitted);
    if (!auth.ok) return res.status(auth.status).json({ error: auth.error });

    return res.status(200).json({ success: true, token: issueAdminToken() });
  } catch (error) {
    console.error(`[admin-auth:${STORE_ADMIN_PASSWORD_ENV}]`, error);
    return res.status(500).json({ error: "Admin authentication failed" });
  }
}
