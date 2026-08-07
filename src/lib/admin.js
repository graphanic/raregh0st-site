export async function verifyAdminAccess(accessToken) {
  if (!accessToken) throw new Error("A Supabase access token is required.");

  const response = await fetch("/api/auth", {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data?.error || `HTTP ${response.status}`);
    error.status = response.status;
    error.configured = data?.configured;
    throw error;
  }

  return data;
}
