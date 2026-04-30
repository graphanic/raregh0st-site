// Admin token storage. Mirrors the existing UploadAdmin pattern \u2014 base64(password:YYYY-MM-DD),
// valid only for the day issued.

const KEY = "rg0_admin_token";

export const getAdminToken = () => {
  try { return localStorage.getItem(KEY) || ""; } catch { return ""; }
};

export const setAdminToken = (t) => {
  try {
    if (t) localStorage.setItem(KEY, t);
    else localStorage.removeItem(KEY);
  } catch {}
};

export const clearAdminToken = () => setAdminToken("");

export async function loginAdmin(password) {
  const r = await fetch("/api/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data?.error || `HTTP ${r.status}`);
  setAdminToken(data.token);
  return data.token;
}
