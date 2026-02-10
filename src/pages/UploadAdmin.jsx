import { useState, useRef, useEffect } from "react";
import { SEO } from "../components/SEO";
import { P } from "../data/palette";
import { DESIGN_PROJECTS, PHOTO_GALLERY, AI_WORKS, MOTION_WORKS } from "../data/portfolio";
import { PIECES } from "../data/pieces";

// ─── Category / Subcategory map ─────────────────────────
const CATEGORIES = {
  design: {
    label: "Design",
    subcategories: ["esports", "sports", "merch", "branding", "identity", "broadcast", "apparel", "print", "events", "web"],
    fields: ["title", "year", "role", "brief", "approach", "description", "deliverables", "tags", "colors"],
    folder: "design",
  },
  photography: {
    label: "Photography",
    subcategories: ["landscape", "portrait", "urban", "abstract", "studio", "street", "night", "nature", "event", "editorial"],
    fields: ["title", "tags", "colors", "description"],
    folder: "photography",
  },
  "ai-human": {
    label: "AI x Human",
    subcategories: ["photoshop", "hybridized", "stable-diffusion", "midjourney", "angel"],
    fields: ["title", "process", "type", "year", "description", "tags", "colors"],
    folder: "ai",
  },
  motion: {
    label: "Motion",
    subcategories: ["animated-artwork", "video-art", "motion-design", "loop", "generative", "parallax"],
    fields: ["title", "duration", "type", "description", "tags", "colors"],
    folder: "motion",
  },
  curated: {
    label: "Curated Works",
    subcategories: ["signature", "series", "collection"],
    fields: ["title", "description", "tags", "colors"],
    folder: "curated",
  },
};

const AVAILABLE_COLORS = [
  { label: "Cyan", value: "P.cyan" },
  { label: "Magenta", value: "P.magenta" },
  { label: "Purple", value: "P.purple" },
  { label: "Red", value: "P.red" },
  { label: "Amber", value: "P.amber" },
  { label: "Green", value: "P.green" },
  { label: "Gold", value: "P.gold" },
  { label: "Ghost", value: "P.ghost" },
  { label: "Steel", value: "P.steel" },
];

const COLOR_MAP = {
  "P.cyan": P.cyan, "P.magenta": P.magenta, "P.purple": P.purple,
  "P.red": P.red, "P.amber": P.amber, "P.green": P.green,
  "P.gold": P.gold, "P.ghost": P.ghost, "P.steel": P.steel,
};

// ─── Media helpers ──────────────────────────────────────
const VIDEO_EXTENSIONS = ["mp4", "webm", "mov", "avi", "mkv", "m4v", "ogv"];
const isVideoFile = (filename) => {
  if (!filename) return false;
  const ext = filename.split(".").pop().toLowerCase();
  return VIDEO_EXTENSIONS.includes(ext);
};
const isVideoUrl = (url) => {
  if (!url) return false;
  return VIDEO_EXTENSIONS.some(ext => url.toLowerCase().includes(`.${ext}`)) || url.includes("video");
};

// ─── Shared styles ──────────────────────────────────────
const inputStyle = {
  background: P.abyss, color: P.ghost, border: `1px solid ${P.steel}`,
  padding: "10px 12px", borderRadius: "4px", width: "100%", fontSize: "0.9rem",
  outline: "none",
};
const labelStyle = { display: "block", marginBottom: "6px", color: P.cyan, fontSize: "0.8rem", letterSpacing: "0.08em", textTransform: "uppercase" };
const cardStyle = { background: P.void, padding: "24px", borderRadius: "8px", border: `1px solid ${P.steel}50`, marginBottom: "20px" };
const btnPrimary = (disabled) => ({
  background: disabled ? P.steel : P.cyan, color: P.abyss,
  padding: "12px 24px", border: "none", borderRadius: "4px",
  cursor: disabled ? "not-allowed" : "pointer", fontSize: "0.95rem", fontWeight: "600",
});

// ─── Tag Input Component ────────────────────────────────
const TagInput = ({ tags, onChange }) => {
  const [input, setInput] = useState("");
  const add = () => {
    const newTags = input
      .split(",")
      .map(t => t.trim().toLowerCase())
      .filter(t => t && !tags.includes(t));
    if (newTags.length > 0) { onChange([...tags, ...newTags]); }
    setInput("");
  };
  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "8px" }}>
        {tags.map((t, i) => (
          <span key={i} style={{ background: `${P.cyan}20`, color: P.cyan, padding: "4px 10px", borderRadius: "20px", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "6px" }}>
            {t}
            <button onClick={() => onChange(tags.filter((_, idx) => idx !== i))} style={{ background: "none", border: "none", color: P.magenta, cursor: "pointer", fontSize: "0.9rem", padding: 0, lineHeight: 1 }} aria-label={`Remove tag ${t}`}>x</button>
          </span>
        ))}
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), add())} placeholder="Add tags (comma separated)..." style={{ ...inputStyle, flex: 1 }} />
        <button onClick={add} type="button" style={{ ...btnPrimary(false), padding: "10px 16px", fontSize: "0.85rem" }}>+</button>
      </div>
    </div>
  );
};

// ─── Deliverables Input ─────────────────────────────────
const DeliverablesInput = ({ items, onChange }) => {
  const [input, setInput] = useState("");
  const add = () => {
    const val = input.trim();
    if (val && !items.includes(val)) { onChange([...items, val]); }
    setInput("");
  };
  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "8px" }}>
        {items.map((d, i) => (
          <span key={i} style={{ background: `${P.magenta}20`, color: P.magenta, padding: "4px 10px", borderRadius: "20px", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "6px" }}>
            {d}
            <button onClick={() => onChange(items.filter((_, idx) => idx !== i))} style={{ background: "none", border: "none", color: P.ghost, cursor: "pointer", fontSize: "0.9rem", padding: 0, lineHeight: 1 }} aria-label={`Remove deliverable ${d}`}>x</button>
          </span>
        ))}
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), add())} placeholder="Add deliverable..." style={{ ...inputStyle, flex: 1 }} />
        <button onClick={add} type="button" style={{ ...btnPrimary(false), padding: "10px 16px", fontSize: "0.85rem" }}>+</button>
      </div>
    </div>
  );
};

// ─── Color Picker ───────────────────────────────────────
const ColorPicker = ({ selected, onChange }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
    {AVAILABLE_COLORS.map(c => {
      const active = selected.includes(c.value);
      return (
        <button key={c.value} type="button"
          onClick={() => {
            if (active) onChange(selected.filter(s => s !== c.value));
            else if (selected.length < 2) onChange([...selected, c.value]);
          }}
          style={{
            width: "36px", height: "36px", borderRadius: "50%",
            background: COLOR_MAP[c.value], border: active ? `3px solid ${P.ghost}` : `2px solid ${P.steel}`,
            cursor: "pointer", position: "relative", transition: "transform 0.15s",
            transform: active ? "scale(1.15)" : "scale(1)",
          }}
          title={c.label}
          aria-label={`${active ? 'Remove' : 'Select'} color ${c.label}`}
        />
      );
    })}
  </div>
);

// ─── Single Item Editor ─────────────────────────────────
const ItemEditor = ({ item, index, onUpdate, onRemove, categoryConfig }) => {
  const fields = categoryConfig.fields;
  const update = (key, val) => onUpdate(index, { ...item, [key]: val });

  return (
    <div style={{ ...cardStyle, border: `1px solid ${P.cyan}30`, position: "relative" }}>
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        {/* Thumbnail */}
        <div style={{ flexShrink: 0 }}>
          {item.thumbnailUrl && item.mediaType === "video" ? (
            <div style={{ position: "relative", width: "120px", height: "120px", borderRadius: "6px", overflow: "hidden", border: `1px solid ${P.steel}` }}>
              <video src={item.thumbnailUrl} muted style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: `${P.abyss}55` }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${P.abyss}99`, border: `2px solid ${P.amber}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: P.amber, fontSize: 13, marginLeft: 2 }}>{"\u25B6"}</span>
                </div>
              </div>
              <div style={{ position: "absolute", bottom: 4, left: 4, background: `${P.amber}22`, color: P.amber, padding: "1px 6px", borderRadius: "3px", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.05em" }}>VIDEO</div>
            </div>
          ) : item.thumbnailUrl ? (
            <img src={item.thumbnailUrl} alt={item.title || item.filename} style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "6px", border: `1px solid ${P.steel}` }} />
          ) : (
            <div style={{ width: "120px", height: "120px", background: P.deep, borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${P.steel}`, fontSize: "0.7rem", color: P.steel, textAlign: "center", padding: "8px" }}>
              {item.filename || "No media"}
            </div>
          )}
        </div>

        {/* Core fields: Title + Subcategory */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <label style={labelStyle}>Title</label>
            <input value={item.title || ""} onChange={e => update("title", e.target.value)} style={inputStyle} placeholder="Enter title..." />
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Subcategory</label>
              <select value={item.subcategory || ""} onChange={e => update("subcategory", e.target.value)} style={inputStyle}>
                <option value="">Select...</option>
                {categoryConfig.subcategories.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {fields.includes("year") && (
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Year</label>
                <input value={item.year || ""} onChange={e => update("year", e.target.value)} style={inputStyle} placeholder="2025" />
              </div>
            )}
            {fields.includes("duration") && (
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Duration</label>
                <input value={item.duration || ""} onChange={e => update("duration", e.target.value)} style={inputStyle} placeholder="0:30" />
              </div>
            )}
          </div>
        </div>

        {/* Remove button */}
        <button onClick={() => onRemove(index)} style={{ position: "absolute", top: "12px", right: "12px", background: `${P.magenta}20`, border: `1px solid ${P.magenta}40`, color: P.magenta, padding: "4px 10px", borderRadius: "4px", cursor: "pointer", fontSize: "0.8rem" }} aria-label={`Remove item ${item.title || item.filename}`}>
          Remove
        </button>
      </div>

      {/* Extended fields */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {fields.includes("role") && (
          <div>
            <label style={labelStyle}>Role</label>
            <input value={item.role || ""} onChange={e => update("role", e.target.value)} style={inputStyle} placeholder="Creative Director / Designer" />
          </div>
        )}
        {fields.includes("process") && (
          <div>
            <label style={labelStyle}>Process</label>
            <input value={item.process || ""} onChange={e => update("process", e.target.value)} style={inputStyle} placeholder="Midjourney -> Photoshop" />
          </div>
        )}
        {fields.includes("type") && (
          <div>
            <label style={labelStyle}>Type</label>
            <select value={item.type || ""} onChange={e => update("type", e.target.value)} style={inputStyle}>
              <option value="">Select type...</option>
              {categoryConfig.subcategories.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        )}
        {fields.includes("brief") && (
          <div>
            <label style={labelStyle}>Brief</label>
            <textarea value={item.brief || ""} onChange={e => update("brief", e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical" }} placeholder="What was the challenge? What needed to be solved?" />
          </div>
        )}
        {fields.includes("approach") && (
          <div>
            <label style={labelStyle}>Approach</label>
            <textarea value={item.approach || ""} onChange={e => update("approach", e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical" }} placeholder="How did you approach the problem? What was the creative direction?" />
          </div>
        )}
        {fields.includes("description") && (
          <div>
            <label style={labelStyle}>Description</label>
            <textarea value={item.description || ""} onChange={e => update("description", e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical" }} placeholder="Describe the piece..." />
          </div>
        )}
        {fields.includes("deliverables") && (
          <div>
            <label style={labelStyle}>Deliverables</label>
            <DeliverablesInput items={item.deliverables || []} onChange={v => update("deliverables", v)} />
          </div>
        )}
        {fields.includes("tags") && (
          <div>
            <label style={labelStyle}>Tags</label>
            <TagInput tags={item.tags || []} onChange={v => update("tags", v)} />
          </div>
        )}
        {fields.includes("colors") && (
          <div>
            <label style={labelStyle}>Colors (pick up to 2)</label>
            <ColorPicker selected={item.colors || []} onChange={v => update("colors", v)} />
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Map existing data into uniform shape ───────────────
function mapExisting(items, cat) {
  return items.map((item, i) => ({
    id: item.id || `${cat}-existing-${i}`,
    title: item.title || item.name || "Untitled",
    category: cat,
    subcategory: item.category || item.type || item.series || "",
    description: item.description || item.desc || "",
    brief: item.brief || "",
    approach: item.approach || "",
    deliverables: item.deliverables || [],
    tags: item.tags || [],
    year: item.year || "",
    role: item.role || "",
    process: item.process || "",
    duration: item.duration || "",
    type: item.type || "",
    colors: (item.colors || []).map(c => {
      const found = AVAILABLE_COLORS.find(ac => COLOR_MAP[ac.value] === c);
      return found ? found.value : null;
    }).filter(Boolean),
    img: item.img || item.src || "",
    mediaType: item.mediaType || (isVideoUrl(item.img || item.src || "") ? "video" : "image"),
    isLive: true,
  }));
}

// ─── Slugify helper ─────────────────────────────────────
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ─── Main Component ─────────────────────────────────────
export const UploadAdmin = () => {
  /* auth state — simple client-side gate (no server needed) */
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  /* content state */
  const [category, setCategory] = useState("design");
  const [items, setItems] = useState([]);
  const [liveItems, setLiveItems] = useState([]);
  const [activeView, setActiveView] = useState("new");
  const [filterCat, setFilterCat] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef(null);

  const categoryConfig = CATEGORIES[category];

  /* check stored session */
  useEffect(() => {
    const token = sessionStorage.getItem("admin_token");
    if (token) setAuthed(true);
  }, []);

  /* load existing data once authed */
  useEffect(() => {
    if (!authed) return;
    const all = [
      ...mapExisting(PIECES, "curated"),
      ...mapExisting(DESIGN_PROJECTS, "design"),
      ...mapExisting(PHOTO_GALLERY, "photography"),
      ...mapExisting(AI_WORKS, "ai-human"),
      ...mapExisting(MOTION_WORKS, "motion"),
    ];
    setLiveItems(all);
  }, [authed]);

  /* login — client-side only, no API needed */
  const handleLogin = () => {
    // Simple hash check — not military-grade, but keeps random visitors out.
    // Change this passphrase to whatever you want.
    const ADMIN_PASS = "gh0st2024";
    if (password === ADMIN_PASS) {
      sessionStorage.setItem("admin_token", "local-admin");
      setAuthed(true);
      setAuthError("");
    } else {
      setAuthError("Invalid password");
    }
  };

  /* delete a live item */
  const handleDeleteLive = (id) => {
    setLiveItems(prev => prev.filter(item => item.id !== id));
    setConfirmDeleteId(null);
  };

  // ─── Add files as staged items with thumbnails ─────
  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newItems = selectedFiles.map(file => {
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ").replace(/PXL \d{8} \d+/i, "Untitled");
      const isVideo = file.type.startsWith("video/") || isVideoFile(file.name);
      return {
        file,
        filename: file.name,
        thumbnailUrl: URL.createObjectURL(file),
        mediaType: isVideo ? "video" : "image",
        title: cleanName,
        subcategory: "",
        year: new Date().getFullYear().toString(),
        role: "",
        brief: "",
        approach: "",
        description: "",
        process: "",
        duration: "",
        type: "",
        deliverables: [],
        tags: [],
        colors: [],
      };
    });
    setItems(prev => [...prev, ...newItems]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const updateItem = (index, updated) => {
    setItems(prev => prev.map((it, i) => i === index ? updated : it));
  };

  const removeItem = (index) => {
    setItems(prev => {
      const removed = prev[index];
      if (removed.thumbnailUrl) URL.revokeObjectURL(removed.thumbnailUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  // ─── Generate code using public/ folder paths ────────
  const generateCode = () => {
    if (items.length === 0) return "// No items staged yet.";

    const folder = categoryConfig.folder;
    const arrayName = category === "design" ? "DESIGN_PROJECTS" :
                      category === "photography" ? "PHOTO_GALLERY" :
                      category === "ai-human" ? "AI_WORKS" :
                      category === "motion" ? "MOTION_WORKS" : "CURATED_WORKS";

    const lines = items.map((it, i) => {
      const id = `${category.charAt(0)}${Date.now().toString(36)}${i}`;
      const colorsStr = it.colors.length > 0 ? `[${it.colors.join(", ")}]` : "[]";
      const tagsStr = it.tags.length > 0 ? `[${it.tags.map(t => `"${t}"`).join(", ")}]` : "[]";

      // Build the public/ path from the filename
      const filePath = `/images/${folder}/${it.filename}`;

      let obj = `  { id: "${id}", title: "${it.title}", img: "${filePath}"`;
      if (it.mediaType === "video") obj += `, mediaType: "video"`;

      if (it.subcategory) obj += `, category: "${it.subcategory}"`;
      if (it.year && categoryConfig.fields.includes("year")) obj += `, year: "${it.year}"`;
      if (it.role) obj += `, role: "${it.role}"`;
      if (it.brief) obj += `, brief: "${it.brief.replace(/"/g, '\\"')}"`;
      if (it.approach) obj += `, approach: "${it.approach.replace(/"/g, '\\"')}"`;
      if (it.description) obj += `, description: "${it.description.replace(/"/g, '\\"')}"`;
      if (it.process) obj += `, process: "${it.process}"`;
      if (it.duration) obj += `, duration: "${it.duration}"`;
      if (it.type) obj += `, type: "${it.type}"`;
      if (it.deliverables && it.deliverables.length > 0) obj += `, deliverables: [${it.deliverables.map(d => `"${d}"`).join(", ")}]`;
      obj += `, colors: ${colorsStr}, tags: ${tagsStr}`;
      obj += ` }`;
      return obj;
    });

    const fileList = items.map(it => `//   ${it.filename}  -->  public/images/${folder}/${it.filename}`).join("\n");

    return `// ─── STEP 1: Copy these files into your public/ folder ───\n${fileList}\n\n// ─── STEP 2: Add to ${arrayName} in src/data/portfolio.js ───\n[\n${lines.join(",\n")}\n]`;
  };

  const handleGenerateCode = () => {
    setShowCode(true);
  };

  const itemCount = items.length;

  const filteredLive = liveItems.filter(item => {
    if (filterCat !== "all" && item.category !== filterCat) return false;
    if (searchTerm && !item.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  /* ── LOGIN GATE ── */
  if (!authed) {
    return (
      <div style={{ background: P.abyss, color: P.ghost, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <SEO title="Admin Login | RareGh0st" description="Restricted access" />
        <div style={{ ...cardStyle, maxWidth: "400px", width: "100%", textAlign: "center" }}>
          <h1 style={{ color: P.cyan, fontSize: "1.6rem", marginBottom: "8px" }}>Admin Access</h1>
          <p style={{ color: P.steel, marginBottom: "24px", fontSize: "0.9rem" }}>Enter password to continue</p>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") handleLogin(); }}
            placeholder="Password"
            style={{ ...inputStyle, textAlign: "center", fontSize: "1rem", marginBottom: "16px" }}
            autoFocus
          />
          {authError && <p style={{ color: P.magenta, fontSize: "0.85rem", marginBottom: "12px" }}>{authError}</p>}
          <button onClick={handleLogin} style={{ ...btnPrimary(false), width: "100%" }}>
            Enter
          </button>
        </div>
      </div>
    );
  }

  /* ── MAIN ADMIN ── */
  return (
    <div style={{ background: P.abyss, color: P.ghost, minHeight: "100vh", padding: "40px 20px" }}>
      <SEO title="Content Manager - RareGh0st" description="Portfolio content management" />

      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <div>
            <h1 style={{ color: P.cyan, fontSize: "2rem", marginBottom: "6px" }}>Content Manager</h1>
            <p style={{ color: P.steel, fontSize: "0.9rem" }}>Stage files, tag & describe them, then generate code for your portfolio.</p>
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "center", fontSize: "0.85rem" }}>
            {itemCount > 0 && <span style={{ color: P.amber }}>{itemCount} staged</span>}
            <button onClick={() => { sessionStorage.removeItem("admin_token"); setAuthed(false); }} style={{ background: "none", border: `1px solid ${P.magenta}40`, color: P.magenta, padding: "6px 14px", borderRadius: "4px", cursor: "pointer", fontSize: "0.8rem" }}>Logout</button>
          </div>
        </div>

        {/* How it works banner */}
        <div style={{ ...cardStyle, border: `1px solid ${P.amber}30`, background: `${P.amber}08` }}>
          <h3 style={{ color: P.amber, fontSize: "0.9rem", marginBottom: "10px", letterSpacing: "0.05em" }}>HOW IT WORKS (NO CLOUD UPLOAD NEEDED)</h3>
          <ol style={{ color: P.ghost, fontSize: "0.85rem", lineHeight: 1.8, margin: 0, paddingLeft: "20px" }}>
            <li>Pick files below to <strong>stage</strong> them (they stay on your computer)</li>
            <li>Fill in titles, tags, descriptions, colors</li>
            <li>Click <strong>"Generate Code"</strong> to get the data snippet</li>
            <li>Copy the actual image/video files into <code style={{ color: P.cyan, background: `${P.cyan}12`, padding: "1px 6px", borderRadius: "3px" }}>public/images/{'{category}'}/</code></li>
            <li>Paste the generated code into <code style={{ color: P.cyan, background: `${P.cyan}12`, padding: "1px 6px", borderRadius: "3px" }}>src/data/portfolio.js</code></li>
            <li>Push to GitHub and Render auto-deploys</li>
          </ol>
        </div>

        {/* Stats bar */}
        <div style={{ ...cardStyle, display: "flex", gap: "30px", flexWrap: "wrap", padding: "16px 24px", marginBottom: "20px" }}>
          <div><span style={{ color: P.steel, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Live Items</span><div style={{ color: P.cyan, fontSize: "1.3rem", fontWeight: "700" }}>{liveItems.length}</div></div>
          <div><span style={{ color: P.steel, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Staged</span><div style={{ color: P.amber, fontSize: "1.3rem", fontWeight: "700" }}>{itemCount}</div></div>
        </div>

        {/* View tabs + filter bar */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px", alignItems: "center" }}>
          <button onClick={() => setActiveView("live")} style={{ background: activeView === "live" ? P.cyan : "transparent", color: activeView === "live" ? P.abyss : P.steel, border: `1px solid ${activeView === "live" ? P.cyan : P.steel}40`, borderRadius: "4px", padding: "8px 18px", cursor: "pointer", fontWeight: "600", fontSize: "0.85rem" }}>
            Live ({liveItems.length})
          </button>
          <button onClick={() => setActiveView("new")} style={{ background: activeView === "new" ? P.cyan : "transparent", color: activeView === "new" ? P.abyss : P.steel, border: `1px solid ${activeView === "new" ? P.cyan : P.steel}40`, borderRadius: "4px", padding: "8px 18px", cursor: "pointer", fontWeight: "600", fontSize: "0.85rem" }}>
            New ({items.length})
          </button>
          <div style={{ flex: 1 }} />
          {activeView === "live" && (
            <>
              <select value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ ...inputStyle, width: "auto" }}>
                <option value="all">All Categories</option>
                {Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
              <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search..." style={{ ...inputStyle, width: "160px" }} />
            </>
          )}
        </div>

        {/* ── LIVE ITEMS VIEW ── */}
        {activeView === "live" && (
          <div style={{ marginBottom: "30px" }}>
            {filteredLive.length === 0 ? (
              <div style={{ ...cardStyle, textAlign: "center", padding: "40px" }}><p style={{ color: P.steel }}>No items match your filter</p></div>
            ) : (
              filteredLive.map((item) => {
                const isExpanded = expandedId === item.id;
                const isConfirming = confirmDeleteId === item.id;
                return (
                <div key={item.id} style={{ ...cardStyle, border: `1px solid ${isExpanded ? P.cyan : P.cyan + "20"}`, transition: "border-color 0.2s" }}>
                  {/* Row header -- clickable to expand */}
                  <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", cursor: "pointer" }} onClick={() => setExpandedId(isExpanded ? null : item.id)}>
                    {item.img && (
                      <div style={{ position: "relative", width: "80px", height: "80px", borderRadius: "6px", overflow: "hidden", flexShrink: 0, border: `1px solid ${P.steel}40` }}>
                        {item.mediaType === "video" || isVideoUrl(item.img) ? (
                          <>
                            <video src={item.img} muted style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: `${P.abyss}44` }}>
                              <span style={{ color: P.amber, fontSize: 18 }}>{"\u25B6"}</span>
                            </div>
                            <div style={{ position: "absolute", bottom: 2, left: 2, background: `${P.amber}22`, color: P.amber, padding: "0px 4px", borderRadius: "2px", fontSize: "0.5rem", fontWeight: 700, letterSpacing: "0.04em" }}>VID</div>
                          </>
                        ) : (
                          <img src={item.img} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        )}
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                        <h3 style={{ color: P.ghost, fontSize: "1rem", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</h3>
                        <div style={{ display: "flex", gap: "6px", alignItems: "center", flexShrink: 0 }}>
                          <span style={{ background: `${P.cyan}15`, color: P.cyan, padding: "2px 10px", borderRadius: "10px", fontSize: "0.7rem" }}>LIVE</span>
                          <span style={{ color: P.steel, fontSize: "0.85rem" }}>{isExpanded ? "\u25B2" : "\u25BC"}</span>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "6px" }}>
                        <span style={{ color: P.steel, fontSize: "0.8rem" }}>{CATEGORIES[item.category]?.label || item.category}</span>
                        {item.subcategory && <span style={{ color: P.cyan, fontSize: "0.8rem" }}>{item.subcategory}</span>}
                        {item.year && <span style={{ color: P.steel, fontSize: "0.8rem" }}>{item.year}</span>}
                        {item.role && <span style={{ color: P.steel, fontSize: "0.8rem" }}>{item.role}</span>}
                      </div>
                      {!isExpanded && item.description && <p style={{ color: P.steel, fontSize: "0.8rem", margin: 0, lineHeight: 1.4 }}>{item.description.length > 120 ? item.description.slice(0, 120) + "..." : item.description}</p>}
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: `1px solid ${P.steel}20` }}>
                      {/* Full media preview */}
                      {item.img && (
                        <div style={{ marginBottom: "16px", borderRadius: "6px", overflow: "hidden", maxHeight: "300px" }}>
                          {item.mediaType === "video" || isVideoUrl(item.img) ? (
                            <video src={item.img} controls muted style={{ width: "100%", maxHeight: "300px", display: "block", background: P.abyss }} />
                          ) : (
                            <img src={item.img} alt={item.title} style={{ width: "100%", height: "auto", maxHeight: "300px", objectFit: "contain", display: "block" }} />
                          )}
                        </div>
                      )}

                      {/* Detail grid */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                        {item.description && <div style={{ gridColumn: "1 / -1" }}><span style={{ color: P.steel, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Description</span><p style={{ color: P.ghost, fontSize: "0.85rem", margin: "4px 0 0", lineHeight: 1.5 }}>{item.description}</p></div>}
                        {item.brief && <div><span style={{ color: P.steel, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Brief</span><p style={{ color: P.ghost, fontSize: "0.85rem", margin: "4px 0 0", lineHeight: 1.5 }}>{item.brief}</p></div>}
                        {item.approach && <div><span style={{ color: P.steel, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Approach</span><p style={{ color: P.ghost, fontSize: "0.85rem", margin: "4px 0 0", lineHeight: 1.5 }}>{item.approach}</p></div>}
                        {item.process && <div><span style={{ color: P.steel, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Process</span><p style={{ color: P.ghost, fontSize: "0.85rem", margin: "4px 0 0" }}>{item.process}</p></div>}
                        {item.duration && <div><span style={{ color: P.steel, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Duration</span><p style={{ color: P.ghost, fontSize: "0.85rem", margin: "4px 0 0" }}>{item.duration}</p></div>}
                        {item.type && <div><span style={{ color: P.steel, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Type</span><p style={{ color: P.ghost, fontSize: "0.85rem", margin: "4px 0 0" }}>{item.type}</p></div>}
                      </div>

                      {/* Tags */}
                      {item.tags.length > 0 && (
                        <div style={{ marginBottom: "16px" }}>
                          <span style={{ color: P.steel, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Tags</span>
                          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginTop: "6px" }}>
                            {item.tags.map((t, j) => <span key={j} style={{ background: `${P.cyan}12`, color: P.cyan, padding: "3px 10px", borderRadius: "10px", fontSize: "0.75rem" }}>{t}</span>)}
                          </div>
                        </div>
                      )}

                      {/* Deliverables */}
                      {item.deliverables && item.deliverables.length > 0 && (
                        <div style={{ marginBottom: "16px" }}>
                          <span style={{ color: P.steel, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Deliverables</span>
                          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginTop: "6px" }}>
                            {item.deliverables.map((d, j) => <span key={j} style={{ background: `${P.green}12`, color: P.green, padding: "3px 10px", borderRadius: "10px", fontSize: "0.75rem" }}>{d}</span>)}
                          </div>
                        </div>
                      )}

                      {/* Colors */}
                      {item.colors.length > 0 && (
                        <div style={{ marginBottom: "16px" }}>
                          <span style={{ color: P.steel, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Colors</span>
                          <div style={{ display: "flex", gap: "6px", marginTop: "6px" }}>
                            {item.colors.map((c, j) => <div key={j} style={{ width: "24px", height: "24px", borderRadius: "50%", background: COLOR_MAP[c] || c, border: `1px solid ${P.steel}40` }} />)}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "16px", paddingTop: "12px", borderTop: `1px solid ${P.steel}20` }}>
                        {!isConfirming ? (
                          <button onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(item.id); }} style={{ background: "none", border: `1px solid ${P.magenta}40`, color: P.magenta, padding: "8px 18px", borderRadius: "4px", cursor: "pointer", fontSize: "0.8rem" }}>
                            Delete Item
                          </button>
                        ) : (
                          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <span style={{ color: P.magenta, fontSize: "0.85rem" }}>Are you sure?</span>
                            <button onClick={(e) => { e.stopPropagation(); handleDeleteLive(item.id); }} style={{ background: P.magenta, color: P.abyss, border: "none", padding: "8px 18px", borderRadius: "4px", cursor: "pointer", fontSize: "0.8rem", fontWeight: "600" }}>
                              Yes, Delete
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(null); }} style={{ background: "none", border: `1px solid ${P.steel}40`, color: P.steel, padding: "8px 18px", borderRadius: "4px", cursor: "pointer", fontSize: "0.8rem" }}>
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );})
            )}
          </div>
        )}

        {/* ── NEW ITEMS VIEW ── */}
        {activeView === "new" && (
          <>
            {/* Category selector + file input */}
            <div style={{ ...cardStyle, display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "flex-end" }}>
              <div style={{ flex: "1 1 200px" }}>
                <label style={labelStyle}>Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} style={inputStyle}>
                  {Object.entries(CATEGORIES).map(([key, val]) => (
                    <option key={key} value={key}>{val.label}</option>
                  ))}
                </select>
              </div>
              <div style={{ flex: "2 1 300px" }}>
                <label style={labelStyle}>Add Images / Videos</label>
                <input ref={fileInputRef} type="file" multiple accept="image/*,video/*" onChange={handleFileSelect} style={inputStyle} />
              </div>
            </div>

            {/* File destination reminder */}
            {items.length > 0 && (
              <div style={{ ...cardStyle, padding: "14px 20px", border: `1px solid ${P.cyan}25`, background: `${P.cyan}06` }}>
                <p style={{ color: P.cyan, fontSize: "0.8rem", margin: 0 }}>
                  Files will go in: <code style={{ background: `${P.cyan}15`, padding: "2px 8px", borderRadius: "3px" }}>public/images/{categoryConfig.folder}/</code>
                </p>
              </div>
            )}

            {/* Staged items */}
            {items.length > 0 && (
              <div style={{ marginBottom: "30px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <h2 style={{ color: P.ghost, fontSize: "1.4rem" }}>
                    Items ({items.length})
                  </h2>
                  <button onClick={handleGenerateCode} disabled={itemCount === 0} style={btnPrimary(itemCount === 0)}>
                    Generate Code
                  </button>
                </div>

                {items.map((item, i) => (
                  <ItemEditor key={i} item={item} index={i} onUpdate={updateItem} onRemove={removeItem} categoryConfig={categoryConfig} />
                ))}
              </div>
            )}

            {/* Empty state */}
            {items.length === 0 && (
              <div style={{ ...cardStyle, textAlign: "center", padding: "60px 24px" }}>
                <p style={{ color: P.steel, fontSize: "1.1rem", marginBottom: "8px" }}>No items staged yet.</p>
                <p style={{ color: P.steel, fontSize: "0.85rem" }}>Select a category above and add images to get started.</p>
              </div>
            )}

            {/* Generated code */}
            {showCode && itemCount > 0 && (
              <div style={{ ...cardStyle, border: `1px solid ${P.green}40` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <h2 style={{ color: P.green, fontSize: "1.4rem" }}>Generated Code</h2>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generateCode());
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    style={{ ...btnPrimary(false), background: copied ? P.green : P.cyan, padding: "8px 16px", fontSize: "0.85rem" }}
                  >
                    {copied ? "Copied!" : "Copy to Clipboard"}
                  </button>
                </div>
                <pre style={{ background: P.abyss, padding: "20px", borderRadius: "6px", overflow: "auto", fontSize: "0.8rem", lineHeight: 1.6, border: `1px solid ${P.steel}40`, maxHeight: "400px" }}>
                  <code>{generateCode()}</code>
                </pre>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
