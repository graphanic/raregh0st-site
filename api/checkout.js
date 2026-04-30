import Stripe from "stripe";
import { supabaseAdmin } from "./_lib/supabase.js";

// POST /api/checkout
// Body: { items: [{ product_id, quantity }] }
// Returns: { url } — Stripe Checkout Session URL to redirect the customer to.

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) return res.status(500).json({ error: "Stripe not configured" });
    const stripe = new Stripe(stripeKey);

    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const items = Array.isArray(body.items) ? body.items : [];
    if (items.length === 0) return res.status(400).json({ error: "Cart is empty" });

    const sb = supabaseAdmin();

    // Confirm shop is live before allowing checkout.
    const { data: settings } = await sb.from("store_settings").select("shop_live").eq("id", "singleton").maybeSingle();
    if (!settings?.shop_live) {
      return res.status(403).json({ error: "Shop is not currently accepting orders" });
    }

    // Look up products from DB so we use server-side prices (never trust client prices).
    const ids = items.map(it => Number(it.product_id)).filter(Boolean);
    if (ids.length === 0) return res.status(400).json({ error: "Invalid items" });

    const { data: products, error: pe } = await sb
      .from("products")
      .select("id, slug, title, price_cad, image_url, is_digital, category")
      .in("id", ids)
      .eq("is_active", true);
    if (pe) throw pe;

    const byId = new Map((products || []).map(p => [p.id, p]));
    let containsDigital = false;
    let containsPhysical = false;

    const line_items = items.map(it => {
      const p = byId.get(Number(it.product_id));
      if (!p) throw new Error(`Product ${it.product_id} not found or inactive`);
      const qty = Math.max(1, Math.min(99, Number(it.quantity) || 1));
      if (p.is_digital) containsDigital = true; else containsPhysical = true;
      return {
        quantity: qty,
        price_data: {
          currency: "cad",
          unit_amount: Math.round(Number(p.price_cad) * 100),
          product_data: {
            name: p.title,
            metadata: { product_id: String(p.id), slug: p.slug, is_digital: String(p.is_digital) },
            images: p.image_url ? [p.image_url] : [],
          },
        },
      };
    });

    const origin = req.headers.origin || `https://${req.headers.host}` || "";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      // Only collect shipping for physical orders.
      ...(containsPhysical
        ? {
            shipping_address_collection: { allowed_countries: ["CA", "US"] },
            // Flat-rate placeholder shipping. Owner can swap to Printful live rates later via admin settings.
            shipping_options: [
              {
                shipping_rate_data: {
                  type: "fixed_amount",
                  fixed_amount: { amount: 1200, currency: "cad" },
                  display_name: "Standard shipping",
                  delivery_estimate: { minimum: { unit: "business_day", value: 5 }, maximum: { unit: "business_day", value: 14 } },
                },
              },
            ],
          }
        : {}),
      // automatic_tax: { enabled: false }  // enable once you register for GST/HST and configure Stripe Tax
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
      metadata: {
        contains_digital: String(containsDigital),
        contains_physical: String(containsPhysical),
      },
    });

    return res.status(200).json({ url: session.url, id: session.id });
  } catch (err) {
    console.error("[checkout] error", err);
    return res.status(500).json({ error: err.message });
  }
}
