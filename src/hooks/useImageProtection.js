import { useEffect } from "react";

export const useImageProtection = () => {
  useEffect(() => {
    const handleContext = (e) => {
      if (e.target.tagName === "IMG" || e.target.closest("[data-protected]")) {
        e.preventDefault();
        return false;
      }
    };
    const handleDrag = (e) => {
      if (e.target.tagName === "IMG") { e.preventDefault(); return false; }
    };
    const handleKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "S")) {
        e.preventDefault();
      }
    };
    document.addEventListener("contextmenu", handleContext);
    document.addEventListener("dragstart", handleDrag);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("contextmenu", handleContext);
      document.removeEventListener("dragstart", handleDrag);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);
};
