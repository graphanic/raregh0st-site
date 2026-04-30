import { useState, useMemo } from "react";
import { P } from "../data/palette";
import { ScrollMorphText } from "../components/MorphText";
import { SEO } from "../components/SEO";
import { startCheckout } from "../lib/api";

// Cart items can come from two places:
//   1. Shop products (have a `slug` and DB `id`)            -> checkoutable via Stripe
//   2. Curated originals from /portfolio (have only piece id) -> show as "Inquire" for now
// We discriminate by the presence of `slug`.

export const Cart = ({ cart, removeFromCart }) => {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  // Group identical items (cart is a flat array w/ duplicates) into qty rows.
  const grouped = useMemo(() => {
    const map = new Map();
    cart.forEach((item, idx) => {
      const key = item.slug || `piece-${item.id}`;
      if (!map.has(key)) {
        map.set(key, { item, qty: 0, indices: [] });
      }
      const entry = map.get(key);
      entry.qty += 1;
      entry.indices.push(idx);
    });
    return Array.from(map.values());
  }, [cart]);

  const checkoutable = grouped.filter(g => g.item.slug);
  const inquiryOnly = grouped.filter(g => !g.item.slug);

  const subtotal = grouped.reduce((s, g) => s + Number(g.item.price || 0) * g.qty, 0);
  const checkoutSubtotal = checkoutable.reduce((s, g) => s + Number(g.item.price || 0) * g.qty, 0);

  const handleCheckout = async () => {
    if (checkoutable.length === 0) {
      setError("Add at least one shop item before checking out.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const items = checkoutable.map(g => ({ product_id: g.item.id, quantity: g.qty }));
      const { url } = await startCheckout(items);
      if (!url) throw new Error("No checkout URL returned");
      window.location.href = url; // redirect to Stripe Checkout
    } catch (e) {
      setError(e.message || "Checkout failed");
      setBusy(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", paddingTop: 120, paddingBottom: 80 }}>
      <SEO title="Cart" description="Your RareGh0st cart." path="/cart" />
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 40px" }}>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 8, color: P.amber, textTransform: "uppercase", marginBottom: 12 }}>
          <ScrollMorphText speed={70}>Your Selection</ScrollMorphText>
        </div>
        <h2 style={{ fontFamily: "'Georgia', serif", fontSize: 30, fontWeight: 400, color: P.ghost, margin: "0 0 36px 0" }}>
          <ScrollMorphText speed={90}>Cart</ScrollMorphText>
        </h2>

        {cart.length === 0 ? (
          <div style={{ fontFamily: "'Georgia', serif", fontSize: 13, color: P.bone, opacity: 0.3, padding: "44px 0", textAlign: "center" }}>
            Your cart is empty. The portfolio awaits.
          </div>
        ) : (
          <>
            {grouped.map((g, gi) => {
              const isCheckoutable = !!g.item.slug;
              return (
                <div key={gi} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: `1px solid ${P.steel}12`, opacity: isCheckoutable ? 1 : 0.65 }}>
                  <div>
                    <div style={{ fontFamily: "'Georgia', serif", fontSize: 13, color: P.ghost }}>
                      {g.item.title}
                      {g.qty > 1 && <span style={{ marginLeft: 8, fontFamily: "'Courier New', monospace", fontSize: 10, color: P.cyan, opacity: 0.6 }}>{"\u00D7"}{g.qty}</span>}
                    </div>
                    {!isCheckoutable && (
                      <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 2, color: P.amber, opacity: 0.7, marginTop: 4 }}>
                        ORIGINAL ARTWORK \u00B7 INQUIRE BY EMAIL
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <span style={{ fontFamily: "'Courier New', monospace", fontSize: 14, color: P.ghost }}>${Number(g.item.price || 0) * g.qty}</span>
                    <button
                      onClick={() => g.indices.slice().reverse().forEach(i => removeFromCart(i))}
                      style={{ background: "none", border: "none", color: P.red, fontFamily: "'Courier New', monospace", fontSize: 9, cursor: "pointer", opacity: 0.4, letterSpacing: 2 }}
                    >REMOVE</button>
                  </div>
                </div>
              );
            })}

            <div style={{ display: "flex", justifyContent: "space-between", padding: "22px 0", marginTop: 12, borderTop: `1px solid ${P.cyan}15` }}>
              <span style={{ fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 4, color: P.bone, opacity: 0.4, textTransform: "uppercase" }}>
                Subtotal
              </span>
              <span style={{ fontFamily: "'Courier New', monospace", fontSize: 22, fontWeight: 700, color: P.ghost }}>
                ${subtotal}<span style={{ fontSize: 10, opacity: 0.3, marginLeft: 3 }}>CAD</span>
              </span>
            </div>

            {inquiryOnly.length > 0 && checkoutable.length > 0 && (
              <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: P.amber, opacity: 0.8, lineHeight: 1.6, padding: "10px 0", letterSpacing: 1 }}>
                {checkoutable.length} item(s) ready for checkout. {inquiryOnly.length} original artwork(s) require direct inquiry \u2014 these won&apos;t be charged.
              </div>
            )}

            {error && (
              <div style={{ background: `${P.red}11`, border: `1px solid ${P.red}33`, color: P.red, fontFamily: "'Courier New', monospace", fontSize: 11, padding: 12, marginTop: 12 }}>
                {error}
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={busy || checkoutable.length === 0}
              style={{
                width: "100%", marginTop: 12,
                background: busy ? `${P.cyan}05` : `${P.cyan}0e`,
                border: `1px solid ${P.cyan}${busy ? "10" : "20"}`,
                color: busy ? P.bone : P.ghost,
                fontFamily: "'Courier New', monospace", fontSize: 11, letterSpacing: 6,
                padding: "14px", cursor: busy || checkoutable.length === 0 ? "not-allowed" : "pointer",
                textTransform: "uppercase", opacity: checkoutable.length === 0 ? 0.4 : 1,
                transition: "all 0.3s",
              }}
            >
              {busy ? "Redirecting to Stripe\u2026" : checkoutable.length === 0 ? "No checkoutable items" : `Checkout \u00B7 $${checkoutSubtotal} CAD`}
            </button>

            <div style={{ marginTop: 18, fontFamily: "'Courier New', monospace", fontSize: 9, color: P.bone, opacity: 0.3, lineHeight: 1.6, letterSpacing: 1 }}>
              Secure checkout via Stripe. Shipping and applicable taxes calculated on the next step.
            </div>
          </>
        )}
      </div>
    </div>
  );
};
