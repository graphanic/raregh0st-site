import { isSupabaseServerConfigured, supabaseAdmin } from "./supabase.js";

export const SUPABASE_ADMIN_USER_IDS_ENV = "SUPABASE_ADMIN_USER_IDS";

export function parseAdminUserIds(value) {
  return [...new Set(
    String(value || "")
      .split(/[\s,]+/)
      .map((id) => id.trim())
      .filter(Boolean)
  )];
}

function configuredAdminUserIds() {
  return parseAdminUserIds(process.env[SUPABASE_ADMIN_USER_IDS_ENV]);
}

export function isAdminConfigured() {
  return isSupabaseServerConfigured() && configuredAdminUserIds().length > 0;
}

export function getBearerToken(req) {
  const header = req?.headers?.authorization || req?.headers?.Authorization || "";
  const match = /^Bearer\s+(.+)$/i.exec(String(header).trim());
  return match?.[1]?.trim() || "";
}

export function isAuthorizedAdmin(userId, allowedIds = configuredAdminUserIds()) {
  return Boolean(userId && allowedIds.includes(String(userId)));
}

export async function verifyAdminToken(req) {
  if (!isSupabaseServerConfigured()) {
    return { ok: false, status: 500, error: "Supabase server credentials are not configured" };
  }

  const allowedIds = configuredAdminUserIds();
  if (allowedIds.length === 0) {
    return { ok: false, status: 500, error: `${SUPABASE_ADMIN_USER_IDS_ENV} is not configured` };
  }

  const token = getBearerToken(req);
  if (!token) return { ok: false, status: 401, error: "Missing bearer token" };

  try {
    const { data: { user }, error } = await supabaseAdmin().auth.getUser(token);
    if (error || !user) {
      return { ok: false, status: 401, error: "Invalid or expired Supabase session" };
    }
    if (!isAuthorizedAdmin(user.id, allowedIds)) {
      return { ok: false, status: 403, error: "This account is not authorized for admin access" };
    }
    return { ok: true, user };
  } catch (error) {
    console.error("[admin-auth] Supabase token verification failed", error);
    return { ok: false, status: 503, error: "Could not verify the Supabase session" };
  }
}

export function requireAdmin(handler) {
  return async (req, res) => {
    const result = await verifyAdminToken(req);
    if (!result.ok) return res.status(result.status).json({ error: result.error });
    req.adminUser = result.user;
    return handler(req, res);
  };
}
