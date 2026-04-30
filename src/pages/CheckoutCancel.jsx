import { Link } from "react-router-dom";
import { P } from "../data/palette";
import { ScrollMorphText } from "../components/MorphText";
import { SEO } from "../components/SEO";

export const CheckoutCancel = () => (
  <div style={{ minHeight: "100vh", paddingTop: 120, paddingBottom: 80 }}>
    <SEO title="Checkout Canceled" description="Your checkout was canceled. Your cart is still here." path="/checkout/cancel" />
    <div style={{ maxWidth: 580, margin: "0 auto", padding: "0 40px", textAlign: "center" }}>
      <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 8, color: P.amber, textTransform: "uppercase", marginBottom: 12 }}>
        <ScrollMorphText speed={70}>Canceled</ScrollMorphText>
      </div>
      <h2 style={{ fontFamily: "'Georgia', serif", fontSize: 30, fontWeight: 400, color: P.ghost, margin: "0 0 24px 0" }}>
        <ScrollMorphText speed={90}>Checkout Canceled</ScrollMorphText>
      </h2>
      <div style={{ width: 60, height: 1, background: `linear-gradient(to right, transparent, ${P.amber}, transparent)`, margin: "0 auto 32px" }} />
      <div style={{ fontFamily: "'Georgia', serif", fontSize: 14, color: P.bone, opacity: 0.6, lineHeight: 1.7, marginBottom: 32 }}>
        No charge was made. Your cart is still saved \u2014 take your time.
      </div>
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <Link to="/cart" style={{ textDecoration: "none", background: `${P.cyan}0e`, border: `1px solid ${P.cyan}25`, color: P.ghost, fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 4, padding: "12px 24px", textTransform: "uppercase" }}>
          Return to Cart
        </Link>
        <Link to="/shop" style={{ textDecoration: "none", background: "transparent", border: `1px solid ${P.steel}15`, color: P.bone, fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 4, padding: "12px 24px", textTransform: "uppercase" }}>
          Keep Browsing
        </Link>
      </div>
    </div>
  </div>
);

export default CheckoutCancel;
