import { useState, useEffect, useMemo } from "react";
import { P } from "../data/palette";
import { SEO } from "../components/SEO";
import { useAuth } from "../components/AuthContext";
import {
  adminGetDashboard,
  adminGetAishReport,
  adminDownloadAishCsv,
  adminGetOrders,
  adminGetProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminGetSettings,
  adminUpdateSettings,
  adminSyncPrintful,
  adminUploadDigital,
  adminGetSubmissions,
  adminGetSubmissionReferences,
  adminUpdateSubmission,
  adminDeleteSubmission,
} from "../lib/api";
import { getWorkById, getWorkHref } from "../data/catalog";

// ─── shared styles ────────────────────────────────────────────────────────────
const ui = {
  page: { minHeight: "100vh", paddingTop: 100, paddingBottom: 80, background: P.abyss, color: P.ghost },
  shell: { maxWidth: 1200, margin: "0 auto", padding: "0 40px" },
  h1: { fontFamily: "'Georgia', serif", fontSize: 32, fontWeight: 400, color: P.ghost, margin: 0 },
  sub: { fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 6, color: P.cyan, textTransform: "uppercase", marginBottom: 12 },
  card: { background: `${P.surface}55`, border: `1px solid ${P.steel}15`, padding: "20px 24px", marginBottom: 16 },
  label: { fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 3, color: P.bone, textTransform: "uppercase", opacity: 0.5, marginBottom: 6, display: "block" },
  input: { width: "100%", background: P.abyss, color: P.ghost, border: `1px solid ${P.steel}30`, padding: "10px 12px", borderRadius: 2, fontSize: 13, fontFamily: "'Courier New', monospace", outline: "none" },
  btn: (kind = "primary") => {
    const styles = {
      primary: { background: `${P.cyan}15`, border: `1px solid ${P.cyan}40`, color: P.ghost },
      ghost:   { background: "transparent", border: `1px solid ${P.steel}25`, color: P.bone },
      danger:  { background: `${P.red}10`, border: `1px solid ${P.red}40`, color: P.red },
      good:    { background: `${P.green}10`, border: `1px solid ${P.green}40`, color: P.green },
    };
    return { ...styles[kind], fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 3, padding: "10px 18px", cursor: "pointer", textTransform: "uppercase", transition: "all 0.3s", borderRadius: 2 };
  },
  tab: (active, color) => ({
    background: active ? `${color}12` : "transparent",
    border: `1px solid ${active ? color + "35" : P.steel + "12"}`,
    color: active ? color : P.bone,
    fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 4,
    padding: "10px 20px", cursor: "pointer", textTransform: "uppercase",
    transition: "all 0.3s", borderRadius: 2, opacity: active ? 1 : 0.6,
  }),
  err: { background: `${P.red}11`, border: `1px solid ${P.red}33`, color: P.red, fontFamily: "'Courier New', monospace", fontSize: 11, padding: 12, marginBottom: 16 },
  ok:  { background: `${P.green}10`, border: `1px solid ${P.green}30`, color: P.green, fontFamily: "'Courier New', monospace", fontSize: 11, padding: 12, marginBottom: 16 },
};

const fmt$ = (n) => `$${(Number(n) || 0).toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const todayMonth = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

// ─── Dashboard tab ────────────────────────────────────────────────────────────
function DashboardTab({ token }) {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [aishMonth, setAishMonth] = useState(todayMonth());
  const [aishData, setAishData] = useState(null);
  const [aishLoading, setAishLoading] = useState(false);

  const downloadAishCsv = async () => {
    try {
      const blob = await adminDownloadAishCsv(token, aishMonth);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `aish-report-${aishMonth}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      setErr(error.message);
    }
  };

  useEffect(() => {
    adminGetDashboard(token).then(setData).catch(e => setErr(e.message));
  }, [token]);

  useEffect(() => {
    setAishLoading(true);
    adminGetAishReport(token, aishMonth)
      .then(setAishData)
      .catch(e => setErr(e.message))
      .finally(() => setAishLoading(false));
  }, [token, aishMonth]);

  if (err) return <div style={ui.err}>{err}</div>;
  if (!data) return <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: P.bone, opacity: 0.4 }}>Loading\u2026</div>;

  const Section = ({ title, stats, accent }) => (
    <div style={ui.card}>
      <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 4, color: accent, textTransform: "uppercase", marginBottom: 14 }}>{title}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
        <Stat label="Gross Earnings" value={fmt$(stats.gross)} color={P.ghost} />
        <Stat label="GST/HST Owed" value={fmt$(stats.gst_hst_owed)} color={P.amber} />
        <Stat label="Income Tax Set Aside" value={fmt$(stats.income_tax_setaside)} color={P.magenta} />
        <Stat label="Savings Buffer" value={fmt$(stats.savings_buffer)} color={P.green} />
        <Stat label="Net Take-Home" value={fmt$(stats.net_takehome)} color={P.cyan} bold />
        <Stat label="Orders" value={String(stats.order_count)} color={P.bone} />
      </div>
    </div>
  );

  return (
    <>
      <Section title="Month to Date" stats={data.mtd} accent={P.cyan} />
      <Section title="Year to Date" stats={data.ytd} accent={P.magenta} />
      <Section title="Lifetime" stats={data.lifetime} accent={P.amber} />

      <div style={ui.card}>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 4, color: P.green, textTransform: "uppercase", marginBottom: 14 }}>AISH Monthly Report</div>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: P.bone, opacity: 0.6, lineHeight: 1.6, marginBottom: 14 }}>
          Itemized monthly earnings for AISH reporting. Gross income shown is what AISH evaluates against your monthly threshold.
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
          <input type="month" value={aishMonth} onChange={e => setAishMonth(e.target.value)} style={{ ...ui.input, width: 200 }} />
          <button type="button" onClick={downloadAishCsv} style={ui.btn("good")}>
            Download CSV
          </button>
        </div>
        {aishLoading && <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: P.bone, opacity: 0.4 }}>Loading\u2026</div>}
        {aishData && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 16 }}>
            <Stat label="Orders" value={String(aishData.totals.order_count)} color={P.bone} />
            <Stat label="Gross (AISH-Reportable)" value={fmt$(aishData.totals.gross_cad)} color={P.green} bold />
            <Stat label="GST/HST Collected" value={fmt$(aishData.totals.gst_hst_owed_cad)} color={P.amber} />
            <Stat label="Net Take-Home" value={fmt$(aishData.totals.net_takehome_cad)} color={P.cyan} />
          </div>
        )}
        {aishData?.rows?.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Courier New', monospace", fontSize: 10 }}>
              <thead>
                <tr style={{ color: P.bone, opacity: 0.5, borderBottom: `1px solid ${P.steel}20` }}>
                  <th style={{ textAlign: "left", padding: "6px 8px" }}>Date</th>
                  <th style={{ textAlign: "left", padding: "6px 8px" }}>Customer</th>
                  <th style={{ textAlign: "left", padding: "6px 8px" }}>Items</th>
                  <th style={{ textAlign: "right", padding: "6px 8px" }}>Gross</th>
                </tr>
              </thead>
              <tbody>
                {aishData.rows.map(r => (
                  <tr key={r.order_id} style={{ borderBottom: `1px solid ${P.steel}10`, color: P.ghost }}>
                    <td style={{ padding: "6px 8px", whiteSpace: "nowrap" }}>{r.date?.slice(0, 10)}</td>
                    <td style={{ padding: "6px 8px" }}>{r.customer}</td>
                    <td style={{ padding: "6px 8px", maxWidth: 360, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.items}</td>
                    <td style={{ padding: "6px 8px", textAlign: "right" }}>{fmt$(r.gross_cad)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {aishData?.rows?.length === 0 && (
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: P.bone, opacity: 0.4 }}>No orders this month.</div>
        )}
      </div>
    </>
  );
}

const Stat = ({ label, value, color, bold }) => (
  <div>
    <div style={{ fontFamily: "'Courier New', monospace", fontSize: 8, letterSpacing: 2, color: P.bone, opacity: 0.5, textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
    <div style={{ fontFamily: "'Courier New', monospace", fontSize: bold ? 22 : 18, fontWeight: bold ? 700 : 400, color }}>{value}</div>
  </div>
);

// ─── Orders tab ───────────────────────────────────────────────────────────────
function OrdersTab({ token }) {
  const [orders, setOrders] = useState([]);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminGetOrders(token, { limit: 200 })
      .then(d => setOrders(d.orders || []))
      .catch(e => setErr(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div style={ui.card}>
      <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 4, color: P.cyan, textTransform: "uppercase", marginBottom: 16 }}>All Orders</div>
      {err && <div style={ui.err}>{err}</div>}
      {loading && <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: P.bone, opacity: 0.4 }}>Loading\u2026</div>}
      {!loading && orders.length === 0 && (
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: P.bone, opacity: 0.4 }}>No orders yet.</div>
      )}
      {orders.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Courier New', monospace", fontSize: 10 }}>
            <thead>
              <tr style={{ color: P.bone, opacity: 0.5, borderBottom: `1px solid ${P.steel}20` }}>
                <th style={{ textAlign: "left", padding: "8px 8px" }}>Date</th>
                <th style={{ textAlign: "left", padding: "8px 8px" }}>Customer</th>
                <th style={{ textAlign: "left", padding: "8px 8px" }}>Province</th>
                <th style={{ textAlign: "right", padding: "8px 8px" }}>Subtotal</th>
                <th style={{ textAlign: "right", padding: "8px 8px" }}>Tax</th>
                <th style={{ textAlign: "right", padding: "8px 8px" }}>Total</th>
                <th style={{ textAlign: "left", padding: "8px 8px" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} style={{ borderBottom: `1px solid ${P.steel}10`, color: P.ghost }}>
                  <td style={{ padding: "8px 8px", whiteSpace: "nowrap" }}>{(o.paid_at || o.created_at)?.slice(0, 10)}</td>
                  <td style={{ padding: "8px 8px" }}>{o.customer_email || "\u2014"}</td>
                  <td style={{ padding: "8px 8px", color: P.bone, opacity: 0.7 }}>{o.shipping_province || "\u2014"}</td>
                  <td style={{ padding: "8px 8px", textAlign: "right" }}>{fmt$(o.subtotal_cad)}</td>
                  <td style={{ padding: "8px 8px", textAlign: "right", color: P.amber }}>{fmt$(o.tax_cad)}</td>
                  <td style={{ padding: "8px 8px", textAlign: "right", fontWeight: 700 }}>{fmt$(o.total_cad)}</td>
                  <td style={{ padding: "8px 8px", color: o.status === "paid" ? P.green : o.status === "fulfilling" ? P.cyan : P.bone }}>{o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Inbox tab (contact / inquiries / newsletter) ─────────────────────────────
function InboxTab({ token }) {
  const [subs, setSubs] = useState([]);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [kind, setKind] = useState("all");     // all | contact | inquiry | newsletter
  const [open, setOpen] = useState(null);       // expanded submission id
  const [referencePreviews, setReferencePreviews] = useState({});

  const load = () => {
    setLoading(true);
    adminGetSubmissions(token, kind === "all" ? {} : { kind })
      .then(d => setSubs(d.submissions || []))
      .catch(e => setErr(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [token, kind]);

  const setStatus = async (id, status) => {
    try {
      await adminUpdateSubmission(token, id, status);
      setSubs(prev => prev.map(s => (s.id === id ? { ...s, status } : s)));
    } catch (e) { setErr(e.message); }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this submission permanently?")) return;
    try {
      await adminDeleteSubmission(token, id);
      setSubs(prev => prev.filter(s => s.id !== id));
    } catch (e) { setErr(e.message); }
  };

  const toggleOpen = async (submission) => {
    const nextOpen = open === submission.id ? null : submission.id;
    setOpen(nextOpen);
    if (submission.status === "new") setStatus(submission.id, "read");
    const uploadReferences = Array.isArray(submission.meta?.references)
      ? submission.meta.references.filter((reference) => reference?.type === "upload")
      : [];
    const previewState = referencePreviews[submission.id];
    if (!nextOpen || uploadReferences.length === 0 || previewState?.loading || previewState?.loaded) return;

    setReferencePreviews((current) => ({
      ...current,
      [submission.id]: { loading: true, loaded: false, items: current[submission.id]?.items || [] },
    }));
    try {
      const data = await adminGetSubmissionReferences(token, submission.id);
      setReferencePreviews((current) => ({
        ...current,
        [submission.id]: { loading: false, loaded: true, items: data.references || [] },
      }));
    } catch (previewError) {
      setReferencePreviews((current) => ({
        ...current,
        [submission.id]: { loading: false, loaded: false, items: [], error: previewError.message },
      }));
    }
  };

  const KIND_COLOR = { contact: P.cyan, inquiry: P.magenta, newsletter: P.amber };
  const newCount = subs.filter(s => s.status === "new").length;
  const FILTERS = ["all", "contact", "inquiry", "newsletter"];
  const META_LABELS = {
    intendedUse: "Intended use",
    budget: "Approximate budget",
    timeline: "Target date",
    deliverable: "Base deliverable",
    pieceId: "Artwork ID",
    pieceTitle: "Artwork",
  };

  return (
    <div style={ui.card}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 4, color: P.cyan, textTransform: "uppercase" }}>
          Inbox {newCount > 0 && <span style={{ color: P.magenta }}>· {newCount} new</span>}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setKind(f)} style={ui.tab(kind === f, KIND_COLOR[f] || P.ghost)}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {err && <div style={ui.err}>{err}</div>}
      {loading && <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: P.bone, opacity: 0.4 }}>Loading…</div>}
      {!loading && subs.length === 0 && (
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: P.bone, opacity: 0.4 }}>Nothing here yet.</div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {subs.map(s => {
          const accent = KIND_COLOR[s.kind] || P.ghost;
          const isOpen = open === s.id;
          const isNew = s.status === "new";
          const submissionReferences = Array.isArray(s.meta?.references) ? s.meta.references : [];
          const previewState = referencePreviews[s.id] || {};
          const previewByPath = new Map((previewState.items || []).map((item) => [item.storagePath, item.previewUrl]));
          const metaEntries = Object.entries(s.meta || {}).filter(([key, value]) => key !== "references" && value != null && value !== "");
          return (
            <div key={s.id} style={{
              border: `1px solid ${isNew ? accent + "40" : P.steel + "15"}`,
              background: isNew ? `${accent}08` : "transparent",
              borderRadius: 2,
            }}>
              <div
                onClick={() => toggleOpen(s)}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", cursor: "pointer", flexWrap: "wrap" }}
              >
                <span style={{ fontFamily: "'Courier New', monospace", fontSize: 8, letterSpacing: 2, color: accent, textTransform: "uppercase", border: `1px solid ${accent}40`, borderRadius: 2, padding: "3px 6px", minWidth: 74, textAlign: "center" }}>
                  {s.kind}
                </span>
                <span style={{ fontFamily: "'Courier New', monospace", fontSize: 12, color: P.ghost, flex: 1, minWidth: 160 }}>
                  {s.email}
                  {s.subject && <span style={{ color: P.bone, opacity: 0.6 }}> · {s.subject}</span>}
                </span>
                {s.status === "archived" && <span style={{ fontFamily: "'Courier New', monospace", fontSize: 8, letterSpacing: 2, color: P.bone, opacity: 0.5, textTransform: "uppercase" }}>archived</span>}
                <span style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: P.bone, opacity: 0.5, whiteSpace: "nowrap" }}>
                  {s.created_at?.slice(0, 10)}
                </span>
              </div>

              {isOpen && (
                <div style={{ padding: "0 14px 14px", display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", gap: 20, flexWrap: "wrap", fontFamily: "'Courier New', monospace", fontSize: 10, color: P.bone }}>
                    {s.name && <span>Name: <span style={{ color: P.ghost }}>{s.name}</span></span>}
                    {s.category && <span>Category: <span style={{ color: P.ghost }}>{s.category}</span></span>}
                    {s.source && <span>Source: <span style={{ color: P.ghost }}>{s.source}</span></span>}
                  </div>
                  {s.message && (
                    <div style={{ fontFamily: "'Georgia', serif", fontSize: 14, lineHeight: 1.6, color: P.ghost, whiteSpace: "pre-wrap", borderLeft: `2px solid ${accent}44`, paddingLeft: 14 }}>
                      {s.message}
                    </div>
                  )}
                  {submissionReferences.length > 0 && (
                    <section aria-label="Commission references" style={{ display: "grid", gap: 9 }}>
                      <div style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: P.gold, letterSpacing: 3, textTransform: "uppercase" }}>
                        Inspiration board · {submissionReferences.length} reference{submissionReferences.length === 1 ? "" : "s"}
                      </div>
                      {previewState.loading && <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: P.bone, opacity: 0.5 }}>Opening private previews…</div>}
                      {previewState.error && <div style={ui.err}>{previewState.error}</div>}
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
                        {submissionReferences.map((reference, referenceIndex) => {
                          const work = reference.type === "portfolio" ? getWorkById(reference.workId) : null;
                          const previewUrl = reference.type === "upload" ? previewByPath.get(reference.storagePath) : work?.img;
                          const title = reference.type === "portfolio" ? (work?.title || reference.title) : reference.originalName;
                          return (
                            <article key={`${reference.type}-${reference.workId || reference.storagePath || referenceIndex}`} style={{ overflow: "hidden", border: `1px solid ${P.gold}28`, background: `${P.gold}05` }}>
                              {previewUrl && (
                                <div style={{ aspectRatio: "16 / 9", overflow: "hidden", background: P.abyss }}>
                                  {work?.mediaType === "video"
                                    ? <video src={previewUrl} muted controls preload="metadata" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                                    : <img src={previewUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
                                </div>
                              )}
                              <div style={{ padding: "11px 12px" }}>
                                <div style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: P.gold, letterSpacing: 2, textTransform: "uppercase", marginBottom: 5 }}>
                                  {reference.type === "portfolio" ? "Portfolio artwork" : "Private photo"}
                                </div>
                                <div style={{ fontFamily: "'Georgia', serif", fontSize: 13, color: P.ghost, lineHeight: 1.4 }}>{title}</div>
                                {reference.note && <p style={{ fontFamily: "'Georgia', serif", fontSize: 12, color: P.bone, opacity: 0.72, lineHeight: 1.55, margin: "8px 0 0", whiteSpace: "pre-wrap" }}>{reference.note}</p>}
                                {work && <a href={getWorkHref(work)} target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: 9, color: P.cyan, fontFamily: "'Courier New', monospace", fontSize: 8, letterSpacing: 1.5, textTransform: "uppercase" }}>Open portfolio work ↗</a>}
                                {reference.type === "upload" && previewUrl && <a href={previewUrl} target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: 9, color: P.cyan, fontFamily: "'Courier New', monospace", fontSize: 8, letterSpacing: 1.5, textTransform: "uppercase" }}>Open private reference ↗</a>}
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    </section>
                  )}
                  {metaEntries.length > 0 && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 8 }}>
                      {metaEntries.map(([key, value]) => (
                        <div key={key} style={{ padding: "10px 12px", background: `${P.surface}55`, border: `1px solid ${P.steel}15` }}>
                          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: accent, letterSpacing: 2, textTransform: "uppercase", marginBottom: 5 }}>
                            {META_LABELS[key] || key.replace(/([a-z])([A-Z])/g, "$1 $2")}
                          </div>
                          <div style={{ fontFamily: "'Georgia', serif", fontSize: 12, color: P.ghost, lineHeight: 1.5 }}>
                            {key === "deliverable" ? String(value).replace(/-/g, " ") : String(value)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <a href={`mailto:${s.email}${s.subject ? `?subject=${encodeURIComponent("Re: " + s.subject)}` : ""}`} style={{ ...ui.btn("primary"), textDecoration: "none", display: "inline-block" }}>Reply</a>
                    {s.status !== "archived"
                      ? <button onClick={() => setStatus(s.id, "archived")} style={ui.btn("ghost")}>Archive</button>
                      : <button onClick={() => setStatus(s.id, "read")} style={ui.btn("ghost")}>Unarchive</button>}
                    <button onClick={() => remove(s.id)} style={ui.btn("danger")}>Delete</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Settings tab ─────────────────────────────────────────────────────────────
function SettingsTab({ token }) {
  const [settings, setSettings] = useState(null);
  const [draft, setDraft] = useState({});
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const [ok, setOk] = useState(null);

  useEffect(() => {
    adminGetSettings(token)
      .then(d => { setSettings(d.settings); setDraft(d.settings || {}); })
      .catch(e => setErr(e.message));
  }, [token]);

  const set = (k, v) => setDraft(d => ({ ...d, [k]: v }));

  const save = async () => {
    setBusy(true); setErr(null); setOk(null);
    try {
      const patch = {};
      ["shop_live", "income_tax_pct", "savings_buffer_pct", "aish_monthly_threshold", "business_province", "printful_enabled", "shop_announcement"].forEach(k => {
        if (draft[k] !== settings[k]) patch[k] = draft[k];
      });
      if (Object.keys(patch).length === 0) { setOk("Nothing to update."); setBusy(false); return; }
      const res = await adminUpdateSettings(token, patch);
      setSettings(res.settings); setDraft(res.settings); setOk("Settings saved.");
    } catch (e) { setErr(e.message); }
    finally { setBusy(false); }
  };

  if (!settings) return <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: P.bone, opacity: 0.4 }}>Loading\u2026</div>;

  return (
    <div style={ui.card}>
      <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 4, color: P.cyan, textTransform: "uppercase", marginBottom: 16 }}>Store Settings</div>
      {err && <div style={ui.err}>{err}</div>}
      {ok && <div style={ui.ok}>{ok}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18 }}>
        <Toggle label="Shop Live" hint="Customers can browse + buy when ON. OFF shows the Coming Soon page." value={!!draft.shop_live} onChange={v => set("shop_live", v)} accent={P.green} />
        <Toggle label="Printful Enabled" hint="When ON, orders auto-push to Printful for fulfillment." value={!!draft.printful_enabled} onChange={v => set("printful_enabled", v)} accent={P.cyan} />

        <NumberField label="Income Tax % to Set Aside" hint="Per-order percentage saved for personal income tax (e.g. 25)." value={draft.income_tax_pct} onChange={v => set("income_tax_pct", v)} suffix="%" />
        <NumberField label="Savings Buffer %" hint="Pay-yourself-first percentage saved per order (e.g. 10)." value={draft.savings_buffer_pct} onChange={v => set("savings_buffer_pct", v)} suffix="%" />
        <NumberField label="AISH Monthly Threshold (CAD)" hint="Used as the floor on the AISH report. 2024 single threshold ~$1196." value={draft.aish_monthly_threshold} onChange={v => set("aish_monthly_threshold", v)} suffix="$" />

        <div>
          <label style={ui.label}>Business Province</label>
          <select value={draft.business_province || "AB"} onChange={e => set("business_province", e.target.value)} style={{ ...ui.input, padding: "10px 12px" }}>
            {["AB","BC","MB","NB","NL","NS","NT","NU","ON","PE","QC","SK","YT"].map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <label style={ui.label}>Shop Announcement (shown on /shop and Coming Soon page)</label>
        <textarea value={draft.shop_announcement || ""} onChange={e => set("shop_announcement", e.target.value)} rows={3} style={{ ...ui.input, resize: "vertical" }} placeholder="Optional message displayed at the top of the shop." />
      </div>

      <div style={{ marginTop: 24 }}>
        <button onClick={save} disabled={busy} style={{ ...ui.btn("primary"), opacity: busy ? 0.5 : 1 }}>
          {busy ? "Saving\u2026" : "Save Settings"}
        </button>
      </div>
    </div>
  );
}

const NumberField = ({ label, hint, value, onChange, suffix }) => (
  <div>
    <label style={ui.label}>{label}</label>
    <div style={{ position: "relative" }}>
      <input type="number" step="0.01" value={value ?? ""} onChange={e => onChange(e.target.value === "" ? null : Number(e.target.value))} style={ui.input} />
      {suffix && <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: P.bone, opacity: 0.4, fontFamily: "'Courier New', monospace", fontSize: 11 }}>{suffix}</span>}
    </div>
    {hint && <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: P.bone, opacity: 0.4, lineHeight: 1.5, marginTop: 4 }}>{hint}</div>}
  </div>
);

const Toggle = ({ label, hint, value, onChange, accent }) => (
  <div>
    <label style={ui.label}>{label}</label>
    <button
      onClick={() => onChange(!value)}
      style={{
        background: value ? `${accent}15` : "transparent",
        border: `1px solid ${value ? accent + "50" : P.steel + "25"}`,
        color: value ? accent : P.bone,
        fontFamily: "'Courier New', monospace", fontSize: 11, letterSpacing: 4,
        padding: "10px 16px", cursor: "pointer", textTransform: "uppercase",
        borderRadius: 2, width: "100%", textAlign: "left",
      }}
    >
      {value ? "\u25CF ON" : "\u25CB OFF"}
    </button>
    {hint && <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: P.bone, opacity: 0.4, lineHeight: 1.5, marginTop: 4 }}>{hint}</div>}
  </div>
);

// ─── Products tab ─────────────────────────────────────────────────────────────
function ProductsTab({ token }) {
  const [products, setProducts] = useState([]);
  const [err, setErr] = useState(null);
  const [editing, setEditing] = useState(null); // product or { __new: true }
  const [busy, setBusy] = useState(false);

  const load = () => adminGetProducts(token).then(d => setProducts(d.products || [])).catch(e => setErr(e.message));
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [token]);

  const save = async () => {
    setBusy(true); setErr(null);
    try {
      const payload = { ...editing };
      if (payload.__new) {
        delete payload.__new;
        delete payload.id;
        await adminCreateProduct(token, payload);
      } else {
        await adminUpdateProduct(token, payload);
      }
      setEditing(null);
      await load();
    } catch (e) { setErr(e.message); }
    finally { setBusy(false); }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this product? This cannot be undone.")) return;
    try { await adminDeleteProduct(token, id); await load(); } catch (e) { setErr(e.message); }
  };

  if (editing) return <ProductEditor product={editing} setProduct={setEditing} onSave={save} onCancel={() => setEditing(null)} busy={busy} err={err} />;

  return (
    <div style={ui.card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 4, color: P.cyan, textTransform: "uppercase" }}>Products ({products.length})</div>
        <button onClick={() => setEditing({ __new: true, slug: "", title: "", category: "apparel", price_cad: 0, is_active: true, is_digital: false, tags: [], colors: [] })} style={ui.btn("primary")}>+ New Product</button>
      </div>
      {err && <div style={ui.err}>{err}</div>}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Courier New', monospace", fontSize: 10 }}>
          <thead>
            <tr style={{ color: P.bone, opacity: 0.5, borderBottom: `1px solid ${P.steel}20` }}>
              <th style={{ textAlign: "left", padding: "8px 8px" }}>Title</th>
              <th style={{ textAlign: "left", padding: "8px 8px" }}>Category</th>
              <th style={{ textAlign: "right", padding: "8px 8px" }}>Price</th>
              <th style={{ textAlign: "left", padding: "8px 8px" }}>Active</th>
              <th style={{ textAlign: "left", padding: "8px 8px" }}>Source</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} style={{ borderBottom: `1px solid ${P.steel}10`, color: P.ghost }}>
                <td style={{ padding: "8px 8px" }}>{p.title}</td>
                <td style={{ padding: "8px 8px", color: P.bone, opacity: 0.7 }}>{p.category}/{p.subcategory || "\u2014"}</td>
                <td style={{ padding: "8px 8px", textAlign: "right" }}>{fmt$(p.price_cad)}</td>
                <td style={{ padding: "8px 8px", color: p.is_active ? P.green : P.red, opacity: p.is_active ? 1 : 0.6 }}>{p.is_active ? "ON" : "OFF"}</td>
                <td style={{ padding: "8px 8px", color: P.bone, opacity: 0.5 }}>{p.printful_product_id ? "Printful" : p.is_digital ? "Digital" : "Manual"}</td>
                <td style={{ padding: "8px 8px", textAlign: "right" }}>
                  <button onClick={() => setEditing(p)} style={{ ...ui.btn("ghost"), padding: "5px 12px", fontSize: 9, marginRight: 6 }}>Edit</button>
                  <button onClick={() => remove(p.id)} style={{ ...ui.btn("danger"), padding: "5px 12px", fontSize: 9 }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProductEditor({ product, setProduct, onSave, onCancel, busy, err }) {
  const isNew = !!product.__new;
  const set = (k, v) => setProduct(p => ({ ...p, [k]: v }));
  const tagsStr = useMemo(() => Array.isArray(product.tags) ? product.tags.join(", ") : "", [product.tags]);
  const colorsStr = useMemo(() => Array.isArray(product.colors) ? product.colors.join(", ") : "", [product.colors]);

  return (
    <div style={ui.card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 4, color: P.cyan, textTransform: "uppercase" }}>
          {isNew ? "New Product" : `Edit \u00B7 ${product.title}`}
        </div>
        <div>
          <button onClick={onCancel} style={{ ...ui.btn("ghost"), marginRight: 8 }}>Cancel</button>
          <button onClick={onSave} disabled={busy} style={{ ...ui.btn("primary"), opacity: busy ? 0.5 : 1 }}>{busy ? "Saving\u2026" : "Save"}</button>
        </div>
      </div>
      {err && <div style={ui.err}>{err}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
        <div><label style={ui.label}>Slug *</label><input style={ui.input} value={product.slug || ""} onChange={e => set("slug", e.target.value)} placeholder="kebab-case-slug" /></div>
        <div><label style={ui.label}>Title *</label><input style={ui.input} value={product.title || ""} onChange={e => set("title", e.target.value)} /></div>
        <div>
          <label style={ui.label}>Category *</label>
          <select value={product.category || "apparel"} onChange={e => set("category", e.target.value)} style={ui.input}>
            {["apparel", "accessories", "prints", "digital", "courses"].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div><label style={ui.label}>Subcategory</label><input style={ui.input} value={product.subcategory || ""} onChange={e => set("subcategory", e.target.value)} /></div>
        <div><label style={ui.label}>Price CAD *</label><input type="number" step="0.01" style={ui.input} value={product.price_cad ?? ""} onChange={e => set("price_cad", Number(e.target.value))} /></div>
        <div><label style={ui.label}>Image URL</label><input style={ui.input} value={product.image_url || ""} onChange={e => set("image_url", e.target.value)} placeholder="https://\u2026 or /images/\u2026" /></div>
        <div><label style={ui.label}>Sizes</label><input style={ui.input} value={product.sizes || ""} onChange={e => set("sizes", e.target.value)} placeholder="S\u20133XL" /></div>
        <div><label style={ui.label}>Duration (courses)</label><input style={ui.input} value={product.duration || ""} onChange={e => set("duration", e.target.value)} placeholder="4 hours" /></div>
        <div><label style={ui.label}>Artwork (linked piece)</label><input style={ui.input} value={product.artwork || ""} onChange={e => set("artwork", e.target.value)} placeholder="The Beast" /></div>
        <div><label style={ui.label}>Display Order</label><input type="number" style={ui.input} value={product.display_order ?? 0} onChange={e => set("display_order", Number(e.target.value))} /></div>
      </div>

      <div style={{ marginTop: 16 }}>
        <label style={ui.label}>Description</label>
        <textarea style={{ ...ui.input, resize: "vertical" }} rows={3} value={product.description || ""} onChange={e => set("description", e.target.value)} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginTop: 16 }}>
        <div>
          <label style={ui.label}>Tags (comma separated)</label>
          <input style={ui.input} value={tagsStr} onChange={e => set("tags", e.target.value.split(",").map(s => s.trim()).filter(Boolean))} />
        </div>
        <div>
          <label style={ui.label}>Color Tokens (comma separated, e.g. cyan, magenta)</label>
          <input style={ui.input} value={colorsStr} onChange={e => set("colors", e.target.value.split(",").map(s => s.trim()).filter(Boolean))} />
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: P.bone, opacity: 0.4, marginTop: 4 }}>cyan, magenta, purple, red, amber, green, gold, ghost, steel</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 24, marginTop: 18 }}>
        <Toggle label="Active" hint="Visible on the shop" value={!!product.is_active} onChange={v => set("is_active", v)} accent={P.green} />
        <Toggle label="Digital" hint="Delivered as a download (no shipping)" value={!!product.is_digital} onChange={v => set("is_digital", v)} accent={P.amber} />
      </div>
    </div>
  );
}

// ─── Tools tab (Printful sync + Digital uploads) ─────────────────────────────
function ToolsTab({ token }) {
  const [pfBusy, setPfBusy] = useState(false);
  const [pfMsg, setPfMsg] = useState(null);
  const [pfErr, setPfErr] = useState(null);

  const [products, setProducts] = useState([]);
  const [selProduct, setSelProduct] = useState("");
  const [file, setFile] = useState(null);
  const [upBusy, setUpBusy] = useState(false);
  const [upMsg, setUpMsg] = useState(null);
  const [upErr, setUpErr] = useState(null);

  useEffect(() => {
    adminGetProducts(token).then(d => setProducts((d.products || []).filter(p => p.is_digital))).catch(() => {});
  }, [token]);

  const sync = async () => {
    setPfBusy(true); setPfErr(null); setPfMsg(null);
    try {
      const r = await adminSyncPrintful(token);
      setPfMsg(`Synced: ${r.inserted} inserted, ${r.updated} updated, ${r.errors?.length || 0} errors out of ${r.total} Printful products.`);
    } catch (e) { setPfErr(e.message); }
    finally { setPfBusy(false); }
  };

  const upload = async () => {
    if (!file || !selProduct) return;
    setUpBusy(true); setUpErr(null); setUpMsg(null);
    try {
      const r = await adminUploadDigital(token, selProduct, file);
      setUpMsg(`Uploaded \u2014 file is now linked to product. Customers will receive: ${r.url}`);
      setFile(null);
    } catch (e) { setUpErr(e.message); }
    finally { setUpBusy(false); }
  };

  return (
    <>
      <div style={ui.card}>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 4, color: P.cyan, textTransform: "uppercase", marginBottom: 12 }}>Printful Catalog Sync</div>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: P.bone, opacity: 0.6, lineHeight: 1.6, marginBottom: 14 }}>
          Pull all sync products from your connected Printful store and upsert them into your shop. Existing rows match by Printful ID. Requires PRINTFUL_API_KEY env var.
        </div>
        {pfErr && <div style={ui.err}>{pfErr}</div>}
        {pfMsg && <div style={ui.ok}>{pfMsg}</div>}
        <button onClick={sync} disabled={pfBusy} style={{ ...ui.btn("primary"), opacity: pfBusy ? 0.5 : 1 }}>
          {pfBusy ? "Syncing\u2026" : "Sync Printful Catalog"}
        </button>
      </div>

      <div style={ui.card}>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 4, color: P.amber, textTransform: "uppercase", marginBottom: 12 }}>Digital File Upload</div>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: P.bone, opacity: 0.6, lineHeight: 1.6, marginBottom: 14 }}>
          Upload the deliverable file (zip, PSD, MP4, PDF, etc.) for a digital product. Files are stored on Vercel Blob and the resulting URL is attached to the product. Customers see the link on the success page after purchase.
        </div>
        {upErr && <div style={ui.err}>{upErr}</div>}
        {upMsg && <div style={ui.ok}>{upMsg}</div>}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 12 }}>
          <div>
            <label style={ui.label}>Digital Product</label>
            <select value={selProduct} onChange={e => setSelProduct(e.target.value)} style={ui.input}>
              <option value="">\u2014 Select \u2014</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>
          <div>
            <label style={ui.label}>File</label>
            <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} style={{ ...ui.input, padding: 8 }} />
          </div>
        </div>
        <button onClick={upload} disabled={upBusy || !file || !selProduct} style={{ ...ui.btn("good"), opacity: upBusy || !file || !selProduct ? 0.5 : 1 }}>
          {upBusy ? "Uploading\u2026" : "Upload File"}
        </button>
      </div>
    </>
  );
}

// ─── Root admin shell ─────────────────────────────────────────────────────────
export default function AdminStore() {
  const { session, signOut } = useAuth();
  const [tab, setTab] = useState("dashboard");
  const token = session?.access_token;

  if (!token) return null;

  return (
    <div style={ui.page}>
      <SEO title="Store Admin" description="1RareGh0st store admin" path="/admin/store" />
      <div style={ui.shell}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={ui.sub}>Admin</div>
            <h1 style={ui.h1}>Store Console</h1>
          </div>
          <button onClick={() => void signOut()} style={ui.btn("ghost")}>Sign Out</button>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          <button style={ui.tab(tab === "dashboard", P.cyan)} onClick={() => setTab("dashboard")}>Dashboard</button>
          <button style={ui.tab(tab === "inbox",     P.magenta)} onClick={() => setTab("inbox")}>Inbox</button>
          <button style={ui.tab(tab === "orders",    P.magenta)} onClick={() => setTab("orders")}>Orders</button>
          <button style={ui.tab(tab === "products",  P.amber)} onClick={() => setTab("products")}>Products</button>
          <button style={ui.tab(tab === "settings",  P.green)} onClick={() => setTab("settings")}>Settings</button>
          <button style={ui.tab(tab === "tools",     P.purple)} onClick={() => setTab("tools")}>Tools</button>
        </div>

        {tab === "dashboard" && <DashboardTab token={token} />}
        {tab === "inbox" && <InboxTab token={token} />}
        {tab === "orders" && <OrdersTab token={token} />}
        {tab === "products" && <ProductsTab token={token} />}
        {tab === "settings" && <SettingsTab token={token} />}
        {tab === "tools" && <ToolsTab token={token} />}
      </div>
    </div>
  );
}
