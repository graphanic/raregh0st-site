import { supabaseAdmin } from "../_lib/supabase.js";
import { requireAdmin } from "../_lib/auth.js";
import { round2 } from "../_lib/tax.js";

// GET /api/admin/dashboard
// Returns aggregated stats for the savings/tax dashboard.

async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const sb = supabaseAdmin();
    const now = new Date();
    const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
    const startOfYear = new Date(Date.UTC(now.getUTCFullYear(), 0, 1)).toISOString();

    // Pull paid orders only \u2014 dashboard reflects realized earnings.
    const { data: orders, error } = await sb
      .from("orders")
      .select("subtotal_cad, tax_cad, gst_hst_owed_cad, income_tax_setaside_cad, savings_buffer_cad, net_takehome_cad, status, paid_at, created_at")
      .in("status", ["paid", "fulfilling", "shipped", "delivered"])
      .order("paid_at", { ascending: false })
      .limit(2000);
    if (error) throw error;

    const all = orders || [];
    const byMTD = all.filter(o => (o.paid_at || o.created_at) >= startOfMonth);
    const byYTD = all.filter(o => (o.paid_at || o.created_at) >= startOfYear);

    const sum = (rows) => ({
      gross: round2(rows.reduce((s, r) => s + Number(r.subtotal_cad || 0), 0)),
      gst_hst_owed: round2(rows.reduce((s, r) => s + Number(r.gst_hst_owed_cad || 0), 0)),
      income_tax_setaside: round2(rows.reduce((s, r) => s + Number(r.income_tax_setaside_cad || 0), 0)),
      savings_buffer: round2(rows.reduce((s, r) => s + Number(r.savings_buffer_cad || 0), 0)),
      net_takehome: round2(rows.reduce((s, r) => s + Number(r.net_takehome_cad || 0), 0)),
      order_count: rows.length,
    });

    return res.status(200).json({
      mtd: sum(byMTD),
      ytd: sum(byYTD),
      lifetime: sum(all),
      now: now.toISOString(),
      month_start: startOfMonth,
      year_start: startOfYear,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export default requireAdmin(handler);
