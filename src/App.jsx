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
import { ProtectedRoute } from "./components/ProtectedRoute";

// Pages
import HomePage from "./pages/HomePage";
import Portfolio from "./pages/Portfolio";
import ShowcaseDetail from "./pages/ShowcaseDetail";
import CaseStudyDetail from "./pages/CaseStudyDetail";
import { MediaHub } from "./pages/MediaHub";
import { About } from "./pages/About";
import Shop from "./pages/Shop";
import { Contact } from "./pages/Contact";
import { Cart } from "./pages/Cart";
import { CheckoutSuccess } from "./pages/CheckoutSuccess";
import { CheckoutCancel } from "./pages/CheckoutCancel";
import { LegalPage } from "./pages/LegalPage";
import { NotFound } from "./pages/NotFound";
import { UploadAdmin } from "./pages/UploadAdmin";
import AdminStore from "./pages/AdminStore";
import AdminLogin from "./pages/AdminLogin";

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
  const [loading, setLoading] = useState(true);
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

  const clearCart = useCallback(() => {
    setCart([]);
    saveLocal("cart", []);
  }, []);

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

        <Nav cartCount={cart.length} />

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
            <Route path="/" element={<HomePage />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route
              path="/portfolio/:id"
              element={<ShowcaseDetail />}
            />
            <Route
              path="/portfolio/design/:slug"
              element={<CaseStudyDetail />}
            />
            <Route path="/media" element={<MediaHub />} />

            <Route path="/about" element={<About />} />
            <Route path="/shop" element={<Shop addToCart={addToCart} />} />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/cart"
              element={<Cart cart={cart} removeFromCart={removeFromCart} />}
            />
            <Route
              path="/checkout/success"
              element={<CheckoutSuccess onClearCart={clearCart} />}
            />
            <Route path="/checkout/cancel" element={<CheckoutCancel />} />
          <Route path="/privacy" element={<LegalPage page="privacy" />} />
          <Route path="/terms" element={<LegalPage page="terms" />} />
          <Route path="/shipping" element={<LegalPage page="shipping" />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin/upload" element={<UploadAdmin />} />
            <Route path="/admin/store" element={<AdminStore />} />
          </Route>
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
