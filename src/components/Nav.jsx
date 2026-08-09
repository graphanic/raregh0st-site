import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { P, LOGO_IMG } from "../data/palette";
import { HoverMorphText } from "./MorphText";
import { ACTION_COPY } from "../data/siteCopy";

const NAV_ITEMS = [
  { path: "/portfolio", label: "Portfolio" },
  { path: "/media", label: "Media" },
  { path: "/shop", label: "Shop" },
  { path: "/contact", label: "Contact" },
  { path: "/about", label: "About" },
];

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export const Nav = ({ cartCount }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef(null);
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const menuButtonRef = useRef(null);
  const previousFocusRef = useRef(null);

  const isCommission = location.pathname === "/contact"
    && new URLSearchParams(location.search).get("type") === "commission";
  const isActive = (path) => location.pathname === path && !(path === "/contact" && isCommission);

  const closeMenu = () => setMenuOpen(false);
  const openMenu = () => {
    previousFocusRef.current = document.activeElement;
    setMenuOpen(true);
  };
  const handleNav = (path) => {
    closeMenu();
    navigate(path);
  };

  useEffect(() => {
    if (!menuOpen) return undefined;

    const bodyOverflow = document.body.style.overflow;
    const backgroundNodes = [document.getElementById("root")].filter(Boolean);

    document.body.style.overflow = "hidden";
    backgroundNodes.forEach((node) => {
      node.inert = true;
      node.setAttribute("aria-hidden", "true");
    });
    closeRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = [...dialogRef.current.querySelectorAll(focusableSelector)]
        .filter((element) => !element.hidden && element.getAttribute("aria-hidden") !== "true");
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
      document.body.style.overflow = bodyOverflow;
      backgroundNodes.forEach((node) => {
        node.inert = false;
        node.removeAttribute("aria-hidden");
      });
      window.removeEventListener("keydown", onKeyDown);
      window.requestAnimationFrame(() => {
        (previousFocusRef.current?.isConnected ? previousFocusRef.current : menuButtonRef.current)?.focus?.();
      });
    };
  }, [menuOpen]);

  const menu = menuOpen && createPortal(
    <div
      className="mobile-menu-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeMenu();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "stretch",
        justifyContent: "flex-end",
        background: `${P.abyss}e8`,
        backdropFilter: "blur(20px)",
        animation: "fadeSlideIn 0.22s ease both",
      }}
    >
      <div
        ref={dialogRef}
        id="mobile-site-menu"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
        style={{
          position: "relative",
          width: "min(430px, 100%)",
          minHeight: "100%",
          padding: "86px 28px 32px",
          display: "flex",
          flexDirection: "column",
          background: `linear-gradient(160deg, ${P.void}, ${P.abyss} 72%)`,
          borderLeft: `1px solid ${P.cyan}28`,
          boxShadow: `-24px 0 80px ${P.cyan}0b`,
          overflowY: "auto",
        }}
      >
        <div id="mobile-menu-title" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
          Site navigation
        </div>
        <button
          ref={closeRef}
          type="button"
          onClick={closeMenu}
          aria-label="Close menu"
          style={{
            position: "absolute",
            top: 18,
            right: 18,
            width: 44,
            height: 44,
            display: "grid",
            placeItems: "center",
            background: `${P.cyan}0b`,
            border: `1px solid ${P.cyan}42`,
            color: P.cyan,
            fontSize: 24,
            cursor: "pointer",
          }}
        >
          ×
        </button>

        <div style={{ display: "grid", gap: 4 }}>
          {NAV_ITEMS.map(({ path, label }, index) => (
            <button
              key={path}
              type="button"
              onClick={() => handleNav(path)}
              aria-current={isActive(path) ? "page" : undefined}
              style={{
                minHeight: 52,
                background: isActive(path) ? `${P.cyan}0b` : "none",
                border: "none",
                borderLeft: `2px solid ${isActive(path) ? P.cyan : "transparent"}`,
                color: isActive(path) ? P.cyan : P.ghost,
                fontFamily: "'Courier New', monospace",
                fontSize: 13,
                letterSpacing: 6,
                textTransform: "uppercase",
                textAlign: "left",
                cursor: "pointer",
                padding: "14px 18px",
                animation: `fadeSlideIn 0.35s ease ${index * 0.04}s both`,
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => handleNav("/contact?type=commission")}
          aria-current={isCommission ? "page" : undefined}
          style={{
            minHeight: 52,
            marginTop: 12,
            background: isCommission ? `${P.gold}16` : `${P.gold}0d`,
            border: `1px solid ${isCommission ? P.gold + "88" : P.gold + "44"}`,
            color: P.gold,
            fontFamily: "'Courier New', monospace",
            fontSize: 11,
            letterSpacing: 4,
            textTransform: "uppercase",
            cursor: "pointer",
            padding: "13px 18px",
          }}
        >
          {ACTION_COPY.commission}
        </button>

        <button
          type="button"
          onClick={() => handleNav("/cart")}
          style={{
            minHeight: 52,
            marginTop: "auto",
            background: "none",
            border: "none",
            borderTop: `1px solid ${P.steel}2d`,
            color: P.ghost,
            fontFamily: "'Courier New', monospace",
            fontSize: 12,
            letterSpacing: 5,
            textTransform: "uppercase",
            textAlign: "left",
            cursor: "pointer",
            padding: "18px 0 10px",
          }}
        >
          Cart {cartCount > 0 && `(${cartCount})`}
        </button>
      </div>
    </div>,
    document.body,
  );

  return (
    <>
      <nav
        ref={navRef}
        className="site-nav"
        aria-label="Primary navigation"
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "14px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", background: `linear-gradient(to bottom, ${P.abyss}ee, transparent)`, backdropFilter: "blur(8px)" }}
      >
        <button type="button" onClick={() => handleNav("/")} aria-label="1RareGh0st home" style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
          <img src={LOGO_IMG} alt="" style={{ width: 22, height: 22, opacity: 0.7 }} />
          <span style={{ fontFamily: "'Courier New', monospace", fontSize: 14, fontWeight: 700, letterSpacing: 5 }}>
            <span style={{ color: P.ghost }}>1</span><span style={{ color: P.cyan }}>RARE</span><span style={{ color: P.magenta }}>GH</span><span style={{ color: P.ghost }}>0</span><span style={{ color: P.magenta }}>ST</span>
          </span>
        </button>

        <div className="nav-desktop" style={{ display: "flex", gap: 22, alignItems: "center" }}>
          {NAV_ITEMS.map(({ path, label }) => (
            <button
              key={path}
              type="button"
              onClick={() => navigate(path)}
              aria-current={isActive(path) ? "page" : undefined}
              style={{ background: "none", border: "none", color: isActive(path) ? P.cyan : P.bone, fontFamily: "'Courier New', monospace", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer", minHeight: 44, padding: "6px 0", borderBottom: isActive(path) ? `1px solid ${P.cyan}` : "1px solid transparent", transition: "all 0.3s" }}
            >
              <HoverMorphText>{label}</HoverMorphText>
            </button>
          ))}
          <button
            type="button"
            onClick={() => navigate("/contact?type=commission")}
            aria-current={isCommission ? "page" : undefined}
            style={{ background: isCommission ? `${P.gold}18` : `${P.gold}0d`, border: `1px solid ${isCommission ? P.gold + "88" : P.gold + "3d"}`, color: P.gold, fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", minHeight: 44, padding: "8px 12px", transition: "all 0.3s" }}
          >
            <HoverMorphText>Commission</HoverMorphText>
          </button>
          <button type="button" onClick={() => navigate("/cart")} style={{ background: "none", border: "none", minHeight: 44, padding: 0, cursor: "pointer", position: "relative", color: P.bone, fontFamily: "'Courier New', monospace", fontSize: 11, letterSpacing: 2 }}>
            CART{cartCount > 0 && <span aria-label={`${cartCount} items`} style={{ position: "absolute", top: 0, right: -12, background: P.magenta, color: "#fff", fontSize: 9, fontWeight: 700, width: 16, height: 16, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>}
          </button>
        </div>

        <div className="nav-mobile-btns" style={{ display: "none", alignItems: "center", gap: 10 }}>
          <button type="button" onClick={() => handleNav("/cart")} style={{ background: "none", border: "none", minWidth: 44, minHeight: 44, padding: 0, cursor: "pointer", position: "relative", color: P.bone, fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 2 }}>
            CART{cartCount > 0 && <span aria-hidden style={{ position: "absolute", top: 2, right: 0, background: P.magenta, color: "#fff", fontSize: 9, fontWeight: 700, width: 16, height: 16, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>}
          </button>
          <button
            ref={menuButtonRef}
            type="button"
            onClick={openMenu}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls={menuOpen ? "mobile-site-menu" : undefined}
            style={{ width: 44, height: 44, background: "none", border: `1px solid ${P.steel}2e`, cursor: "pointer", padding: 0, display: "grid", placeItems: "center" }}
          >
            <span aria-hidden style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <span style={{ display: "block", width: 20, height: 1.5, background: P.bone }} />
              <span style={{ display: "block", width: 20, height: 1.5, background: P.bone }} />
              <span style={{ display: "block", width: 20, height: 1.5, background: P.bone }} />
            </span>
          </button>
        </div>
      </nav>
      {menu}
    </>
  );
};
