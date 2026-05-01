import Stripe from "stripe";
import { supabaseAdmin, nowIso } from "./_lib/supabase.js";
import { computeSplits, round2 } from "./_lib/tax.js";
import { createOrder as createPrintfulOrder } from "./_lib/printful.js";

// Stripe webhook handler. Vercel passes the raw request body via `req.body` only as an object;
// we need the raw bytes for signature verification. We disable Vercel's default body parser
// using the `config.api.bodyParser = false` pattern below.

export const config = {
  api: { bodyParser: false },
};

// Buffer the request stream so we can verify the signature.
function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", chunk => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeKey || !webhookSecret) {
    console.error("[webhook] missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET");
    return res.status(500).json({ error: "Stripe webhook not configured" });
  }

  const stripe = new Stripe(stripeKey);
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    const raw = await readRawBody(req);
    event = stripe.webhooks.constructEvent(raw, sig, webhookSecret);
  } catch (err) {
    console.error("[webhook] signature verification failed:", err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      await recordOrder(stripe, session);
    } else if (event.type === "checkout.session.async_payment_succeeded") {
      const session = event.data.object;
      await recordOrder(stripe, session);
    }
    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("[webhook] handler error:", err);
    return res.status(500).json({ error: err.message });
  }
}

// Record an order in our DB. Idempotent: if the session already exists, we update it.
async function recordOrder(stripe, session) {
  const sb = supabaseAdmin();

  // Pull line items with expanded product data.
  const lineItemsResp = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100, expand: ["data.price.product"] });
  const lineItems = (lineItemsResp.data || []).map(li => {
    const product = li.price?.product || {};
    const md = product.metadata || {};
    return {
      product_id: md.product_id ? Number(md.product_id) : null,
      slug: md.slug || null,
      title: product.name || li.description || "",
      quantity: li.quantity || 1,
      unit_amount_cad: li.price?.unit_amount ? li.price.unit_amount / 100 : 0,
      amount_total_cad: li.amount_total ? li.amount_total / 100 : 0,
      is_digital: md.is_digital === "true",
    };
  });

  const subtotal = round2((session.amount_subtotal || 0) / 100);
  const shipping = round2((session.shipping_cost?.amount_total || 0) / 100);
  const tax = round2((session.total_details?.amount_tax || 0) / 100);
  const total = round2((session.amount_total || 0) / 100);

  // Pull settings to snapshot the % values used at this moment in time.
  const { data: settings } = await sb.from("store_settings").select("*").eq("id", "singleton").maybeSingle();
  const splits = computeSplits({
    gross: subtotal,
    taxCollected: tax,
    settings: settings || {},
  });

  const shipping_address = session.shipping_details?.address || session.customer_details?.address || null;
  const shipping_province = shipping_address?.state || null;
  const shipping_country = shipping_address?.country || null;
  const containsDigital = lineItems.some(li => li.is_digital) || session.metadata?.contains_digital === "true";

  const row = {
    stripe_session_id: session.id,
    stripe_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : null,
    customer_email: session.customer_details?.email || session.customer_email || null,
    customer_name: session.customer_details?.name || session.shipping_details?.name || null,
    shipping_province,
    shipping_country,
    shipping_address: shipping_address ? shipping_address : null,
    subtotal_cad: subtotal,
    shipping_cad: shipping,
    tax_cad: tax,
    total_cad: total,
    gst_hst_owed_cad: splits.gst_hst_owed,
    income_tax_setaside_cad: splits.income_tax_setaside,
    savings_buffer_cad: splits.savings_buffer,
    net_takehome_cad: splits.net_takehome,
    income_tax_pct_at_order: settings?.income_tax_pct ?? null,
    savings_buffer_pct_at_order: settings?.savings_buffer_pct ?? null,
    line_items: lineItems,
    status: session.payment_status === "paid" ? "paid" : "pending",
    contains_digital: containsDigital,
    paid_at: session.payment_status === "paid" ? nowIso() : null,
    updated_at: nowIso(),
  };

  // Upsert by stripe_session_id (unique).
  const { error: upsertErr } = await sb.from("orders").upsert(row, { onConflict: "stripe_session_id" });
  if (upsertErr) throw upsertErr;

  // If Printful is enabled and order has physical items, push to Printful.
  if (settings?.printful_enabled && process.env.PRINTFUL_API_KEY) {
    const physicalItems = lineItems.filter(li => !li.is_digital);
    if (physicalItems.length > 0) {
      try {
        // Look up Printful sync_variant_id for each line item from products table.
        const ids = physicalItems.map(li => li.product_id).filter(Boolean);
        const { data: prods } = await sb.from("products").select("id, printful_variant_ids").in("id", ids);
        const variantById = new Map((prods || []).map(p => [p.id, p.printful_variant_ids]));

        const pfItems = physicalItems
          .map(li => {
            const variants = variantById.get(li.product_id);
            const firstVariant = Array.isArray(variants) && variants.length > 0 ? variants[0] : null;
            if (!firstVariant) return null;
            return {
              sync_variant_id: firstVariant.sync_variant_id || firstVariant.id,
              quantity: li.quantity,
            };
          })
          .filter(Boolean);

        if (pfItems.length > 0 && shipping_address) {
          const pfOrder = await createPrintfulOrder(
            {
              recipient: {
                name: row.customer_name,
                email: row.customer_email,
                address1: shipping_address.line1,
                address2: shipping_address.line2,
                city: shipping_address.city,
                state_code: shipping_address.state,
                country_code: shipping_address.country,
                zip: shipping_address.postal_code,
              },
              items: pfItems,
              external_id: session.id,
            },
            { confirm: false } // start in draft, owner confirms via Printful dashboard
          );
          await sb.from("orders").update({ printful_order_id: String(pfOrder?.id || ""), status: "fulfilling" }).eq("stripe_session_id", session.id);
        }
      } catch (pfErr) {
        console.error("[webhook] Printful order failed:", pfErr.message);
        // Don't fail the webhook \u2014 we still want Stripe to mark the event as received.
      }
    }
  }
}
