// V2 store-admin session storage. The signed token never contains the password
// and uses a new key so legacy sessions cannot survive the credential reset.

const KEY = "rg0_store_admin_token_v2";

export const getAdminToken = () => {
  try { return localStorage.getItem(KEY) || ""; } catch { return ""; }
};

export const setAdminToken = (token) => {
  try {
    if (token) localStorage.setItem(KEY, token);
    else localStorage.removeItem(KEY);
  } catch {}
};

export const clearAdminToken = () => setAdminToken("");

export async function getAdminAuthStatus() {
  const response = await fetch("/api/auth", { cache: "no-store" });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.error || `HTTP ${response.status}`);
  return data;
}

export async function loginAdmin(password) {
  const response = await fetch("/api/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.error || `HTTP ${response.status}`);
  setAdminToken(data.token);
  return data.token;
}
