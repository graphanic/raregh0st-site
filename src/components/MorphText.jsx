import { useState, useEffect, useRef, useContext } from "react";
import { CalmContext } from "./CalmContext";

export const MORPH_VARIANTS = [
  { fontFamily: "'Geist Pixel Square', monospace", opacity: 1 },
  { fontFamily: "'Geist Pixel Grid', monospace", opacity: 0.96 },
  { fontFamily: "'Geist Pixel Circle', monospace", opacity: 0.92 },
  { fontFamily: "'Geist Pixel Triangle', monospace", opacity: 0.88 },
  { fontFamily: "'Geist Pixel Line', monospace", opacity: 0.80 },
];

export const MorphText = ({ children, speed = 45, allowWrap = false }) => {
  const calm = useContext(CalmContext);
  const text = String(children);
  const chars = text.split("");
  const spanRefs = useRef([]);
  useEffect(() => {
    if (calm) return;
    const id = setInterval(() => {
      for (let i = 0; i < spanRefs.current.length; i++) {
        const el = spanRefs.current[i];
        if (!el) continue;
        const v = MORPH_VARIANTS[Math.floor(Math.random() * 5)];
        el.style.fontFamily = v.fontFamily;
        el.style.opacity = v.opacity;
      }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed, calm]);
  if (calm) return <span aria-label={text}>{text}</span>;
  return (
    <span aria-label={text} style={{ display: "inline" }}>
      {chars.map((c, i) => {
        if (c === " ") return allowWrap ? <span key={i}> </span> : <span key={i}>&nbsp;</span>;
        const v = MORPH_VARIANTS[Math.floor(Math.random() * 5)];
        return (
          <span
            key={i}
            ref={el => { spanRefs.current[i] = el; }}
            data-morph
            style={{ display: "inline-block", fontFamily: v.fontFamily, opacity: v.opacity }}
          >{c}</span>
        );
      })}
    </span>
  );
};

export const ScrollMorphText = ({ children, speed = 45, threshold = 0.3, allowWrap = false }) => {
  const ref = useRef(null);
  const [triggered, setTriggered] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setTriggered(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return (
    <span ref={ref} style={{ display: "inline" }}>
      {triggered
        ? <MorphText speed={speed} allowWrap={allowWrap}>{children}</MorphText>
        : <span data-morph style={{ fontFamily: MORPH_VARIANTS[4].fontFamily, opacity: MORPH_VARIANTS[4].opacity }}>{children}</span>
      }
    </span>
  );
};

export const HoverMorphText = ({ children, speed = 45 }) => {
  const calm = useContext(CalmContext);
  const text = typeof children === "string" ? children : String(children);
  const chars = text.split("");
  const [hovered, setHovered] = useState(false);
  const spanRefs = useRef([]);
  useEffect(() => {
    if (calm || !hovered) {
      for (let i = 0; i < spanRefs.current.length; i++) {
        const el = spanRefs.current[i];
        if (!el) continue;
        el.style.fontFamily = MORPH_VARIANTS[0].fontFamily;
        el.style.opacity = MORPH_VARIANTS[0].opacity;
      }
      return;
    }
    const id = setInterval(() => {
      for (let i = 0; i < spanRefs.current.length; i++) {
        const el = spanRefs.current[i];
        if (!el) continue;
        const v = MORPH_VARIANTS[Math.floor(Math.random() * 5)];
        el.style.fontFamily = v.fontFamily;
        el.style.opacity = v.opacity;
      }
    }, speed);
    return () => clearInterval(id);
  }, [hovered, text, speed, calm]);
  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: "inherit", display: "inline" }}
    >
      {chars.map((c, i) => {
        if (c === " ") return <span key={i}>&nbsp;</span>;
        const v = MORPH_VARIANTS[0];
        return (
          <span
            key={i}
            ref={el => { spanRefs.current[i] = el; }}
            data-morph
            style={{ display: "inline-block", fontFamily: v.fontFamily, opacity: v.opacity, transition: `opacity ${speed}ms ease` }}
          >{c}</span>
        );
      })}
    </span>
  );
};
