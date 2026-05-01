import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { P } from "../data/palette";
import { ScrollMorphText } from "../components/MorphText";
import { SEO } from "../components/SEO";
import { getOrder } from "../lib/api";

export const CheckoutSuccess = ({ onClearCart }) => {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sessionId) {
      setError("Missing session_id in URL");
      setLoading(false);
      return;
    }
    let cancelled = false;
    let attempts = 0;
    const tick = async () => {
      try {
        const d = await getOrder(sessionId);
        if (cancelled) return;
        setData(d);
        setLoading(false);
        // The webhook may not have fired yet — retry up to 6x to pick up the canonical order.
        if (d.pending_sync && attempts < 6) {
          attempts += 1;
          setTimeout(tick, 1500);
        }
      } catch (e) {
        if (cancelled) return;
        setError(e.message || "Could not load order");
        setLoading(false);
      }
    };
    tick();
    if (typeof onClearCart === "function") onClearCart();
    return () => { cancelled = true; };
  }, [sessionId, onClearCart]);

  return (
    <div style={{ minHeight: "100vh", paddingTop: 120, paddingBottom: 80 }}>
      <SEO title="Order Confirmed" description="Thank you for your order." path="/checkout/success" />
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 40px" }}>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 8, color: P.green, textTransform: "uppercase", marginBottom: 12 }}>
          <ScrollMorphText speed={70}>Confirmed</ScrollMorphText>
        </div>
        <h2 style={{ fontFamily: "'Georgia', serif", fontSize: 30, fontWeight: 400, color: P.ghost, margin: "0 0 24px 0" }}>
          <ScrollMorphText speed={90}>Thank You</ScrollMorphText>
        </h2>
        <div style={{ width: 60, height: 1, background: `linear-gradient(to right, ${P.green}, transparent)`, marginBottom: 32 }} />

        {loading && (
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: P.bone, opacity: 0.4, letterSpacing: 2 }}>Loading order details\u2026</div>
        )}

        {error && (
          <div style={{ background: `${P.red}11`, border: `1px solid ${P.red}33`, color: P.red, fontFamily: "'Courier New', monospace", fontSize: 11, padding: 12 }}>{error}</div>
        )}

        {data?.order && (
          <>
            <div style={{ fontFamily: "'Georgia', serif", fontSize: 14, color: P.bone, opacity: 0.7, lineHeight: 1.6, marginBottom: 22 }}>
              Your order has been received{data.order.customer_email ? <> and a confirmation has been sent to <span style={{ color: P.cyan }}>{data.order.customer_email}</span></> : ""}.
            </div>

            <div style={{ background: `${P.surface}55`, border: `1px solid ${P.steel}15`, padding: "18px 22px", marginBottom: 24 }}>
              <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 3, color: P.bone, opacity: 0.4, textTransform: "uppercase", marginBottom: 12 }}>Order Summary</div>
              {(data.order.line_items || []).map((li, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontFamily: "'Courier New', monospace", fontSize: 11, color: P.ghost }}>
                  <span>{li.title} {li.quantity > 1 && <span style={{ opacity: 0.5 }}>{"\u00D7"}{li.quantity}</span>}</span>
                  <span>${li.amount_total_cad}</span>
                </div>
              ))}
              <div style={{ borderTop: `1px solid ${P.steel}18`, marginTop: 10, paddingTop: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Courier New', monospace", fontSize: 10, color: P.bone, opacity: 0.6, padding: "2px 0" }}>
                  <span>Subtotal</span><span>${data.order.subtotal_cad}</span>
                </div>
                {Number(data.order.shipping_cad) > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Courier New', monospace", fontSize: 10, color: P.bone, opacity: 0.6, padding: "2px 0" }}>
                    <span>Shipping</span><span>${data.order.shipping_cad}</span>
                  </div>
                )}
                {Number(data.order.tax_cad) > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Courier New', monospace", fontSize: 10, color: P.bone, opacity: 0.6, padding: "2px 0" }}>
                    <span>GST/HST</span><span>${data.order.tax_cad}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontFamily: "'Courier New', monospace", fontSize: 14, fontWeight: 700, color: P.ghost }}>
                  <span>Total</span><span>${data.order.total_cad} <span style={{ fontSize: 9, opacity: 0.3 }}>CAD</span></span>
                </div>
              </div>
            </div>

            {data.downloads && data.downloads.length > 0 && (
              <div style={{ background: `${P.green}08`, border: `1px solid ${P.green}28`, padding: "18px 22px", marginBottom: 24 }}>
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 3, color: P.green, textTransform: "uppercase", marginBottom: 12 }}>Digital Downloads</div>
                {data.downloads.map((dl, i) => (
                  <a key={i} href={dl.url} download style={{ display: "block", padding: "10px 0", borderBottom: i < data.downloads.length - 1 ? `1px solid ${P.green}18` : "none", color: P.ghost, textDecoration: "none", fontFamily: "'Courier New', monospace", fontSize: 11 }}>
                    <span style={{ color: P.green, marginRight: 10 }}>{"\u2193"}</span>{dl.title}
                  </a>
                ))}
                <div style={{ marginTop: 12, fontFamily: "'Courier New', monospace", fontSize: 9, color: P.bone, opacity: 0.4, lineHeight: 1.5 }}>
                  Save these files \u2014 the links will also be emailed to you.
                </div>
              </div>
            )}

            {data.pending_sync && (
              <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: P.amber, opacity: 0.7, letterSpacing: 1, marginBottom: 24 }}>
                Sync in progress\u2026 final order details may take a few seconds to appear.
              </div>
            )}
          </>
        )}

        <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
          <Link to="/shop" style={{ flex: 1, textAlign: "center", textDecoration: "none", background: "transparent", border: `1px solid ${P.cyan}25`, color: P.ghost, fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 4, padding: "12px", textTransform: "uppercase" }}>
            Continue Shopping
          </Link>
          <Link to="/" style={{ flex: 1, textAlign: "center", textDecoration: "none", background: "transparent", border: `1px solid ${P.steel}15`, color: P.bone, fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 4, padding: "12px", textTransform: "uppercase" }}>
            Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
