// Thin fetch wrappers for the public + admin APIs.
// All endpoints live under /api/* on the same origin.

import { supabase } from "./supabase";
import {
  COMMISSION_REFERENCE_BUCKET,
  MAX_UPLOAD_REFERENCES,
} from "./commissionReferences";

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

export const cleanupCommissionReferenceUploads = (uploads = []) => {
  if (uploads.length === 0) return Promise.resolve({ ok: true });
  return fetch("/api/commission-upload-cleanup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      uploads: uploads.map(({ path, cleanupToken }) => ({ path, cleanupToken })),
    }),
  }).then(j);
};

export async function uploadCommissionReferenceFiles(references = []) {
  if (references.length === 0) return { references: [], uploads: [] };
  if (references.length > MAX_UPLOAD_REFERENCES) {
    throw new Error(`Choose no more than ${MAX_UPLOAD_REFERENCES} reference photos.`);
  }
  if (!supabase) throw new Error("Reference photo storage is unavailable right now.");

  const files = references.map((reference) => reference.file).filter(Boolean);
  if (files.length !== references.length) throw new Error("One of the reference photos is no longer available. Please add it again.");

  const { uploads } = await fetch("/api/commission-upload-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      files: files.map((file) => ({ name: file.name, type: file.type, size: file.size })),
    }),
  }).then(j);
  if (
    !Array.isArray(uploads)
    || uploads.length !== files.length
    || uploads.some((grant) => !grant?.path || !grant?.token || !grant?.cleanupToken)
  ) {
    throw new Error("The secure reference upload could not be prepared. Please try again.");
  }

  try {
    for (let index = 0; index < uploads.length; index += 1) {
      const grant = uploads[index];
      const file = files[index];
      const { error } = await supabase.storage
        .from(COMMISSION_REFERENCE_BUCKET)
        .uploadToSignedUrl(grant.path, grant.token, file, {
          contentType: file.type,
          cacheControl: "3600",
        });
      if (error) throw error;
    }
  } catch (error) {
    await cleanupCommissionReferenceUploads(uploads).catch(() => {});
    throw new Error(error.message || "A reference photo could not be uploaded.");
  }

  return {
    uploads,
    references: references.map((reference, index) => ({
      ...reference,
      storagePath: uploads[index].path,
    })),
  };
}

// ─── Admin ───────────────────────────────────────────────────────────────────
function adminHeaders(token, extra = {}) {
  return { ...extra, Authorization: `Bearer ${token || ""}` };
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

export async function adminDownloadAishCsv(token, month) {
  const response = await fetch(`/api/admin/dashboard?report=aish&month=${month}&format=csv`, {
    headers: adminHeaders(token),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.error || `HTTP ${response.status}`);
  }
  return response.blob();
}

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

export const adminGetSubmissionReferences = (token, id) =>
  fetch(`/api/admin/submissions?id=${encodeURIComponent(id)}&references=1`, {
    headers: adminHeaders(token),
  }).then(j);

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
      Authorization: `Bearer ${token || ""}`,
      "x-filename": file.name,
      "x-product-id": String(productId),
      "Content-Type": file.type || "application/octet-stream",
    },
    body: file,
  }).then(j);
