import { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { P } from "../data/palette";
import { SHOP_CATEGORIES } from "../data/shop";
import { HoverMorphText, ScrollMorphText } from "../components/MorphText";
import { SEO } from "../components/SEO";
import { getProducts, getSettings } from "../lib/api";
import { SHOP_COPY, SEO_COPY } from "../data/siteCopy";

// Map DB row -> shape the existing card UI expects.
function mapProduct(row) {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    subcategory: row.subcategory,
    price: Number(row.price_cad),
    artwork: row.artwork,
    tags: row.tags || [],
    colors: (row.colors || []).map(name => P[name] || P.cyan), // colors are stored as palette token names
    description: row.description || "",
    sizes: row.sizes,
    duration: row.duration,
    image: row.image_url,
    is_digital: row.is_digital,
    slug: row.slug,
  };
}

const mono = { fontFamily: "'Courier New', monospace" };

function ProductDetail({ product, onClose, onAdd }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const cat = SHOP_CATEGORIES.find((item) => item.id === product.category);
  const accent = product.colors?.[0] || cat?.color || P.cyan;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll("button, a[href], input, select, textarea, [tabindex]:not([tabindex='-1'])")]
        .filter((element) => !element.disabled);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  const isDigital = product.is_digital || product.category === "digital" || product.category === "courses";

  return createPortal(
    <div role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }} style={{ position: "fixed", inset: 0, zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: `${P.abyss}f2`, backdropFilter: "blur(16px)", animation: "fadeSlideIn 0.25s ease both" }}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={`product-title-${product.id}`} className="product-detail-grid" style={{ position: "relative", width: "min(980px, 100%)", maxHeight: "min(780px, 92vh)", overflowY: "auto", display: "grid", gridTemplateColumns: "minmax(0, 1.05fr) minmax(320px, 0.95fr)", background: `linear-gradient(145deg, ${P.void}, ${P.surface})`, border: `1px solid ${accent}35`, boxShadow: `0 0 70px ${accent}18` }}>
        <button ref={closeRef} type="button" onClick={onClose} aria-label="Close product details" style={{ position: "absolute", top: 14, right: 14, zIndex: 4, width: 38, height: 38, background: `${P.abyss}dd`, border: `1px solid ${P.steel}45`, color: P.ghost, cursor: "pointer", fontSize: 17 }}>×</button>

        <div style={{ minHeight: 360, background: P.abyss, position: "relative", overflow: "hidden" }}>
          {product.image ? (
            <img src={product.image} alt={product.title} style={{ width: "100%", height: "100%", minHeight: 360, objectFit: "cover", display: "block" }} />
          ) : (
            <div aria-hidden style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 40%, ${accent}18, transparent 55%), linear-gradient(140deg, ${P.abyss}, ${P.surface})` }} />
          )}
          <div aria-hidden style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${P.abyss}aa, transparent 45%)` }} />
        </div>

        <div style={{ padding: "54px 38px 38px", display: "flex", flexDirection: "column" }}>
          <div style={{ ...mono, fontSize: 8, letterSpacing: 4, color: accent, textTransform: "uppercase", marginBottom: 12 }}>
            {cat?.label || product.category}{product.subcategory ? ` · ${product.subcategory}` : ""}
          </div>
          <h2 id={`product-title-${product.id}`} style={{ fontFamily: "'Georgia', serif", fontSize: 29, fontWeight: 400, color: P.ghost, margin: "0 0 12px", lineHeight: 1.18 }}>{product.title}</h2>
          {product.artwork && <div style={{ ...mono, fontSize: 9, letterSpacing: 2, color: P.bone, opacity: 0.38, marginBottom: 22 }}>Featuring artwork: {product.artwork}</div>}
          <p style={{ fontFamily: "'Georgia', serif", fontSize: 14, lineHeight: 1.75, color: P.bone, opacity: 0.68, margin: "0 0 24px" }}>{product.description || "An art-led release from the 1RareGh0st studio."}</p>

          <div style={{ display: "grid", gap: 9, padding: "18px 0", borderTop: `1px solid ${P.steel}18`, borderBottom: `1px solid ${P.steel}18` }}>
            {product.sizes && <DetailRow label="Available" value={product.sizes} />}
            {product.duration && <DetailRow label="Duration" value={product.duration} />}
            <DetailRow label="Type" value={isDigital ? "Digital release" : "Made-to-order physical product"} />
            {!isDigital && <DetailRow label="Ships to" value="Canada and the United States" />}
          </div>

          <p style={{ ...mono, fontSize: 9, lineHeight: 1.7, color: P.bone, opacity: 0.38, margin: "18px 0 24px" }}>
            {isDigital
              ? "Access and delivery details are confirmed after successful checkout. Any usage rights are stated in the product description."
              : SHOP_COPY.fulfillment}
          </p>

          <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, flexWrap: "wrap" }}>
            <span style={{ ...mono, fontSize: 23, color: P.ghost }}>${product.price}<span style={{ fontSize: 9, opacity: 0.35, marginLeft: 4 }}>CAD</span></span>
            <button type="button" onClick={() => { onAdd(product); onClose(); }} style={{ ...mono, fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: P.abyss, background: accent, border: `1px solid ${accent}`, padding: "14px 22px", cursor: "pointer" }}>
              {product.category === "courses" ? "Enroll" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function DetailRow({ label, value }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "86px 1fr", gap: 12 }}>
      <span style={{ ...mono, fontSize: 8, letterSpacing: 2, color: P.bone, opacity: 0.3, textTransform: "uppercase" }}>{label}</span>
      <span style={{ fontFamily: "'Georgia', serif", fontSize: 11, color: P.bone, opacity: 0.58 }}>{value}</span>
    </div>
  );
}

const ShopCard = ({ product, onAdd, onOpen }) => {
  const [h, setH] = useState(false);
  const cat = SHOP_CATEGORIES.find(c => c.id === product.category);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
      background: h ? `${P.surface}88` : `${P.surface}33`,
      border: `1px solid ${h ? product.colors[0] + "30" : P.steel + "10"}`,
      borderRadius: 3, overflow: "hidden", transition: "all 0.4s",
      display: "flex", flexDirection: "column",
    }}>
      <div style={{ aspectRatio: "4/3", background: product.image ? `${P.abyss}` : `linear-gradient(${135 + product.id * 7}deg, ${P.abyss}, ${product.colors[0]}0a, ${product.colors[1] || product.colors[0]}0c, ${P.abyss})`, position: "relative", overflow: "hidden" }}>
        {product.image && <img src={product.image} alt={product.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: h ? 1 : 0.85, transition: "opacity 0.3s" }} />}
        <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.004) 3px, rgba(255,255,255,0.004) 6px)" }} />
        <div style={{ position: "absolute", top: 10, left: 10, fontFamily: "'Courier New', monospace", fontSize: 8, letterSpacing: 3, color: cat?.color || P.bone, opacity: 0.7, textTransform: "uppercase", padding: "3px 8px", border: `1px solid ${cat?.color || P.bone}30`, background: `${P.abyss}aa` }}>{product.subcategory}</div>
        {product.artwork && <div style={{ position: "absolute", bottom: 10, left: 10, fontFamily: "'Courier New', monospace", fontSize: 7, letterSpacing: 2, color: P.bone, opacity: 0.4, textTransform: "uppercase" }}>{"\u2726"} {product.artwork}</div>}
        <div style={{ position: "absolute", bottom: 10, right: 10, fontFamily: "'Courier New', monospace", fontSize: 20, fontWeight: 700, color: product.colors[0], opacity: h ? 0.12 : 0.04, transition: "opacity 0.4s" }}>{String(product.id).slice(-2)}</div>
      </div>
      <div style={{ padding: "14px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ fontFamily: "'Georgia', serif", fontSize: 13, color: h ? product.colors[0] : P.ghost, transition: "color 0.3s", lineHeight: 1.4, marginBottom: 6 }}><HoverMorphText>{product.title}</HoverMorphText></div>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: P.bone, opacity: 0.38, lineHeight: 1.6, marginBottom: 12, flex: 1 }}>{product.description.slice(0, 120)}{product.description.length > 120 ? "\u2026" : ""}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "'Courier New', monospace", fontSize: 16, fontWeight: 700, color: P.ghost }}>${product.price}<span style={{ fontSize: 9, opacity: 0.3, marginLeft: 2 }}>CAD</span></span>
          {product.sizes && <span style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: P.bone, opacity: 0.25 }}>{product.sizes}</span>}
          {product.duration && <span style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: P.green, opacity: 0.5 }}>{product.duration}</span>}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, marginTop: 12 }}>
          <button type="button" onClick={() => onOpen(product)} style={{ background: "transparent", border: `1px solid ${P.steel}25`, color: P.bone, fontFamily: "'Courier New', monospace", fontSize: 8, letterSpacing: 2, padding: "9px 7px", cursor: "pointer", textTransform: "uppercase", opacity: h ? 0.8 : 0.48, transition: "all 0.3s" }}>Explore Details</button>
          <button type="button" onClick={() => onAdd(product)} style={{ background: h ? `${product.colors[0]}12` : "transparent", border: `1px solid ${h ? product.colors[0] + "40" : P.steel + "18"}`, color: h ? product.colors[0] : P.bone, fontFamily: "'Courier New', monospace", fontSize: 8, letterSpacing: 2, padding: "9px 7px", cursor: "pointer", textTransform: "uppercase", opacity: h ? 1 : 0.48, transition: "all 0.3s" }}>{product.category === "courses" ? "Enroll" : "Add to Cart"}</button>
        </div>
      </div>
    </div>
  );
};

const ComingSoonScreen = ({ announcement }) => (
  <div style={{ minHeight: "100vh", paddingTop: 120, paddingBottom: 80 }}>
    <SEO title="Shop — Opening Soon" description={SEO_COPY.shop} path="/shop" />
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 40px", textAlign: "center" }}>
      <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 8, color: P.amber, textTransform: "uppercase", marginBottom: 16 }}>
        <ScrollMorphText speed={70}>Opening Soon</ScrollMorphText>
      </div>
      <h2 style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 400, color: P.ghost, margin: "0 0 24px 0" }}>
        <ScrollMorphText speed={90}>The Shop</ScrollMorphText>
      </h2>
      <div style={{ width: 60, height: 1, background: `linear-gradient(to right, transparent, ${P.amber}, transparent)`, margin: "0 auto 32px" }} />
      <div style={{ fontFamily: "'Georgia', serif", fontSize: 15, color: P.bone, opacity: 0.5, lineHeight: 1.7, maxWidth: 560, margin: "0 auto" }}>
        {announcement || "The first art-led releases are being prepared. Join the signal for new work, selected print editions, and the moment the shop opens."}
      </div>
    </div>
  </div>
);

const Shop = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shopLive, setShopLive] = useState(true);
  const [announcement, setAnnouncement] = useState("");
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [itemFilter, setItemFilter] = useState(null);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const previousFocusRef = useRef(null);

  const openProduct = (product) => {
    previousFocusRef.current = document.activeElement;
    setSelectedProduct(product);
  };

  const closeProduct = () => {
    setSelectedProduct(null);
    window.requestAnimationFrame(() => previousFocusRef.current?.focus?.());
  };

  useEffect(() => {
    let live = true;
    Promise.all([getSettings().catch(() => ({})), getProducts().catch(() => ({ products: [] }))])
      .then(([s, p]) => {
        if (!live) return;
        setShopLive(s.shop_live ?? false);
        setAnnouncement(s.shop_announcement || "");
        setProducts((p.products || []).map(mapProduct));
        setLoading(false);
      })
      .catch(err => { if (live) { setError(err.message); setLoading(false); } });
    return () => { live = false; };
  }, []);

  const filtered = useMemo(() => products.filter(p => {
    if (category !== "all" && p.category !== category) return false;
    if (itemFilter && p.subcategory !== itemFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.tags.some(t => String(t).toLowerCase().includes(q)) || (p.artwork && p.artwork.toLowerCase().includes(q));
    }
    return true;
  }), [products, category, search, itemFilter]);

  const visibleItems = useMemo(() => {
    const all = [...new Set(products.map(p => p.subcategory).filter(Boolean))];
    return category === "all" ? all : [...new Set(products.filter(p => p.category === category).map(p => p.subcategory).filter(Boolean))];
  }, [products, category]);

  if (!loading && !shopLive) return <ComingSoonScreen announcement={announcement} />;

  return (
    <div style={{ minHeight: "100vh", paddingTop: 120, paddingBottom: 80 }}>
      <SEO title="Shop" description={SEO_COPY.shop} path="/shop" />
      <div className="page-shell" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 6, color: P.magenta, textTransform: "uppercase", marginBottom: 12 }}><ScrollMorphText speed={75}>{SHOP_COPY.kicker}</ScrollMorphText></div>
          <h1 style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(32px, 5vw, 54px)", fontWeight: 400, color: P.ghost, margin: 0, lineHeight: 1.08 }}><ScrollMorphText speed={65}>{SHOP_COPY.headline}</ScrollMorphText></h1>
          <div style={{ width: 40, height: 1, background: `linear-gradient(to right, ${P.magenta}, transparent)`, marginTop: 16 }} />
          <div className="shop-intro-grid" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24, maxWidth: 900, marginTop: 22 }}>
            <p style={{ fontFamily: "'Georgia', serif", fontSize: 14, color: P.bone, opacity: 0.6, lineHeight: 1.7, margin: 0 }}>{SHOP_COPY.intro}</p>
            <p style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: P.bone, opacity: 0.38, lineHeight: 1.7, margin: 0, paddingLeft: 18, borderLeft: `1px solid ${P.gold}30` }}>{SHOP_COPY.distinction}</p>
          </div>
          {announcement && (
            <div style={{ marginTop: 16, fontFamily: "'Courier New', monospace", fontSize: 10, color: P.cyan, opacity: 0.7, letterSpacing: 2, lineHeight: 1.6 }}>{announcement}</div>
          )}
        </div>

        {error && (
          <div style={{ padding: 16, background: `${P.red}11`, border: `1px solid ${P.red}33`, color: P.red, fontFamily: "'Courier New', monospace", fontSize: 11, marginBottom: 24 }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: 28 }}>
          <div style={{ position: "relative", maxWidth: 440 }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontFamily: "'Courier New', monospace", fontSize: 12, color: P.bone, opacity: 0.2 }}>{"\u2315"}</span>
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products, artworks, tags..."
              style={{
                width: "100%", padding: "12px 14px 12px 36px",
                background: `${P.surface}66`, border: `1px solid ${P.steel}20`,
                borderRadius: 2, color: P.ghost, fontFamily: "'Courier New', monospace",
                fontSize: 12, letterSpacing: 1, outline: "none",
              }}
              onFocus={(e) => { e.target.style.borderColor = P.cyan + "40"; }}
              onBlur={(e) => { e.target.style.borderColor = P.steel + "20"; }}
            />
            {search && <button onClick={() => setSearch("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: P.bone, opacity: 0.3, cursor: "pointer", fontFamily: "'Courier New', monospace", fontSize: 14 }}>{"\u00D7"}</button>}
          </div>
        </div>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
          {SHOP_CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => { setCategory(cat.id); setItemFilter(null); }} style={{
              background: category === cat.id ? `${cat.color}12` : "transparent",
              border: `1px solid ${category === cat.id ? cat.color + "35" : P.steel + "15"}`,
              color: category === cat.id ? cat.color : P.bone,
              fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 3,
              padding: "8px 18px", cursor: "pointer", textTransform: "uppercase",
              transition: "all 0.3s", borderRadius: 2,
              opacity: category === cat.id ? 1 : 0.4,
            }}>{cat.icon} <HoverMorphText>{cat.label}</HoverMorphText></button>
          ))}
        </div>

        {visibleItems.length > 1 && (
          <div style={{ display: "flex", gap: 4, alignItems: "center", flexWrap: "wrap", marginBottom: 32 }}>
            <span style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: P.bone, opacity: 0.2, letterSpacing: 2, textTransform: "uppercase", marginRight: 6 }}>TYPE</span>
            {visibleItems.map(item => (
              <button key={item} onClick={() => setItemFilter(itemFilter === item ? null : item)} style={{
                background: itemFilter === item ? `${P.cyan}12` : "transparent",
                border: `1px solid ${itemFilter === item ? P.cyan + "30" : P.steel + "10"}`,
                color: itemFilter === item ? P.cyan : P.bone,
                fontFamily: "'Courier New', monospace", fontSize: 8, letterSpacing: 2,
                padding: "4px 10px", cursor: "pointer", textTransform: "uppercase",
                transition: "all 0.3s", borderRadius: 1, opacity: itemFilter === item ? 1 : 0.3,
              }}>{item}</button>
            ))}
          </div>
        )}

        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: P.bone, opacity: 0.2, letterSpacing: 3, marginBottom: 20 }}>
          {loading ? "LOADING\u2026" : `${filtered.length} ${filtered.length === 1 ? "RELEASE" : "RELEASES"}`}{search && ` matching "${search}"`}{itemFilter && ` \u00B7 ${itemFilter}`}
        </div>

        {!loading && filtered.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
            {filtered.map(p => <ShopCard key={p.id} product={p} onAdd={addToCart} onOpen={openProduct} />)}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontFamily: "'Georgia', serif", fontSize: 16, color: P.bone, opacity: 0.35, marginBottom: 12 }}>No releases found here.</div>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: P.bone, opacity: 0.2 }}>Try another category or clear the search signal.</div>
          </div>
        )}
      </div>
      {selectedProduct && <ProductDetail product={selectedProduct} onClose={closeProduct} onAdd={addToCart} />}
    </div>
  );
};

export default Shop;
