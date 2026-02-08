// ─── PERSISTENCE HELPERS ────────────────────────────────
export const saveLocal = (key, val) => {
  try { localStorage.setItem(`rg_${key}`, JSON.stringify(val)); } catch(e) { /* noop */ }
};

export const loadLocal = (key, fallback) => {
  try {
    const v = localStorage.getItem(`rg_${key}`);
    return v ? JSON.parse(v) : fallback;
  } catch(e) {
    return fallback;
  }
};
