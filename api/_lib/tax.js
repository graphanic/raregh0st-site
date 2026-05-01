// ─── Canadian GST/HST rates by destination province ───
// These are the destination-province rates as of 2024. The artist is in AB (5% GST only).
// When shipping to a province that levies HST, the seller collects HST (single combined tax).
// Source: https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/charge-collect-which-rate.html

export const CA_TAX_RATES = {
  AB: { gst: 0.05, pst: 0,    hst: 0,    label: "GST 5%" },
  BC: { gst: 0.05, pst: 0.07, hst: 0,    label: "GST 5% + PST 7% (PST not auto-collected)" },
  MB: { gst: 0.05, pst: 0.07, hst: 0,    label: "GST 5% + PST 7% (PST not auto-collected)" },
  NB: { gst: 0,    pst: 0,    hst: 0.15, label: "HST 15%" },
  NL: { gst: 0,    pst: 0,    hst: 0.15, label: "HST 15%" },
  NS: { gst: 0,    pst: 0,    hst: 0.14, label: "HST 14%" }, // dropped from 15% to 14% in 2025
  NT: { gst: 0.05, pst: 0,    hst: 0,    label: "GST 5%" },
  NU: { gst: 0.05, pst: 0,    hst: 0,    label: "GST 5%" },
  ON: { gst: 0,    pst: 0,    hst: 0.13, label: "HST 13%" },
  PE: { gst: 0,    pst: 0,    hst: 0.15, label: "HST 15%" },
  QC: { gst: 0.05, pst: 0.09975, hst: 0, label: "GST 5% + QST 9.975% (QST handled separately)" },
  SK: { gst: 0.05, pst: 0.06, hst: 0,    label: "GST 5% + PST 6% (PST not auto-collected)" },
  YT: { gst: 0.05, pst: 0,    hst: 0,    label: "GST 5%" },
};

// Returns the GST/HST rate as a decimal for a destination province.
// Note: PST/QST are provincial-administered and the artist is NOT registered for them yet,
// so we only auto-collect federal GST or harmonized HST. Artist can register with each province later.
export function gstHstRateFor(province) {
  const code = String(province || "").toUpperCase().slice(0, 2);
  const r = CA_TAX_RATES[code];
  if (!r) return 0;
  return r.hst > 0 ? r.hst : r.gst;
}

// Compute the savings/tax splits for a single order.
// All amounts in CAD, all numeric.
//
// gross           = subtotal (artist earnings, excludes shipping + tax)
// taxCollected    = whatever Stripe collected (already paid by customer; needs to be remitted)
// settings        = { income_tax_pct, savings_buffer_pct, gst_registered? }
//
// Returns: { gst_hst_owed, income_tax_setaside, savings_buffer, net_takehome }
export function computeSplits({ gross, taxCollected, settings }) {
  const g = Number(gross) || 0;
  const t = Number(taxCollected) || 0;
  const incomePct = Number(settings?.income_tax_pct ?? 0);
  const savingsPct = Number(settings?.savings_buffer_pct ?? 0);

  const gst_hst_owed = round2(t);
  const income_tax_setaside = round2((g * incomePct) / 100);
  const savings_buffer = round2((g * savingsPct) / 100);
  const net_takehome = round2(g - income_tax_setaside - savings_buffer);

  return { gst_hst_owed, income_tax_setaside, savings_buffer, net_takehome };
}

export function round2(n) {
  return Math.round((Number(n) + Number.EPSILON) * 100) / 100;
}
