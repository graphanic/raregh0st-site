import { supabaseAdmin } from "../_lib/supabase.js";
import { requireAdmin } from "../_lib/auth.js";
import { round2 } from "../_lib/tax.js";

// GET /api/admin/dashboard
//   default: returns aggregated stats for the savings/tax dashboard (MTD/YTD/Lifetime).
//   ?report=aish&month=YYYY-MM[&format=csv]: returns AISH monthly earnings report.

async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const sb = supabaseAdmin();

  try {
    // ── AISH report mode ────────────────────────────────────────────────────
    if (req.query.report === "aish") {
      const month = String(req.query.month || "").trim();
      if (!/^\d{4}-\d{2}$/.test(month)) return res.status(400).json({ error: "Provide ?month=YYYY-MM" });
      const format = String(req.query.format || "json").toLowerCase();

      const [y, m] = month.split("-").map(Number);
      const start = new Date(Date.UTC(y, m - 1, 1)).toISOString();
      const end = new Date(Date.UTC(y, m, 1)).toISOString();

      const { data: orders, error } = await sb
        .from("orders")
        .select("id, paid_at, customer_email, subtotal_cad, gst_hst_owed_cad, net_takehome_cad, status, line_items")
        .in("status", ["paid", "fulfilling", "shipped", "delivered"])
        .gte("paid_at", start)
        .lt("paid_at", end)
        .order("paid_at", { ascending: true });
      if (error) throw error;

      const rows = (orders || []).map(o => ({
        order_id: o.id,
        date: o.paid_at,
        customer: o.customer_email || "anonymous",
        items: (o.line_items || []).map(li => `${li.title} x${li.quantity}`).join("; "),
        gross_cad: Number(o.subtotal_cad) || 0,
        gst_hst_owed_cad: Number(o.gst_hst_owed_cad) || 0,
        net_takehome_cad: Number(o.net_takehome_cad) || 0,
      }));

      const totals = {
        order_count: rows.length,
        gross_cad: round2(rows.reduce((s, r) => s + r.gross_cad, 0)),
        gst_hst_owed_cad: round2(rows.reduce((s, r) => s + r.gst_hst_owed_cad, 0)),
        net_takehome_cad: round2(rows.reduce((s, r) => s + r.net_takehome_cad, 0)),
      };

      if (format === "csv") {
        const header = "order_id,date,customer,items,gross_cad,gst_hst_owed_cad,net_takehome_cad";
        const escape = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
        const body = rows.map(r => [r.order_id, r.date, r.customer, r.items, r.gross_cad, r.gst_hst_owed_cad, r.net_takehome_cad].map(escape).join(",")).join("\n");
        const totalsLine = `\n,,,TOTAL,${totals.gross_cad},${totals.gst_hst_owed_cad},${totals.net_takehome_cad}`;
        const csv = `${header}\n${body}${totalsLine}`;
        res.setHeader("Content-Type", "text/csv; charset=utf-8");
        res.setHeader("Content-Disposition", `attachment; filename="aish-report-${month}.csv"`);
        return res.status(200).send(csv);
      }

      return res.status(200).json({ month, rows, totals });
    }

    // ── Default: dashboard stats ────────────────────────────────────────────
    const now = new Date();
    const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
    const startOfYear = new Date(Date.UTC(now.getUTCFullYear(), 0, 1)).toISOString();

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
