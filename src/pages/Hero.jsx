import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { P } from "../data/palette";
import { LOGO_IMG } from "../data/pieces";
import { MorphText } from "../components/MorphText";

// ─── CANVAS HERO (GPU-accelerated solar system) ──────────
const Hero = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const bgRef = useRef(null);
  const vigRef = useRef(null);
  const [vis, setVis] = useState(false);

  const mouse = useRef({ x: 0, y: 0, px: 0, py: 0, w: 0, h: 0 });
  const smoothed = useRef({ x: 0, y: 0 });
  const raf = useRef(null);
  const lastTime = useRef(null);
  const zoomTarget = useRef(1);
  const zoomCurrent = useRef(1);
  const panTarget = useRef({ x: 0, y: 0 });
  const panCurrent = useRef({ x: 0, y: 0 });
  const panVelocity = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const dragPanStart = useRef({ x: 0, y: 0 });
  const dragLast = useRef({ x: 0, y: 0, t: 0 });
  const fieldAngle = useRef(0);
  const hoveredRef = useRef(-1);
  const nodeScreenPos = useRef([]);
  const visRef = useRef(false);
  const fadeIn = useRef(0);

  const CPIXEL = [
    "'Geist Pixel Square'", "'Geist Pixel Grid'", "'Geist Pixel Circle'",
    "'Geist Pixel Triangle'", "'Geist Pixel Line'",
  ];
  const nodeCharFonts = useRef([]);
  const moonCharFonts = useRef([]);
  const lastFontCycle = useRef(0);

  const nodes = [
    { label: "Portfolio", dest: "/portfolio", color: P.cyan, orbitRadius: 480, speed: 200, startAngle: 200, radius: 52, ringCount: 3, desc: "Curated Works" },
    { label: "Shop", dest: "/shop", color: P.gold, orbitRadius: 620, speed: 280, startAngle: 340, radius: 54, ringCount: 2, desc: "Prints & Originals", moons: [
      { label: "Apparel", orbitRadius: 70, speed: 18, startAngle: 0, size: 18 },
      { label: "Accessories", orbitRadius: 90, speed: 24, startAngle: 72, size: 16 },
      { label: "Art Prints", orbitRadius: 110, speed: 30, startAngle: 144, size: 20 },
      { label: "Digital", orbitRadius: 130, speed: 36, startAngle: 216, size: 15 },
      { label: "Courses", orbitRadius: 150, speed: 42, startAngle: 288, size: 17 },
    ]},
    { label: "Media", dest: "/media", color: P.magenta, orbitRadius: 420, speed: 180, startAngle: 130, radius: 40, ringCount: 2, desc: "Motion & Sound" },
    { label: "The Work", dest: "/the-work", color: P.purple, orbitRadius: 720, speed: 340, startAngle: 50, radius: 46, ringCount: 3, desc: "Process & Philosophy" },
    { label: "Now", dest: "/now", color: P.green, orbitRadius: 340, speed: 140, startAngle: 270, radius: 34, ringCount: 2, desc: "Current Status" },
  ];

  const allMoons = [];
  nodes.forEach((node, ni) => {
    if (node.moons) node.moons.forEach((moon, mi) => {
      allMoons.push({ nodeIndex: ni, moonIndex: mi, ...moon });
    });
  });

  const orbitAngles = useRef(nodes.map(n => n.startAngle));
  const moonAnglesRef = useRef(allMoons.map(m => m.startAngle));

  const starSprites = useRef({});
  const STAR_TIERS = ["tiny", "small", "medium", "large", "xlarge", "xxlarge"];

  const starsDust = useRef(Array.from({ length: 1200 }, () => {
    const tier = Math.random() < 0.7 ? "tiny" : "small";
    return {
      angle: Math.random() * Math.PI * 2,
      dist: Math.random() * 3500 + 50,
      size: tier === "tiny" ? Math.random() * 0.6 + 0.2 : Math.random() * 1.0 + 0.4,
      spriteSize: tier === "tiny" ? Math.random() * 6 + 3 : Math.random() * 10 + 6,
      opacity: Math.random() * 0.15 + 0.02,
      color: ["#c8daff", "#a8c4ff", "#8eb0ff", "#d0e8ff"][Math.floor(Math.random() * 4)],
      phase: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 2.0 + 1.0,
      sprite: tier,
    };
  }));

  const starsMid = useRef(Array.from({ length: 350 }, () => {
    const r = Math.random();
    const tier = r < 0.5 ? "small" : r < 0.85 ? "medium" : "large";
    return {
      angle: Math.random() * Math.PI * 2,
      dist: Math.random() * 3000 + 80,
      size: tier === "small" ? Math.random() * 1.2 + 0.5 : tier === "medium" ? Math.random() * 2.0 + 1.0 : Math.random() * 3.0 + 2.0,
      spriteSize: tier === "small" ? Math.random() * 12 + 8 : tier === "medium" ? Math.random() * 24 + 16 : Math.random() * 40 + 28,
      haloSize: tier === "small" ? Math.random() * 6 + 3 : tier === "medium" ? Math.random() * 10 + 6 : Math.random() * 16 + 10,
      opacity: tier === "large" ? Math.random() * 0.3 + 0.1 : Math.random() * 0.2 + 0.05,
      color: ["#b8d0ff", "#90b8ff", P.cyan, "#c0d8ff", "#a0c0ff"][Math.floor(Math.random() * 5)],
      phase: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 3.0 + 1.5,
      sprite: tier,
    };
  }));

  const starsFG = useRef(Array.from({ length: 80 }, () => {
    const r = Math.random();
    const tier = r < 0.45 ? "large" : r < 0.8 ? "xlarge" : "xxlarge";
    return {
      angle: Math.random() * Math.PI * 2,
      dist: Math.random() * 2500 + 100,
      size: tier === "large" ? Math.random() * 2.5 + 1.5 : tier === "xlarge" ? Math.random() * 3.5 + 2.5 : Math.random() * 5.0 + 3.5,
      spriteSize: tier === "large" ? Math.random() * 48 + 32 : tier === "xlarge" ? Math.random() * 80 + 56 : Math.random() * 128 + 96,
      spikeLen: tier === "large" ? Math.random() * 18 + 10 : tier === "xlarge" ? Math.random() * 30 + 18 : Math.random() * 50 + 30,
      opacity: tier === "xxlarge" ? Math.random() * 0.2 + 0.15 : Math.random() * 0.25 + 0.1,
      color: [P.cyan, "#c0e0ff", "#8eb8ff", "#a0d0ff"][Math.floor(Math.random() * 4)],
      phase: Math.random() * Math.PI * 2,
      twinkleSpeed: tier === "xxlarge" ? Math.random() * 2.0 + 1.0 : Math.random() * 3.5 + 2.0,
      sprite: tier,
    };
  }));

  const lensDustImg = useRef(null);
  const lensDustCanvas = useRef(null);
  const lensDustHue = useRef(210);
  const lensDustHueTarget = useRef(210);
  const lensDustLastHue = useRef(-1);

  const moonImg = useRef(null);
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "/images/moon.png";
    img.onload = () => { moonImg.current = img; };
    STAR_TIERS.forEach(name => {
      const si = new Image();
      si.crossOrigin = "anonymous";
      si.src = `/images/stars/star-${name}.png`;
      si.onload = () => { starSprites.current[name] = si; };
      si.onerror = () => {};
    });
    const ld = new Image();
    ld.crossOrigin = "anonymous";
    ld.src = "/images/lens-dust.png";
    ld.onload = () => {
      lensDustImg.current = ld;
      const oc = document.createElement("canvas");
      const maxSz = 2048;
      const ratio = Math.min(maxSz / ld.naturalWidth, maxSz / ld.naturalHeight, 1);
      oc.width = Math.round(ld.naturalWidth * ratio);
      oc.height = Math.round(ld.naturalHeight * ratio);
      lensDustCanvas.current = oc;
    };
    setTimeout(() => { setVis(true); visRef.current = true; }, 100);
  }, []);

  // ── Event handlers ──
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      mouse.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouse.current.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      mouse.current.px = e.clientX - rect.left;
      mouse.current.py = e.clientY - rect.top;
      mouse.current.w = rect.width;
      mouse.current.h = rect.height;
      if (isDragging.current) {
        panTarget.current.x = dragPanStart.current.x + (e.clientX - dragStart.current.x);
        panTarget.current.y = dragPanStart.current.y + (e.clientY - dragStart.current.y);
        const now = performance.now();
        const elapsed = now - dragLast.current.t;
        if (elapsed > 0 && elapsed < 100) {
          panVelocity.current.x = (e.clientX - dragLast.current.x) / elapsed * 16;
          panVelocity.current.y = (e.clientY - dragLast.current.y) / elapsed * 16;
        }
        dragLast.current = { x: e.clientX, y: e.clientY, t: now };
      }
    };

    const onWheel = (e) => {
      e.preventDefault();
      const d = e.deltaY > 0 ? -0.08 : 0.08;
      const oldZ = zoomTarget.current;
      const newZ = Math.max(0.3, Math.min(2.5, oldZ + d));
      const rect = el.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const cxBase = rect.width / 2;
      const cyBase = rect.height / 2;
      const rto = newZ / oldZ;
      panTarget.current.x = (mx - cxBase) * (1 - rto) + panTarget.current.x * rto;
      panTarget.current.y = (my - cyBase) * (1 - rto) + panTarget.current.y * rto;
      zoomTarget.current = newZ;
    };

    const checkNodeClick = (mx, my) => {
      for (let i = 0; i < nodeScreenPos.current.length; i++) {
        const np = nodeScreenPos.current[i];
        if (!np) continue;
        if (Math.hypot(mx - np.x, my - np.y) < np.r) {
          navigate(nodes[i].dest);
          return true;
        }
      }
      return false;
    };

    const onDown = (e) => {
      const rect = el.getBoundingClientRect();
      if (checkNodeClick(e.clientX - rect.left, e.clientY - rect.top)) return;
      isDragging.current = true;
      panVelocity.current = { x: 0, y: 0 };
      dragStart.current = { x: e.clientX, y: e.clientY };
      dragLast.current = { x: e.clientX, y: e.clientY, t: performance.now() };
      dragPanStart.current = { x: panTarget.current.x, y: panTarget.current.y };
    };
    const onUp = () => {
      if (performance.now() - dragLast.current.t > 80) {
        panVelocity.current = { x: 0, y: 0 };
      }
      isDragging.current = false;
    };

    const onTouchStart = (e) => {
      const t = e.touches[0];
      const rect = el.getBoundingClientRect();
      if (checkNodeClick(t.clientX - rect.left, t.clientY - rect.top)) return;
      isDragging.current = true;
      panVelocity.current = { x: 0, y: 0 };
      dragStart.current = { x: t.clientX, y: t.clientY };
      dragLast.current = { x: t.clientX, y: t.clientY, t: performance.now() };
      dragPanStart.current = { x: panTarget.current.x, y: panTarget.current.y };
    };
    const onTouchMove = (e) => {
      const t = e.touches[0];
      const rect = el.getBoundingClientRect();
      mouse.current.x = ((t.clientX - rect.left) / rect.width - 0.5) * 2;
      mouse.current.y = ((t.clientY - rect.top) / rect.height - 0.5) * 2;
      mouse.current.px = t.clientX - rect.left;
      mouse.current.py = t.clientY - rect.top;
      if (isDragging.current) {
        panTarget.current.x = dragPanStart.current.x + (t.clientX - dragStart.current.x);
        panTarget.current.y = dragPanStart.current.y + (t.clientY - dragStart.current.y);
        const now = performance.now();
        const elapsed = now - dragLast.current.t;
        if (elapsed > 0 && elapsed < 100) {
          panVelocity.current.x = (t.clientX - dragLast.current.x) / elapsed * 16;
          panVelocity.current.y = (t.clientY - dragLast.current.y) / elapsed * 16;
        }
        dragLast.current = { x: t.clientX, y: t.clientY, t: now };
      }
    };
    const onTouchEnd = () => {
      if (performance.now() - dragLast.current.t > 80) {
        panVelocity.current = { x: 0, y: 0 };
      }
      isDragging.current = false;
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("mousedown", onDown);
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    el.addEventListener("touchend", onTouchEnd);
    window.addEventListener("mouseup", onUp);

    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("mousedown", onDown);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("mouseup", onUp);
    };
  }, [navigate]);

  // ── Main animation loop ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    let cw, ch;
    const resize = () => {
      const p = canvas.parentElement;
      if (!p) return;
      const rect = p.getBoundingClientRect();
      cw = rect.width;
      ch = rect.height;
      canvas.width = cw * dpr;
      canvas.height = ch * dpr;
      canvas.style.width = cw + "px";
      canvas.style.height = ch + "px";
    };
    resize();
    window.addEventListener("resize", resize);

    const tick = (timestamp) => {
      if (!lastTime.current) lastTime.current = timestamp;
      const dt = Math.min((timestamp - lastTime.current) / 1000, 0.1);
      lastTime.current = timestamp;

      if (visRef.current && fadeIn.current < 1) fadeIn.current = Math.min(1, fadeIn.current + dt * 0.5);
      const a = fadeIn.current;

      smoothed.current.x += (mouse.current.x - smoothed.current.x) * 0.06;
      smoothed.current.y += (mouse.current.y - smoothed.current.y) * 0.06;

      const vw = mouse.current.w || cw;
      const vh = mouse.current.h || ch;
      const bScale = zoomTarget.current / 0.3;
      const maxPX = vw * 0.35 * bScale;
      const maxPY = vh * 0.35 * bScale;
      panTarget.current.x = Math.max(-maxPX, Math.min(maxPX, panTarget.current.x));
      panTarget.current.y = Math.max(-maxPY, Math.min(maxPY, panTarget.current.y));

      if (!isDragging.current) {
        const vx = panVelocity.current.x;
        const vy = panVelocity.current.y;
        if (Math.abs(vx) > 0.1 || Math.abs(vy) > 0.1) {
          panTarget.current.x += vx;
          panTarget.current.y += vy;
          panVelocity.current.x *= 0.95;
          panVelocity.current.y *= 0.95;
        } else {
          panVelocity.current.x = 0;
          panVelocity.current.y = 0;
        }
      }

      panCurrent.current.x += (panTarget.current.x - panCurrent.current.x) * 0.1;
      panCurrent.current.y += (panTarget.current.y - panCurrent.current.y) * 0.1;
      zoomCurrent.current += (zoomTarget.current - zoomCurrent.current) * 0.08;
      const zoom = zoomCurrent.current;
      const fpx = panCurrent.current.x;
      const fpy = panCurrent.current.y;

      if (bgRef.current) bgRef.current.style.transform = `translate3d(${fpx * 0.05}px, ${fpy * 0.05}px, 0)`;

      for (let i = 0; i < nodes.length; i++) {
        orbitAngles.current[i] = (orbitAngles.current[i] + (360 / nodes[i].speed) * dt) % 360;
      }
      for (let m = 0; m < allMoons.length; m++) {
        moonAnglesRef.current[m] = (moonAnglesRef.current[m] + (360 / allMoons[m].speed) * dt) % 360;
      }

      fieldAngle.current = (fieldAngle.current + dt * 0.6) % 360;
      const faR = fieldAngle.current * Math.PI / 180;
      const faL = -fieldAngle.current * Math.PI / 180;

      lastFontCycle.current += dt * 1000;
      if (lastFontCycle.current >= 100) {
        lastFontCycle.current = 0;
        for (let i = 0; i < nodes.length; i++) {
          const chars = nodes[i].label.toUpperCase().split("");
          nodeCharFonts.current[i] = chars.map(() => Math.floor(Math.random() * 5));
        }
        for (let m = 0; m < allMoons.length; m++) {
          const chars = allMoons[m].label.toUpperCase().split("");
          moonCharFonts.current[m] = chars.map(() => Math.floor(Math.random() * 5));
        }
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cw, ch);

      const drawStar = (x, y, s, tw, baseAlpha) => {
        const scale = tw;
        if (scale < 0.02) return;
        const sprite = starSprites.current[s.sprite];
        if (sprite) {
          const sz = s.spriteSize * scale;
          ctx.globalAlpha = baseAlpha;
          ctx.drawImage(sprite, x - sz / 2, y - sz / 2, sz, sz);
        } else {
          const glowR = (s.haloSize || s.spikeLen || s.size * 6) * scale;
          if (glowR > 0.5) {
            const glow = ctx.createRadialGradient(x, y, 0, x, y, glowR);
            glow.addColorStop(0, s.color);
            glow.addColorStop(0.15, s.color + "60");
            glow.addColorStop(0.5, "#4488ff20");
            glow.addColorStop(1, "transparent");
            ctx.globalAlpha = baseAlpha * 0.6;
            ctx.fillStyle = glow;
            ctx.fillRect(x - glowR, y - glowR, glowR * 2, glowR * 2);
          }
          if (s.spikeLen) {
            ctx.strokeStyle = s.color;
            ctx.lineWidth = 1;
            ctx.globalAlpha = baseAlpha * 0.7;
            const sl = s.spikeLen * scale;
            ctx.beginPath();
            ctx.moveTo(x - sl, y); ctx.lineTo(x + sl, y);
            ctx.moveTo(x, y - sl); ctx.lineTo(x, y + sl);
            ctx.stroke();
            ctx.globalAlpha = baseAlpha * 0.3;
            ctx.lineWidth = 0.5;
            const sl2 = sl * 0.5;
            ctx.beginPath();
            ctx.moveTo(x - sl2, y - sl2); ctx.lineTo(x + sl2, y + sl2);
            ctx.moveTo(x + sl2, y - sl2); ctx.lineTo(x - sl2, y + sl2);
            ctx.stroke();
          }
          ctx.globalAlpha = baseAlpha;
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(x, y, Math.max(s.size * scale, 0.05), 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = baseAlpha * 0.6;
          ctx.fillStyle = s.color;
          ctx.beginPath();
          ctx.arc(x, y, Math.max(s.size * scale * 1.8, 0.1), 0, Math.PI * 2);
          ctx.fill();
        }
      };

      // Stars Layer 0: Deep dust
      ctx.save();
      ctx.translate(cw / 2 - panCurrent.current.x * 0.08, ch / 2 - panCurrent.current.y * 0.08);
      ctx.rotate(faL * 0.3);
      for (const s of starsDust.current) {
        const x = Math.cos(s.angle) * s.dist;
        const y = Math.sin(s.angle) * s.dist;
        const tw = 0.5 + 0.5 * Math.sin(timestamp * 0.001 * s.twinkleSpeed + s.phase);
        drawStar(x, y, s, tw, a);
      }
      ctx.restore();

      // Stars Layer 1: Mid-field
      ctx.save();
      ctx.translate(cw / 2 - panCurrent.current.x * 0.25, ch / 2 - panCurrent.current.y * 0.25);
      ctx.rotate(faL * 0.6);
      for (const s of starsMid.current) {
        const x = Math.cos(s.angle) * s.dist;
        const y = Math.sin(s.angle) * s.dist;
        const tw = 0.5 + 0.5 * Math.sin(timestamp * 0.001 * s.twinkleSpeed + s.phase);
        drawStar(x, y, s, tw, a);
      }
      ctx.restore();

      // Stars Layer 2: Near bright
      ctx.save();
      ctx.translate(cw / 2 - panCurrent.current.x * 0.5, ch / 2 - panCurrent.current.y * 0.5);
      ctx.rotate(faR * 0.8);
      for (const s of starsFG.current) {
        const x = Math.cos(s.angle) * s.dist;
        const y = Math.sin(s.angle) * s.dist;
        const tw = 0.5 + 0.5 * Math.sin(timestamp * 0.001 * s.twinkleSpeed + s.phase);
        drawStar(x, y, s, tw, a);
      }
      ctx.restore();

      // Field transform
      const cx = cw / 2 + fpx;
      const cy = ch / 2 + fpy;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(zoom, zoom);

      // Moon image
      if (moonImg.current) {
        const moonSize = Math.min(Math.max(438, cw * 0.5625), 725);
        const r = moonSize / 2;
        ctx.save();
        ctx.rotate(faR);
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.clip();
        ctx.globalAlpha = a;
        ctx.drawImage(moonImg.current, -r, -r, moonSize, moonSize);
        const grad = ctx.createRadialGradient(0, -r * 0.1, r * 0.35, 0, 0, r);
        grad.addColorStop(0, "transparent");
        grad.addColorStop(0.6, "rgba(9,9,18,0.2)");
        grad.addColorStop(0.78, "rgba(9,9,18,0.55)");
        grad.addColorStop(0.9, "rgba(9,9,18,0.85)");
        grad.addColorStop(1, "rgba(9,9,18,1)");
        ctx.fillStyle = grad;
        ctx.fillRect(-r, -r, moonSize, moonSize);
        ctx.restore();
      }

      // Rectangular grid (spins RIGHT)
      ctx.save();
      ctx.rotate(faR);
      ctx.strokeStyle = P.cyan;
      ctx.lineWidth = 0.5;
      ctx.globalAlpha = a * 0.14;
      const gridSpacing = 86;
      const halfExtent = Math.sqrt((cw / zoom) * (cw / zoom) + (ch / zoom) * (ch / zoom)) / 2 + 300;
      const gridLeft = Math.floor((-halfExtent) / gridSpacing) * gridSpacing;
      const gridRight = Math.ceil((halfExtent) / gridSpacing) * gridSpacing;
      const gridTop = Math.floor((-halfExtent) / gridSpacing) * gridSpacing;
      const gridBottom = Math.ceil((halfExtent) / gridSpacing) * gridSpacing;
      ctx.beginPath();
      for (let y = gridTop; y <= gridBottom; y += gridSpacing) {
        ctx.moveTo(gridLeft, y); ctx.lineTo(gridRight, y);
      }
      for (let x = gridLeft; x <= gridRight; x += gridSpacing) {
        ctx.moveTo(x, gridTop); ctx.lineTo(x, gridBottom);
      }
      ctx.stroke();
      ctx.restore();

      // Concentric circles (spins LEFT)
      ctx.save();
      ctx.rotate(faL);
      ctx.strokeStyle = P.cyan;
      const circleR = [80, 160, 260, 380, 520, 680, 860, 1080, 1350, 1700, 2100, 2600, 3200];
      for (let i = 0; i < circleR.length; i++) {
        ctx.lineWidth = i < 3 ? 1 : i < 6 ? 0.7 : 0.5;
        ctx.globalAlpha = a * (0.32 - i * 0.02);
        ctx.setLineDash(i % 3 === 2 ? [6, 12] : []);
        ctx.beginPath();
        ctx.arc(0, 0, circleR[i], 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.restore();

      // Radial lines (spins LEFT)
      ctx.save();
      ctx.rotate(faL);
      ctx.strokeStyle = P.cyan;
      ctx.lineWidth = 0.8;
      ctx.globalAlpha = a * 0.21;
      ctx.beginPath();
      for (let i = 0; i < 24; i += 6) {
        const ang = (i / 24) * Math.PI * 2;
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(ang) * 5000, Math.sin(ang) * 5000);
      }
      ctx.stroke();
      ctx.lineWidth = 0.4;
      ctx.globalAlpha = a * 0.105;
      ctx.beginPath();
      for (let i = 0; i < 24; i++) {
        if (i % 6 === 0) continue;
        const ang = (i / 24) * Math.PI * 2;
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(ang) * 5000, Math.sin(ang) * 5000);
      }
      ctx.stroke();
      ctx.restore();

      // Tick ring (spins LEFT)
      ctx.save();
      ctx.rotate(faL);
      ctx.strokeStyle = P.cyan;
      ctx.globalAlpha = a * 0.25;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = 0; i < 72; i += 6) {
        const ang = (i / 72) * Math.PI * 2;
        ctx.moveTo(Math.cos(ang) * 480, Math.sin(ang) * 480);
        ctx.lineTo(Math.cos(ang) * 510, Math.sin(ang) * 510);
      }
      ctx.stroke();
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      for (let i = 0; i < 72; i += 3) {
        if (i % 6 === 0) continue;
        const ang = (i / 72) * Math.PI * 2;
        ctx.moveTo(Math.cos(ang) * 480, Math.sin(ang) * 480);
        ctx.lineTo(Math.cos(ang) * 498, Math.sin(ang) * 498);
      }
      ctx.stroke();
      ctx.lineWidth = 0.4;
      ctx.beginPath();
      for (let i = 0; i < 72; i++) {
        if (i % 3 === 0) continue;
        const ang = (i / 72) * Math.PI * 2;
        ctx.moveTo(Math.cos(ang) * 480, Math.sin(ang) * 480);
        ctx.lineTo(Math.cos(ang) * 492, Math.sin(ang) * 492);
      }
      ctx.stroke();
      ctx.restore();

      // Orbit tracks
      for (let i = 0; i < nodes.length; i++) {
        ctx.strokeStyle = nodes[i].color;
        ctx.lineWidth = 0.5;
        ctx.globalAlpha = a * 0.06;
        ctx.beginPath();
        ctx.arc(0, 0, nodes[i].orbitRadius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Nodes + Sub-moons
      let newHovered = -1;
      nodeScreenPos.current = [];
      const t = timestamp * 0.001;

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const rad = orbitAngles.current[i] * Math.PI / 180;
        const nx = Math.cos(rad) * node.orbitRadius;
        const ny = Math.sin(rad) * node.orbitRadius;

        const screenX = nx * zoom + cx;
        const screenY = ny * zoom + cy;
        const hitR = node.radius * zoom;
        nodeScreenPos.current[i] = { x: screenX, y: screenY, r: hitR };

        const mpx = mouse.current.px;
        const mpy = mouse.current.py;
        if (mpx && mpy && Math.hypot(mpx - screenX, mpy - screenY) < hitR) {
          newHovered = i;
        }

        const isH = hoveredRef.current === i;

        // Outer rings with pulse
        ctx.strokeStyle = node.color;
        for (let ri = 0; ri < node.ringCount; ri++) {
          const rr = node.radius + ri * 10 + 5;
          const pulse = 1 + 0.04 * Math.sin(t * 1.0 + ri * 0.5 + i * 0.3);
          ctx.lineWidth = ri === 0 ? 1.5 : 0.5;
          ctx.globalAlpha = a * (isH ? 0.5 - ri * 0.12 : 0.18 - ri * 0.05);
          ctx.beginPath();
          ctx.arc(nx, ny, rr * pulse, 0, Math.PI * 2);
          ctx.stroke();
        }

        if (isH) {
          ctx.save();
          ctx.shadowColor = node.color;
          ctx.shadowBlur = 24;
          ctx.strokeStyle = node.color;
          ctx.lineWidth = 1;
          ctx.globalAlpha = a * 0.3;
          ctx.beginPath();
          ctx.arc(nx, ny, node.radius + 5, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        // Dashed spinning ring
        const dashR = node.radius - 4;
        const spinAngle = t * (0.1 + i * 0.02) * (i % 2 === 0 ? 1 : -1);
        ctx.save();
        ctx.translate(nx, ny);
        ctx.rotate(spinAngle);
        ctx.setLineDash([4, 6]);
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = a * (isH ? 0.4 : 0.1);
        ctx.beginPath();
        ctx.arc(0, 0, dashR, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();

        // Glow disc
        const glowGrad = ctx.createRadialGradient(nx, ny, 0, nx, ny, node.radius);
        glowGrad.addColorStop(0, node.color + (isH ? "18" : "08"));
        glowGrad.addColorStop(1, "transparent");
        ctx.fillStyle = glowGrad;
        ctx.globalAlpha = a;
        ctx.beginPath();
        ctx.arc(nx, ny, node.radius, 0, Math.PI * 2);
        ctx.fill();

        // Label
        const labelText = node.label.toUpperCase();
        const labelChars = labelText.split("");
        const charFonts = nodeCharFonts.current[i] || labelChars.map(() => 0);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = node.color;
        ctx.globalAlpha = a * (isH ? 1 : 0.7);
        if (isH) { ctx.shadowColor = node.color; ctx.shadowBlur = 12; }
        ctx.font = "bold 10px " + CPIXEL[0] + ", monospace";
        const totalW = ctx.measureText(labelText).width + (labelChars.length - 1) * 2;
        let charX = nx - totalW / 2;
        ctx.textAlign = "left";
        for (let ci = 0; ci < labelChars.length; ci++) {
          const fi = charFonts[ci] !== undefined ? charFonts[ci] : 0;
          ctx.font = "bold 10px " + CPIXEL[fi] + ", monospace";
          ctx.fillText(labelChars[ci], charX, ny);
          charX += ctx.measureText(labelChars[ci]).width + 2;
        }
        ctx.shadowBlur = 0;

        if (isH) {
          ctx.font = "9px " + CPIXEL[Math.floor(Math.random() * 5)] + ", monospace";
          ctx.textAlign = "center";
          ctx.fillStyle = P.bone;
          ctx.globalAlpha = a * 0.5;
          ctx.fillText(node.desc, nx, ny + 14);
        }

        // Tick marks
        ctx.strokeStyle = node.color;
        ctx.globalAlpha = a * (isH ? 0.5 : 0.12);
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        for (let ti = 0; ti < 12; ti += 3) {
          const ang = (ti / 12) * Math.PI * 2;
          ctx.moveTo(nx + Math.cos(ang) * (node.radius + 2), ny + Math.sin(ang) * (node.radius + 2));
          ctx.lineTo(nx + Math.cos(ang) * (node.radius + 10), ny + Math.sin(ang) * (node.radius + 10));
        }
        ctx.stroke();
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        for (let ti = 0; ti < 12; ti++) {
          if (ti % 3 === 0) continue;
          const ang = (ti / 12) * Math.PI * 2;
          ctx.moveTo(nx + Math.cos(ang) * (node.radius + 2), ny + Math.sin(ang) * (node.radius + 2));
          ctx.lineTo(nx + Math.cos(ang) * (node.radius + 5), ny + Math.sin(ang) * (node.radius + 5));
        }
        ctx.stroke();

        // Sub-moons
        if (node.moons) {
          for (let mi = 0; mi < node.moons.length; mi++) {
            const moon = node.moons[mi];
            const flatIdx = allMoons.findIndex(m => m.nodeIndex === i && m.moonIndex === mi);
            const mrad = moonAnglesRef.current[flatIdx] * Math.PI / 180;
            const mx = nx + Math.cos(mrad) * moon.orbitRadius;
            const my = ny + Math.sin(mrad) * moon.orbitRadius;

            ctx.setLineDash([2, 4]);
            ctx.strokeStyle = node.color;
            ctx.lineWidth = 0.5;
            ctx.globalAlpha = a * 0.08;
            ctx.beginPath();
            ctx.arc(nx, ny, moon.orbitRadius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.strokeStyle = node.color;
            ctx.lineWidth = 1;
            ctx.globalAlpha = a * 0.7;
            ctx.beginPath();
            ctx.arc(mx, my, moon.size / 2, 0, Math.PI * 2);
            ctx.stroke();

            const moonGrad = ctx.createRadialGradient(mx, my, 0, mx, my, moon.size / 2);
            moonGrad.addColorStop(0, node.color + "15");
            moonGrad.addColorStop(1, "transparent");
            ctx.fillStyle = moonGrad;
            ctx.globalAlpha = a * 0.7;
            ctx.beginPath();
            ctx.arc(mx, my, moon.size / 2, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = node.color;
            ctx.globalAlpha = a * 0.5;
            ctx.beginPath();
            ctx.arc(mx, my, moon.size * 0.2, 0, Math.PI * 2);
            ctx.fill();

            // Moon label
            const moonText = moon.label.toUpperCase();
            const moonChars = moonText.split("");
            const mCharFonts = moonCharFonts.current[flatIdx] || moonChars.map(() => 0);
            ctx.textBaseline = "top";
            ctx.fillStyle = node.color;
            ctx.globalAlpha = a * 0.5;
            ctx.font = "7px " + CPIXEL[0] + ", monospace";
            const mTotalW = ctx.measureText(moonText).width + (moonChars.length - 1) * 1;
            let mCharX = mx - mTotalW / 2;
            ctx.textAlign = "left";
            for (let mci = 0; mci < moonChars.length; mci++) {
              const mfi = mCharFonts[mci] !== undefined ? mCharFonts[mci] : 0;
              ctx.font = "7px " + CPIXEL[mfi] + ", monospace";
              ctx.fillText(moonChars[mci], mCharX, my + moon.size / 2 + 4);
              mCharX += ctx.measureText(moonChars[mci]).width + 1;
            }
          }
        }
      }

      ctx.restore(); // field transform

      // Lens dust overlay
      if (newHovered >= 0) {
        const nc = nodes[newHovered].color;
        const r2 = parseInt(nc.slice(1, 3), 16) / 255;
        const g2 = parseInt(nc.slice(3, 5), 16) / 255;
        const b2 = parseInt(nc.slice(5, 7), 16) / 255;
        const mx2 = Math.max(r2, g2, b2), mn2 = Math.min(r2, g2, b2), d2 = mx2 - mn2;
        let h2 = 0;
        if (d2 > 0) {
          if (mx2 === r2) h2 = ((g2 - b2) / d2 + 6) % 6 * 60;
          else if (mx2 === g2) h2 = ((b2 - r2) / d2 + 2) * 60;
          else h2 = ((r2 - g2) / d2 + 4) * 60;
        }
        lensDustHueTarget.current = h2;
      } else {
        lensDustHueTarget.current = 210;
      }
      let hDiff = lensDustHueTarget.current - lensDustHue.current;
      if (hDiff > 180) hDiff -= 360;
      if (hDiff < -180) hDiff += 360;
      lensDustHue.current = (lensDustHue.current + hDiff * 0.04 + 360) % 360;

      if (lensDustImg.current && lensDustCanvas.current) {
        const oc = lensDustCanvas.current;
        const roundedHue = Math.round(lensDustHue.current);
        if (roundedHue !== lensDustLastHue.current) {
          lensDustLastHue.current = roundedHue;
          const octx = oc.getContext("2d");
          octx.clearRect(0, 0, oc.width, oc.height);
          octx.globalCompositeOperation = "source-over";
          octx.globalAlpha = 1;
          octx.drawImage(lensDustImg.current, 0, 0, oc.width, oc.height);
          octx.globalCompositeOperation = "source-atop";
          octx.fillStyle = `hsl(${roundedHue}, 70%, 50%)`;
          octx.fillRect(0, 0, oc.width, oc.height);
          octx.globalCompositeOperation = "source-over";
        }
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        ctx.globalAlpha = a * 0.10;
        const dustBase = Math.max(cw, ch) * 1.4 / 0.3;
        const dustSz = dustBase * zoom;
        const dustDriftX = smoothed.current.x * -80;
        const dustDriftY = smoothed.current.y * -80;
        const dx = cw / 2 - dustSz / 2 + dustDriftX + fpx * 0.5;
        const dy = ch / 2 - dustSz / 2 + dustDriftY + fpy * 0.5;
        ctx.drawImage(oc, dx, dy, dustSz, dustSz);
        ctx.globalCompositeOperation = "source-over";
        ctx.restore();
      }

      hoveredRef.current = newHovered;

      if (canvasRef.current) {
        canvasRef.current.style.cursor = newHovered >= 0 ? "pointer" : (isDragging.current ? "grabbing" : "default");
      }

      if (overlayRef.current) {
        overlayRef.current.style.transform = `translate(-50%, -50%) translate(${fpx}px, ${fpy}px) scale(${zoom})`;
        overlayRef.current.style.opacity = a;
      }

      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", position: "relative", overflow: "hidden" }}>
      {/* L0: Cosmos background */}
      <div ref={bgRef} style={{ position: "absolute", inset: -60, pointerEvents: "none", willChange: "transform", zIndex: 0 }}>
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(ellipse 80% 60% at 50% 45%, #090912 0%, ${P.abyss} 70%), radial-gradient(circle at 25% 30%, ${P.cyan}08 0%, transparent 50%), radial-gradient(circle at 75% 65%, ${P.magenta}06 0%, transparent 50%)`,
          opacity: vis ? 1 : 0, transition: "opacity 3s cubic-bezier(0.16,1,0.3,1)",
        }} />
      </div>

      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, zIndex: 10 }} />

      {/* DOM overlay: title cluster */}
      <div ref={overlayRef} style={{
        position: "absolute", left: "50%", top: "50%",
        transform: "translate(-50%, -50%)",
        display: "flex", flexDirection: "column", alignItems: "center",
        pointerEvents: "none", zIndex: 20, opacity: 0,
      }}>
        <div style={{ marginBottom: 16 }}>
          <img src={LOGO_IMG} alt="RareGh0st" style={{
            width: "clamp(33px, 5vw, 53px)", height: "clamp(33px, 5vw, 53px)",
            filter: `brightness(1.1) drop-shadow(0 0 24px ${P.cyan}40) drop-shadow(0 0 48px ${P.magenta}20)`,
            animation: "breathe 4s ease-in-out infinite, logoHueShift 18s linear infinite",
          }} />
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 8, color: P.magenta, textTransform: "uppercase", marginBottom: 22 }}><MorphText speed={80}>The Art of</MorphText></div>
          <h1 style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(48px, 10vw, 110px)", fontWeight: 400, margin: 0, lineHeight: 0.9, letterSpacing: -2 }}>
            <span style={{ color: P.cyan }}><MorphText speed={90}>Rare</MorphText></span>
            <span style={{ color: P.magenta }}><MorphText speed={90}>Gh</MorphText></span>
            <span style={{ color: P.steel, opacity: 0.45 }}><MorphText speed={90}>0</MorphText></span>
            <span style={{ color: P.magenta }}><MorphText speed={90}>st</MorphText></span>
          </h1>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 6, color: P.cyan, textTransform: "uppercase", marginTop: 28, opacity: 0.8 }}><MorphText speed={65}>Trauma Integration Made Visible</MorphText></div>
        </div>
      </div>

      {/* L3: Vignette + CRT scanlines */}
      <div ref={vigRef} style={{ position: "absolute", inset: -60, zIndex: 25, pointerEvents: "none", willChange: "transform" }}>
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(ellipse 100% 95% at 50% 50%, transparent 25%, ${P.abyss}66 50%, ${P.abyss}aa 70%, ${P.abyss}dd 85%, ${P.abyss} 100%)`,
          opacity: vis ? 1 : 0, transition: "opacity 3s ease 0.5s",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "repeating-linear-gradient(to bottom, transparent 0px, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px)",
          backgroundSize: "100% 200px",
          animation: "crtScan 8s linear infinite",
          opacity: vis ? 0.6 : 0,
          transition: "opacity 3s ease 0.5s",
        }} />
      </div>

      {/* Home button */}
      <button
        onClick={() => { panTarget.current = { x: 0, y: 0 }; zoomTarget.current = 1; }}
        style={{
          position: "absolute", bottom: 24, left: 24, zIndex: 30,
          width: 40, height: 40, borderRadius: "50%",
          border: `1px solid ${P.cyan}40`, background: `${P.abyss}cc`,
          color: P.cyan, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          opacity: vis ? 0.7 : 0, transition: "opacity 0.4s ease, border-color 0.3s ease",
          backdropFilter: "blur(8px)",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.borderColor = P.cyan; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.7"; e.currentTarget.style.borderColor = `${P.cyan}40`; }}
        aria-label="Return to center"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </button>
    </div>
  );
};

export default Hero;
