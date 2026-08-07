import { isAdminConfigured, verifyAdminToken } from "./_lib/auth.js";

// GET /api/auth validates both the Supabase session and the server-side
// admin allowlist. It is used by the route guard before admin UI is rendered.
export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const result = await verifyAdminToken(req);
  if (!result.ok) {
    return res.status(result.status).json({
      error: result.error,
      configured: isAdminConfigured(),
    });
  }

  return res.status(200).json({
    authenticated: true,
    authorized: true,
    user: {
      id: result.user.id,
      email: result.user.email || null,
    },
  });
}
