// Thin fetch wrappers for the public + admin APIs.
// All endpoints live under /api/* on the same origin.

const j = (r) => r.json().then(d => (r.ok ? d : Promise.reject(new Error(d?.error || `HTTP ${r.status}`))));

// ─── Public ──────────────────────────────────────────────────────────────────
export const getSettings = () => fetch("/api/settings").then(j);

export const getProducts = (params = {}) => {
  const q = new URLSearchParams();
  if (params.category) q.set("category", params.category);
  if (params.slug) q.set("slug", params.slug);
  return fetch(`/api/products?${q.toString()}`).then(j);
};

export const startCheckout = (items) =>
  fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  }).then(j);

export const getOrder = (sessionId) =>
  fetch(`/api/order?session_id=${encodeURIComponent(sessionId)}`).then(j);

// Contact messages, artwork inquiries/commissions, and newsletter signups.
// payload: { kind, name?, email, category?, subject?, message?, source?, meta?, company? }
export const submitForm = (payload) =>
  fetch("/api/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(j);

// ─── Admin ───────────────────────────────────────────────────────────────────
function adminHeaders(token, extra = {}) {
  return { ...extra, "x-admin-token": token || "" };
}

export const adminGetSettings = (token) =>
  fetch("/api/admin/settings", { headers: adminHeaders(token) }).then(j);

export const adminUpdateSettings = (token, patch) =>
  fetch("/api/admin/settings", {
    method: "POST",
    headers: adminHeaders(token, { "Content-Type": "application/json" }),
    body: JSON.stringify(patch),
  }).then(j);

export const adminGetProducts = (token) =>
  fetch("/api/admin/products", { headers: adminHeaders(token) }).then(j);

export const adminCreateProduct = (token, product) =>
  fetch("/api/admin/products", {
    method: "POST",
    headers: adminHeaders(token, { "Content-Type": "application/json" }),
    body: JSON.stringify(product),
  }).then(j);

export const adminUpdateProduct = (token, product) =>
  fetch("/api/admin/products", {
    method: "PATCH",
    headers: adminHeaders(token, { "Content-Type": "application/json" }),
    body: JSON.stringify(product),
  }).then(j);

export const adminDeleteProduct = (token, id) =>
  fetch(`/api/admin/products?id=${id}`, {
    method: "DELETE",
    headers: adminHeaders(token),
  }).then(j);

export const adminGetOrders = (token, params = {}) => {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => v != null && q.set(k, String(v)));
  return fetch(`/api/admin/orders?${q.toString()}`, { headers: adminHeaders(token) }).then(j);
};

export const adminGetDashboard = (token) =>
  fetch("/api/admin/dashboard", { headers: adminHeaders(token) }).then(j);

export const adminGetAishReport = (token, month) =>
  fetch(`/api/admin/dashboard?report=aish&month=${month}`, { headers: adminHeaders(token) }).then(j);

export const adminAishCsvUrl = (month) => `/api/admin/dashboard?report=aish&month=${month}&format=csv`;

export const adminSyncPrintful = (token) =>
  fetch("/api/admin/printful", {
    method: "POST",
    headers: adminHeaders(token),
  }).then(j);

export const adminGetSubmissions = (token, params = {}) => {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => v != null && v !== "" && q.set(k, String(v)));
  return fetch(`/api/admin/submissions?${q.toString()}`, { headers: adminHeaders(token) }).then(j);
};

export const adminUpdateSubmission = (token, id, status) =>
  fetch("/api/admin/submissions", {
    method: "PATCH",
    headers: adminHeaders(token, { "Content-Type": "application/json" }),
    body: JSON.stringify({ id, status }),
  }).then(j);

export const adminDeleteSubmission = (token, id) =>
  fetch(`/api/admin/submissions?id=${id}`, {
    method: "DELETE",
    headers: adminHeaders(token),
  }).then(j);

export const adminUploadDigital = (token, productId, file) =>
  fetch("/api/admin/digital-upload", {
    method: "POST",
    headers: {
      "x-admin-token": token || "",
      "x-filename": file.name,
      "x-product-id": String(productId),
      "Content-Type": file.type || "application/octet-stream",
    },
    body: file,
  }).then(j);
