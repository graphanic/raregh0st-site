// ─── Thin Printful API wrapper ───
// Auth: Bearer token via PRINTFUL_API_KEY env var (set this once you create a Printful store).
// Docs: https://developers.printful.com/docs/

const BASE = "https://api.printful.com";

function authHeaders() {
  const key = process.env.PRINTFUL_API_KEY;
  if (!key) {
    throw new Error("PRINTFUL_API_KEY not configured \u2014 set it in Vercel env vars to enable Printful");
  }
  return {
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };
}

async function request(path, init = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { ...authHeaders(), ...(init.headers || {}) },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = json?.error?.message || json?.result || `Printful ${res.status}`;
    throw new Error(`Printful API: ${msg}`);
  }
  return json.result;
}

// List all sync products (the products you've added to your Printful store)
export async function listSyncProducts() {
  return await request("/sync/products?limit=100");
}

// Get full detail for one sync product (includes variants with retail prices, sizes, etc.)
export async function getSyncProduct(id) {
  return await request(`/sync/products/${id}`);
}

// Place an order with Printful (test mode controlled by Printful's account-level setting, or by `confirm: false`)
// `payload` should follow https://developers.printful.com/docs/#tag/Orders/operation/createOrder
export async function createOrder(payload, { confirm = false } = {}) {
  return await request(`/orders?confirm=${confirm ? 1 : 0}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// Map a Printful sync product into a row for our `products` table.
export function syncProductToRow(p) {
  const slug = String(p.name || `printful-${p.id}`)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
  const price = p.retail_price ? Number(p.retail_price) : (p.variants?.[0]?.retail_price ? Number(p.variants[0].retail_price) : 0);
  const variantIds = (p.variants || []).map(v => ({ id: v.id, sync_variant_id: v.id, name: v.name, retail_price: v.retail_price }));
  return {
    slug,
    title: p.name,
    category: "apparel",        // safe default \u2014 owner can recategorize via admin
    subcategory: p.product?.type_name || null,
    description: p.name,
    price_cad: price,
    image_url: p.thumbnail_url || null,
    printful_product_id: String(p.id),
    printful_variant_ids: variantIds,
    is_active: true,
    is_digital: false,
  };
}
