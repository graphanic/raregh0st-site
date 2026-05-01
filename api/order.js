import Stripe from "stripe";
import { supabaseAdmin } from "./_lib/supabase.js";

// GET /api/order?session_id=cs_test_xxx
// Used by the checkout success page to fetch order details.
// If the order isn't yet in our DB (webhook racing), we verify with Stripe and confirm payment.

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const sessionId = req.query.session_id;
  if (!sessionId) return res.status(400).json({ error: "Missing session_id" });

  try {
    const sb = supabaseAdmin();
    const { data: order, error } = await sb
      .from("orders")
      .select("id, stripe_session_id, customer_email, customer_name, line_items, subtotal_cad, shipping_cad, tax_cad, total_cad, status, contains_digital, paid_at, created_at")
      .eq("stripe_session_id", sessionId)
      .maybeSingle();

    if (error) throw error;

    if (order) {
      // If order has digital items, attach the digital download list (blob URLs).
      let downloads = [];
      if (order.contains_digital) {
        const slugs = (order.line_items || []).filter(li => li.is_digital).map(li => li.slug).filter(Boolean);
        if (slugs.length > 0) {
          const { data: digitals } = await sb
            .from("products")
            .select("slug, title, digital_blob_url")
            .in("slug", slugs);
          downloads = (digitals || [])
            .filter(d => !!d.digital_blob_url)
            .map(d => ({ title: d.title, url: d.digital_blob_url }));
        }
      }
      return res.status(200).json({ order, downloads });
    }

    // Order not in our DB yet \u2014 webhook may not have fired. Verify directly with Stripe.
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (stripeKey) {
      const stripe = new Stripe(stripeKey);
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session?.payment_status === "paid") {
        return res.status(200).json({
          order: {
            stripe_session_id: session.id,
            customer_email: session.customer_details?.email,
            customer_name: session.customer_details?.name,
            line_items: [],
            subtotal_cad: (session.amount_subtotal || 0) / 100,
            shipping_cad: (session.shipping_cost?.amount_total || 0) / 100,
            tax_cad: (session.total_details?.amount_tax || 0) / 100,
            total_cad: (session.amount_total || 0) / 100,
            status: "paid",
            paid_at: new Date().toISOString(),
          },
          downloads: [],
          pending_sync: true,
        });
      }
    }

    return res.status(404).json({ error: "Order not found" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
