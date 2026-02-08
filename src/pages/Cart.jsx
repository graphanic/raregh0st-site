import { P } from "../data/palette";
import { ScrollMorphText } from "../components/MorphText";
import { SEO } from "../components/SEO";

export const Cart = ({ cart, removeFromCart }) => {
  const total = cart.reduce((s, i) => s + i.price, 0);
  return (
    <div style={{ minHeight: "100vh", paddingTop: 120, paddingBottom: 80 }}>
      <SEO title="Cart" description="Your RareGh0st cart." path="/cart" />
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 40px" }}>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 8, color: P.amber, textTransform: "uppercase", marginBottom: 12 }}><ScrollMorphText speed={70}>Your Selection</ScrollMorphText></div>
        <h2 style={{ fontFamily: "'Georgia', serif", fontSize: 30, fontWeight: 400, color: P.ghost, margin: "0 0 36px 0" }}><ScrollMorphText speed={90}>Cart</ScrollMorphText></h2>
        {cart.length === 0 ? (
          <div style={{ fontFamily: "'Georgia', serif", fontSize: 13, color: P.bone, opacity: 0.3, padding: "44px 0", textAlign: "center" }}>Your cart is empty. The portfolio awaits.</div>
        ) : (
          <>
            {cart.map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: `1px solid ${P.steel}12` }}>
                <div style={{ fontFamily: "'Georgia', serif", fontSize: 13, color: P.ghost }}>{item.title}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <span style={{ fontFamily: "'Courier New', monospace", fontSize: 14, color: P.ghost }}>${item.price}</span>
                  <button onClick={() => removeFromCart(i)} style={{ background: "none", border: "none", color: P.red, fontFamily: "'Courier New', monospace", fontSize: 9, cursor: "pointer", opacity: 0.4, letterSpacing: 2 }}>REMOVE</button>
                </div>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "22px 0", marginTop: 12, borderTop: `1px solid ${P.cyan}15` }}>
              <span style={{ fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 4, color: P.bone, opacity: 0.4, textTransform: "uppercase" }}>Total</span>
              <span style={{ fontFamily: "'Courier New', monospace", fontSize: 22, fontWeight: 700, color: P.ghost }}>${total}<span style={{ fontSize: 10, opacity: 0.3, marginLeft: 3 }}>CAD</span></span>
            </div>
            <button style={{ width: "100%", marginTop: 8, background: `${P.cyan}0e`, border: `1px solid ${P.cyan}20`, color: P.ghost, fontFamily: "'Courier New', monospace", fontSize: 11, letterSpacing: 6, padding: "14px", cursor: "pointer", textTransform: "uppercase" }}>Checkout</button>
          </>
        )}
      </div>
    </div>
  );
};
