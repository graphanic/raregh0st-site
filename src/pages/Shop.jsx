import { useState, useEffect, useMemo } from "react";
import { P } from "../data/palette";
import { SHOP_CATEGORIES } from "../data/shop";
import { HoverMorphText, ScrollMorphText } from "../components/MorphText";
import { SEO } from "../components/SEO";
import { getProducts, getSettings } from "../lib/api";

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

const ShopCard = ({ product, onAdd }) => {
  const [h, setH] = useState(false);
  const cat = SHOP_CATEGORIES.find(c => c.id === product.category);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
      background: h ? `${P.surface}88` : `${P.surface}33`,
      border: `1px solid ${h ? product.colors[0] + "30" : P.steel + "10"}`,
      borderRadius: 3, overflow: "hidden", transition: "all 0.4s", cursor: "pointer",
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
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: P.bone, opacity: 0.3, lineHeight: 1.5, marginBottom: 10, flex: 1 }}>{product.description.slice(0, 80)}{product.description.length > 80 ? "\u2026" : ""}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "'Courier New', monospace", fontSize: 16, fontWeight: 700, color: P.ghost }}>${product.price}<span style={{ fontSize: 9, opacity: 0.3, marginLeft: 2 }}>CAD</span></span>
          {product.sizes && <span style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: P.bone, opacity: 0.25 }}>{product.sizes}</span>}
          {product.duration && <span style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: P.green, opacity: 0.5 }}>{product.duration}</span>}
        </div>
        <button onClick={(e) => { e.stopPropagation(); onAdd(product); }} style={{
          marginTop: 10, width: "100%", background: h ? `${product.colors[0]}0c` : "transparent",
          border: `1px solid ${h ? product.colors[0] + "30" : P.steel + "12"}`,
          color: h ? product.colors[0] : P.bone, fontFamily: "'Courier New', monospace",
          fontSize: 9, letterSpacing: 4, padding: "8px", cursor: "pointer",
          textTransform: "uppercase", transition: "all 0.3s", opacity: h ? 1 : 0.35,
        }}>{product.category === "courses" ? "Enroll" : "Add to Cart"}</button>
      </div>
    </div>
  );
};

const ComingSoonScreen = ({ announcement }) => (
  <div style={{ minHeight: "100vh", paddingTop: 120, paddingBottom: 80 }}>
    <SEO title="Shop \u2014 Opening Soon" description="The 1RareGh0st shop is being prepared." path="/shop" />
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 40px", textAlign: "center" }}>
      <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 8, color: P.amber, textTransform: "uppercase", marginBottom: 16 }}>
        <ScrollMorphText speed={70}>Opening Soon</ScrollMorphText>
      </div>
      <h2 style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 400, color: P.ghost, margin: "0 0 24px 0" }}>
        <ScrollMorphText speed={90}>The Shop</ScrollMorphText>
      </h2>
      <div style={{ width: 60, height: 1, background: `linear-gradient(to right, transparent, ${P.amber}, transparent)`, margin: "0 auto 32px" }} />
      <div style={{ fontFamily: "'Georgia', serif", fontSize: 15, color: P.bone, opacity: 0.5, lineHeight: 1.7, maxWidth: 560, margin: "0 auto" }}>
        {announcement || "Prints, apparel, accessories, and digital assets — all curated, all coming. The store is being prepared for launch. Bookmark this page or follow along for updates."}
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
      <SEO title="Shop" description="1RareGh0st shop \u2014 prints, apparel, digital assets, and creative courses." path="/shop" />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 6, color: P.magenta, textTransform: "uppercase", marginBottom: 12 }}><ScrollMorphText speed={75}>Shop</ScrollMorphText></div>
          <h2 style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 400, color: P.ghost, margin: 0 }}><ScrollMorphText speed={65}>{"Prints \u00B7 Apparel \u00B7 Digital \u00B7 Courses"}</ScrollMorphText></h2>
          <div style={{ width: 40, height: 1, background: `linear-gradient(to right, ${P.magenta}, transparent)`, marginTop: 16 }} />
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
          {loading ? "LOADING\u2026" : `${filtered.length} ${filtered.length === 1 ? "ITEM" : "ITEMS"}`}{search && ` matching "${search}"`}{itemFilter && ` \u00B7 ${itemFilter}`}
        </div>

        {!loading && filtered.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
            {filtered.map(p => <ShopCard key={p.id} product={p} onAdd={addToCart} />)}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontFamily: "'Georgia', serif", fontSize: 16, color: P.bone, opacity: 0.25, marginBottom: 12 }}>No items found</div>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: P.bone, opacity: 0.15 }}>Try adjusting your filters or search terms</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
