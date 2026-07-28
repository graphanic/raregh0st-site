import { useNavigate } from "react-router-dom";
import { P } from "../data/palette";
import { SEO } from "../components/SEO";

const PAGES = {
  privacy: {
    title: "Privacy Policy", updated: "February 2026",
    sections: [
      { h: "Information We Collect", p: "When you visit raregh0st.com, we may collect information you provide directly -- such as your name and email when using our contact form or subscribing to our newsletter. We do not sell, trade, or rent your personal information to third parties." },
      { h: "How We Use Your Information", p: "Your information is used solely to respond to inquiries, fulfill orders through our print-on-demand partners (Printful/Shopify), send newsletter communications you've opted into, and improve our website experience." },
      { h: "Cookies & Analytics", p: "We may use privacy-respecting analytics to understand how visitors interact with our site. We do not use invasive tracking or sell data to advertisers." },
      { h: "Third-Party Services", p: "Orders are fulfilled through Printful and processed via Shopify. These services have their own privacy policies. Newsletter services (when connected) will also process your email under their respective policies." },
      { h: "Your Rights", p: "You may request access to, correction of, or deletion of your personal data at any time by contacting us through our contact form or emailing hello@raregh0st.com." },
      { h: "Changes", p: "We may update this policy periodically. Changes will be posted on this page with an updated revision date." },
    ]
  },
  terms: {
    title: "Terms of Service", updated: "February 2026",
    sections: [
      { h: "Acceptance of Terms", p: "By accessing and using raregh0st.com, you agree to be bound by these terms. If you do not agree, please do not use this website." },
      { h: "Intellectual Property", p: "All artwork, designs, images, text, and other content on this website are the intellectual property of 1RareGh0st unless otherwise stated. You may not reproduce, distribute, or create derivative works without explicit written permission." },
      { h: "Print-on-Demand Products", p: "Physical products are produced and shipped by our print-on-demand partner (Printful) through Shopify. Product quality, printing, and shipping are handled by these partners according to their respective service terms." },
      { h: "Digital Products & Courses", p: "Digital assets and courses are licensed for personal and commercial use as specified in each product's description. Redistribution of digital products is prohibited." },
      { h: "User Conduct", p: "You agree not to use this site for any unlawful purpose or in any way that could damage, disable, or impair the site's operation." },
      { h: "Limitation of Liability", p: "1RareGh0st is provided \"as is\" without warranties of any kind. We are not liable for any damages arising from your use of this website or purchase of products." },
    ]
  },
  shipping: {
    title: "Shipping & Returns", updated: "February 2026",
    sections: [
      { h: "Production & Shipping", p: "All physical products are made-to-order through our print-on-demand system. Production typically takes 2-5 business days. Shipping times vary by location." },
      { h: "Shipping Costs", p: "Shipping costs are calculated at checkout based on your location and order size. We aim to keep shipping affordable and may offer free shipping promotions periodically." },
      { h: "Order Tracking", p: "You will receive a tracking number via email once your order has shipped. If you don't receive tracking information within 7 business days, please contact us." },
      { h: "Returns & Exchanges", p: "Due to the made-to-order nature of our products, we cannot accept returns for buyer's remorse. However, if your product arrives damaged, defective, or is the wrong item, we will gladly send a replacement or issue a refund. Please contact us within 14 days of delivery with photos of the issue." },
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
