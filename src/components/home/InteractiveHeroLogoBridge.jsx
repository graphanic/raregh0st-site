import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { InteractiveSkullLogo } from "./InteractiveSkullLogo";
import { useIsMobile } from "../../hooks/useIsMobile";

export function InteractiveHeroLogoBridge() {
  const isMobile = useIsMobile();
  const [target, setTarget] = useState(null);
  const [box, setBox] = useState(null);

  useEffect(() => {
    const findTarget = () => {
      const next = document.querySelector("img.hero-logo");
      setTarget((current) => (current === next ? current : next));
    };

    findTarget();
    const observer = new MutationObserver(findTarget);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!target || !target.parentElement) {
      setBox(null);
      return undefined;
    }

    const parent = target.parentElement;
    const previousVisibility = target.style.visibility;
    const previousPointerEvents = target.style.pointerEvents;
    target.style.visibility = "hidden";
    target.style.pointerEvents = "none";

    const measure = () => {
      const imageRect = target.getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();

      // Give the 3D model room to breathe beyond the legacy image crop,
      // especially above the skull where the halo needs extra headroom.
      const width = Math.max(imageRect.width * (isMobile ? 1.5 : 1.7), isMobile ? 210 : 300);
      const height = Math.max(imageRect.height * (isMobile ? 1.8 : 2.0), isMobile ? 245 : 340);
      const extraHeight = height - imageRect.height;

      setBox({
        left: imageRect.left - parentRect.left + imageRect.width / 2 - width / 2,
        top: imageRect.top - parentRect.top - extraHeight * 0.72,
        width,
        height,
      });
    };

    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(target);
    resizeObserver.observe(parent);
    window.addEventListener("resize", measure);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", measure);
      target.style.visibility = previousVisibility;
      target.style.pointerEvents = previousPointerEvents;
    };
  }, [target, isMobile]);

  if (!target || !target.parentElement || !box) return null;

  return createPortal(
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: box.left,
        top: box.top,
        width: box.width,
        height: box.height,
        zIndex: 6,
        background: "transparent",
        pointerEvents: "none",
        overflow: "visible",
      }}
    >
      <InteractiveSkullLogo isMobile={isMobile} />
    </div>,
    target.parentElement,
  );
}
