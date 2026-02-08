import { useState, useEffect, useCallback } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { CalmContext } from "./components/CalmContext";
import { P } from "./data/palette";
import { saveLocal, loadLocal } from "./utils/storage";
import { useIsMobile } from "./hooks/useIsMobile";
import { useImageProtection } from "./hooks/useImageProtection";

// Components
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import { Particles } from "./components/Particles";
import { Preloader } from "./components/Preloader";
import { CookieConsent } from "./components/CookieConsent";
import { SpotifyBar } from "./components/SpotifyBar";

// Pages
import Hero from "./pages/Hero";
import { MobileHub } from "./pages/MobileHub";
import Portfolio from "./pages/Portfolio";
import ShowcaseDetail from "./pages/ShowcaseDetail";
import CaseStudyDetail from "./pages/CaseStudyDetail";
import { MediaHub } from "./pages/MediaHub";
import { TheWork } from "./pages/TheWork";
import { NowPage } from "./pages/NowPage";
import { About } from "./pages/About";
import Shop from "./pages/Shop";
import { Contact } from "./pages/Contact";
import { Cart } from "./pages/Cart";
import { LegalPage } from "./pages/LegalPage";
import { NotFound } from "./pages/NotFound";

// Styles
import "./styles/global.css";

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}

export default function App() {
  const isMobile = useIsMobile();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [portfolioTab, setPortfolioTab] = useState(() => loadLocal("tab", "curated"));
  const [cart, setCart] = useState(() => loadLocal("cart", []));
  const [calm, setCalm] = useState(() => loadLocal("calm", false));
  const [toast, setToast] = useState(null);
  useImageProtection();

  // Calm mode body styling
  const toggleCalm = () => {
    setCalm((prev) => {
      const next = !prev;
      saveLocal("calm", next);
      return next;
    });
  };

  useEffect(() => {
    if (calm) {
      document.body.setAttribute("data-calm", "");
      document.body.style.fontFamily = "'Geist Sans', sans-serif";
    } else {
      document.body.removeAttribute("data-calm");
      document.body.style.fontFamily = "'Geist Pixel Square', monospace";
    }
  }, [calm]);

  // Global font river
  const PIXEL_FONTS = [
    "'Geist Pixel Square', monospace",
    "'Geist Pixel Grid', monospace",
    "'Geist Pixel Circle', monospace",
    "'Geist Pixel Triangle', monospace",
    "'Geist Pixel Line', monospace",
  ];
  const SS_OPTIONS = [
    "normal",
    '"ss01"',
    '"ss02"',
    '"ss03"',
    '"ss04"',
    '"ss05"',
    '"ss06"',
    '"ss07"',
  ];

  useEffect(() => {
    if (calm) return;
    const root = document.documentElement;
    const river = setInterval(() => {
      for (let g = 1; g <= 5; g++) {
        root.style.setProperty(
          `--pf${g}`,
          PIXEL_FONTS[Math.floor(Math.random() * 5)]
        );
        root.style.setProperty(
          `--ss${g}`,
          SS_OPTIONS[Math.floor(Math.random() * 8)]
        );
      }
    }, 100);
    return () => {
      clearInterval(river);
      for (let g = 1; g <= 5; g++) {
        root.style.removeProperty(`--pf${g}`);
        root.style.removeProperty(`--ss${g}`);
      }
    };
  }, [calm]);

  // Cart operations
  const addToCart = useCallback((p) => {
    setCart((prev) => {
      const next = [...prev, p];
      saveLocal("cart", next);
      return next;
    });
    setToast(`Added "${p.title}"`);
    setTimeout(() => setToast(null), 2000);
  }, []);

  const removeFromCart = useCallback((i) => {
    setCart((prev) => {
      const next = prev.filter((_, idx) => idx !== i);
      saveLocal("cart", next);
      return next;
    });
  }, []);

  // Persist tab state
  useEffect(() => {
    saveLocal("tab", portfolioTab);
  }, [portfolioTab]);

  const isHome = location.pathname === "/";

  return (
    <CalmContext.Provider value={calm}>
      <div
        style={{
          minHeight: "100vh",
          background: P.abyss,
          color: P.ghost,
          position: "relative",
        }}
      >
        <ScrollToTop />
        {loading && <Preloader onComplete={() => setLoading(false)} />}
        {!isMobile && <Particles />}

        {/* Desktop nav on all pages */}
        {!isMobile && <Nav cartCount={cart.length} />}

        {/* Mobile: minimal sticky header for inner pages */}
        {isMobile && !isHome && (
          <nav
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 100,
              padding: "12px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: `${P.abyss}f0`,
              backdropFilter: "blur(12px)",
              borderBottom: `1px solid ${P.steel}15`,
            }}
          >
            <a
              href="/"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: P.cyan,
                fontFamily: "'Courier New', monospace",
                fontSize: 10,
                letterSpacing: 3,
                textDecoration: "none",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
              HUB
            </a>
            <div
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: 9,
                letterSpacing: 4,
                color: P.bone,
                textTransform: "uppercase",
                opacity: 0.5,
              }}
            >
              {location.pathname.replace("/", "").replace(/-/g, " ") || "Home"}
            </div>
            <a
              href="/cart"
              style={{
                cursor: "pointer",
                position: "relative",
                color: P.bone,
                fontFamily: "'Courier New', monospace",
                fontSize: 9,
                letterSpacing: 2,
                textDecoration: "none",
              }}
            >
              CART
              {cart.length > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: -6,
                    right: -10,
                    background: P.magenta,
                    color: "#fff",
                    fontSize: 7,
                    fontWeight: 700,
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {cart.length}
                </span>
              )}
            </a>
          </nav>
        )}

        <div
          style={{
            position: "relative",
            zIndex: 2,
            animation: isMobile
              ? "none"
              : "morphBreath 1.5s ease-in-out infinite",
            willChange: isMobile ? "auto" : "opacity",
          }}
          data-protected
        >
          <Routes>
            <Route
              path="/"
              element={
                isMobile ? (
                  <MobileHub cartCount={cart.length} />
                ) : (
                  <Hero />
                )
              }
            />
            <Route
              path="/portfolio"
              element={
                <Portfolio
                  addToCart={addToCart}
                  portfolioTab={portfolioTab}
                  setPortfolioTab={setPortfolioTab}
                />
              }
            />
            <Route
              path="/portfolio/:id"
              element={<ShowcaseDetail addToCart={addToCart} />}
            />
            <Route
              path="/portfolio/design/:id"
              element={<CaseStudyDetail />}
            />
            <Route path="/media" element={<MediaHub />} />
            <Route path="/the-work" element={<TheWork />} />
            <Route path="/now" element={<NowPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/shop" element={<Shop addToCart={addToCart} />} />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/cart"
              element={<Cart cart={cart} removeFromCart={removeFromCart} />}
            />
            <Route path="/privacy" element={<LegalPage page="privacy" />} />
            <Route path="/terms" element={<LegalPage page="terms" />} />
            <Route path="/shipping" element={<LegalPage page="shipping" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </div>

        {toast && (
          <div
            style={{
              position: "fixed",
              bottom: 52,
              left: "50%",
              transform: "translateX(-50%)",
              background: `${P.surface}ee`,
              border: `1px solid ${P.cyan}22`,
              color: P.ghost,
              fontFamily: "'Courier New', monospace",
              fontSize: 10,
              letterSpacing: 2,
              padding: "8px 20px",
              zIndex: 200,
              backdropFilter: "blur(8px)",
              animation: "toastIn 0.25s ease",
            }}
          >
            {toast}
          </div>
        )}
        <CookieConsent />
        <SpotifyBar />

        {/* Calm Mode Toggle */}
        <button
          onClick={toggleCalm}
          aria-label={calm ? "Enable animations" : "Enable calm mode"}
          title={
            calm
              ? "Animations off \u2014 click to enable"
              : "Calm mode \u2014 click to pause all motion"
          }
          style={{
            position: "fixed",
            bottom: 42,
            right: 20,
            zIndex: 151,
            background: `${P.abyss}ee`,
            border: `1px solid ${calm ? P.cyan + "44" : P.cyan + "22"}`,
            borderRadius: 3,
            padding: "5px 12px",
            fontFamily: "'Courier New', monospace",
            fontSize: 9,
            letterSpacing: 3,
            color: calm ? P.cyan : P.bone,
            opacity: calm ? 1 : 0.5,
            cursor: "pointer",
            backdropFilter: "blur(8px)",
            textTransform: "uppercase",
          }}
          onMouseEnter={(e) => {
            e.target.style.opacity = "1";
            e.target.style.color = P.cyan;
          }}
          onMouseLeave={(e) => {
            e.target.style.opacity = calm ? "1" : "0.5";
            e.target.style.color = calm ? P.cyan : P.bone;
          }}
        >
          {calm ? "\u2726 Calm" : "\u2248 River"}
        </button>
      </div>
    </CalmContext.Provider>
  );
}
