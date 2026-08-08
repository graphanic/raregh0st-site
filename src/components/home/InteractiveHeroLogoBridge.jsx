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
      const size = Math.max(imageRect.width, imageRect.height, isMobile ? 132 : 188);
      setBox({
        left: imageRect.left - parentRect.left + imageRect.width / 2 - size / 2,
        top: imageRect.top - parentRect.top + imageRect.height / 2 - size / 2,
        size,
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
      style={{
        position: "absolute",
        left: box.left,
        top: box.top,
        width: box.size,
        height: box.size,
        zIndex: 6,
        pointerEvents: "auto",
      }}
    >
      <InteractiveSkullLogo isMobile={isMobile} />
    </div>,
    target.parentElement,
  );
}
