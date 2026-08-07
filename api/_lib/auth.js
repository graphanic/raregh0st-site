import { isSupabaseServerConfigured, supabaseAdmin } from "./supabase.js";

export const SUPABASE_ADMIN_USER_IDS_ENV = "SUPABASE_ADMIN_USER_IDS";
export const SUPABASE_ADMIN_EMAILS_ENV = "SUPABASE_ADMIN_EMAILS";

export function parseAdminUserIds(value) {
  return [...new Set(
    String(value || "")
      .split(/[\s,]+/)
      .map((id) => id.trim())
      .filter(Boolean)
  )];
}

export function parseAdminEmails(value) {
  return [...new Set(
    String(value || "")
      .split(/[\s,]+/)
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  )];
}

function configuredAdminUserIds() {
  return parseAdminUserIds(process.env[SUPABASE_ADMIN_USER_IDS_ENV]);
}

function configuredAdminEmails() {
  return parseAdminEmails(process.env[SUPABASE_ADMIN_EMAILS_ENV]);
}

export function isAdminConfigured() {
  return isSupabaseServerConfigured();
}

export function getBearerToken(req) {
  const header = req?.headers?.authorization || req?.headers?.Authorization || "";
  const match = /^Bearer\s+(.+)$/i.exec(String(header).trim());
  return match?.[1]?.trim() || "";
}

export function isAuthorizedAdmin(
  user,
  allowedIds = configuredAdminUserIds(),
  allowedEmails = configuredAdminEmails()
) {
  if (!user) return false;

  if (typeof user === "string") {
    return allowedIds.includes(user);
  }

  const idAllowed = Boolean(user.id && allowedIds.includes(String(user.id)));
  const email = String(user.email || "").trim().toLowerCase();
  const emailAllowed = Boolean(email && allowedEmails.includes(email));
  return idAllowed || emailAllowed;
}

async function findDatabaseAdmin(user) {
  const email = String(user?.email || "").trim().toLowerCase();
  if (!email) return { data: null, error: null };

  const { data, error } = await supabaseAdmin()
    .from("store_admins")
    .select("id, user_id")
    .eq("email", email)
    .maybeSingle();

  if (error || !data) return { data, error };
  if (data.user_id && data.user_id !== user.id) return { data: null, error: null };

  if (!data.user_id) {
    const { error: linkError } = await supabaseAdmin()
      .from("store_admins")
      .update({ user_id: user.id, updated_at: new Date().toISOString() })
      .eq("id", data.id)
      .is("user_id", null);
    if (linkError) return { data: null, error: linkError };
  }

  return { data, error: null };
}

export async function verifyAdminToken(req) {
  if (!isSupabaseServerConfigured()) {
    return { ok: false, status: 500, error: "Supabase server credentials are not configured" };
  }

  const allowedIds = configuredAdminUserIds();
  const allowedEmails = configuredAdminEmails();

  const token = getBearerToken(req);
  if (!token) return { ok: false, status: 401, error: "Missing bearer token" };

  try {
    const { data: { user }, error } = await supabaseAdmin().auth.getUser(token);
    if (error || !user) {
      return { ok: false, status: 401, error: "Invalid or expired Supabase session" };
    }
    if (!isAuthorizedAdmin(user, allowedIds, allowedEmails)) {
      const databaseAdmin = await findDatabaseAdmin(user);
      if (databaseAdmin.error) {
        console.error("[admin-auth] Store admin lookup failed", databaseAdmin.error);
        return { ok: false, status: 503, error: "Could not check the admin allowlist" };
      }
      if (!databaseAdmin.data) {
        return { ok: false, status: 403, error: "This account is not authorized for admin access" };
      }
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
