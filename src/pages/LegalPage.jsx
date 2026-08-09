import { useNavigate } from "react-router-dom";
import { P } from "../data/palette";
import { SEO } from "../components/SEO";

const PAGES = {
  privacy: {
    title: "Privacy Policy", updated: "August 2026",
    sections: [
      { h: "Information We Collect", p: "When you visit raregh0st.studio, we may collect information you provide directly, including contact and commission-form details, newsletter signups, order information, and shipping details required to complete a purchase. We do not sell, trade, or rent your personal information." },
      { h: "How We Use Your Information", p: "We use this information to respond to inquiries, evaluate commission requests, process and fulfill orders, provide order updates, send communications you have requested, prevent abuse, and improve the website." },
      { h: "Cookies & Analytics", p: "We may use privacy-respecting analytics to understand how visitors interact with our site. We do not use invasive tracking or sell data to advertisers." },
      { h: "Payments", p: "Payments are processed by Stripe. 1RareGh0st does not directly store complete payment-card numbers. Stripe receives and processes payment information under its own privacy policy." },
      { h: "Third-Party Services", p: "Physical orders may be fulfilled and shipped by Printful. Store, order, and submission records are maintained through Supabase. These providers process only the information needed to perform their services and operate under their own privacy policies." },
      { h: "Your Rights", p: "You may request access to, correction of, or deletion of your personal data at any time by contacting us through our contact form or emailing hello@raregh0st.com." },
      { h: "Changes", p: "We may update this policy periodically. Changes will be posted on this page with an updated revision date." },
    ]
  },
  terms: {
    title: "Terms of Service", updated: "August 2026",
    sections: [
      { h: "Acceptance of Terms", p: "By accessing and using raregh0st.studio, you agree to be bound by these terms. If you do not agree, please do not use this website." },
      { h: "Intellectual Property", p: "All artwork, designs, images, text, and other content on this website are the intellectual property of 1RareGh0st unless otherwise stated. You may not reproduce, distribute, or create derivative works without explicit written permission." },
      { h: "Purchases", p: "Prices are shown in Canadian dollars unless stated otherwise. Payments are processed through Stripe. An order is accepted only after payment succeeds and the store confirms the product is available for fulfillment." },
      { h: "Print-on-Demand Products", p: "Physical products are produced and shipped by Printful on behalf of 1RareGh0st. Product appearance may vary slightly from an on-screen preview because of display settings, print placement, and the manufacturing process." },
      { h: "Commissioned Work", p: "Submitting a commission inquiry does not create a booking. Scope, price, schedule, review stages, final deliverables, and usage rights must be agreed in writing before work begins. Unless the written agreement says otherwise, the base commission deliverable is a high-resolution digital artwork licensed for the client's personal use." },
      { h: "Digital Products & Courses", p: "Digital assets and courses are licensed for personal and commercial use as specified in each product's description. Redistribution of digital products is prohibited." },
      { h: "User Conduct", p: "You agree not to use this site for any unlawful purpose or in any way that could damage, disable, or impair the site's operation." },
      { h: "Limitation of Liability", p: "1RareGh0st is provided \"as is\" without warranties of any kind. We are not liable for any damages arising from your use of this website or purchase of products." },
    ]
  },
  shipping: {
    title: "Shipping & Returns", updated: "August 2026",
    sections: [
      { h: "Production & Shipping", p: "Physical products are made to order through Printful. Most products are produced within 2–5 business days before shipping, but production and delivery estimates can change with product type, availability, destination, order volume, and carrier conditions." },
      { h: "Destinations & Costs", p: "The current checkout accepts physical-product orders shipping to Canada and the United States. Available shipping methods, costs, and delivery estimates are displayed during checkout and are estimates rather than guarantees." },
      { h: "Order Tracking", p: "You will receive tracking information by email after a physical order ships. Contact the studio if the tracking appears incorrect or the shipment does not arrive within the carrier's estimated window." },
      { h: "Damage, Defects, or Wrong Items", p: "If an item arrives damaged, misprinted, defective, or incorrect, contact us within 30 days of delivery with your order number, a description of the issue, and clear photographs. Eligible claims will be reviewed for a replacement or refund." },
      { h: "Returns & Exchanges", p: "Because physical products are made to order, we generally cannot accept returns or exchanges for buyer's remorse, an incorrect size choice, or a change of mind, except where applicable law requires otherwise. Review the product details and sizing information before ordering." },
      { h: "Lost Shipments", p: "Please report a package that appears lost within 30 days of the estimated delivery date so that the shipment can be investigated." },
      { h: "Digital Products", p: "All digital product sales are final. Due to the nature of downloadable content, refunds are not available for digital assets or course enrollments once access has been granted." },
      { h: "Contact Us", p: "For any shipping or returns questions, reach out through our contact page or email hello@raregh0st.com. We aim to respond within 2-3 business days." },
    ]
  },
};

export const LegalPage = ({ page }) => {
  const navigate = useNavigate();
  const mono = { fontFamily: "'Courier New', monospace" };
  const body = { ...mono, fontSize: 12, color: P.bone, opacity: 0.6, lineHeight: 1.8 };
  const heading = { fontFamily: "'Georgia', serif", fontSize: 18, color: P.ghost, margin: "32px 0 12px" };
  const sub = { ...mono, fontSize: 13, color: P.ghost, margin: "24px 0 8px", letterSpacing: 1 };

  const content = PAGES[page];
  if (!content) return null;

  return (
    <div style={{ minHeight: "100vh", paddingTop: 120, paddingBottom: 80 }}>
      <SEO title={content.title} description={`${content.title} for 1RareGh0st.`} path={`/${page}`} />
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 40px" }}>
        <button onClick={() => navigate("/")} style={{ background: "none", border: "none", color: P.bone, ...mono, fontSize: 10, letterSpacing: 3, cursor: "pointer", opacity: 0.3, marginBottom: 32 }}>{"<-"} BACK</button>
        <h2 style={heading}>{content.title}</h2>
        <div style={{ ...mono, fontSize: 9, color: P.bone, opacity: 0.25, letterSpacing: 3, marginBottom: 40 }}>LAST UPDATED: {content.updated.toUpperCase()}</div>
        {content.sections.map(({ h, p }, i) => (
          <div key={i}>
            <h3 style={sub}>{h}</h3>
            <p style={body}>{p}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
