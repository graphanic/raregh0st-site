import { useState, useRef } from "react";
import { upload } from "@vercel/blob/client";
import { SEO } from "../components/SEO";
import { P } from "../data/palette";

// ─── Category / Subcategory map ─────────────────────────
const CATEGORIES = {
  design: {
    label: "Design",
    subcategories: ["esports", "sports", "merch", "branding", "identity", "broadcast", "apparel", "print", "events", "web"],
    fields: ["title", "year", "role", "brief", "approach", "description", "deliverables", "tags", "colors"],
  },
  photography: {
    label: "Photography",
    subcategories: ["landscape", "portrait", "urban", "abstract", "studio", "street", "night", "nature", "event", "editorial"],
    fields: ["title", "tags", "colors", "description"],
  },
  "ai-human": {
    label: "AI x Human",
    subcategories: ["ai-generated", "ai-adapted", "ai-animated", "angel-collab", "midjourney", "stable-diffusion"],
    fields: ["title", "process", "year", "description", "tags", "colors"],
  },
  motion: {
    label: "Motion",
    subcategories: ["animated-artwork", "video-art", "motion-design", "loop", "generative", "parallax"],
    fields: ["title", "duration", "type", "description", "tags", "colors"],
  },
  curated: {
    label: "Curated Works",
    subcategories: ["signature", "series", "collection"],
    fields: ["title", "description", "tags", "colors"],
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
    const val = input.trim().toLowerCase();
    if (val && !tags.includes(val)) { onChange([...tags, val]); }
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
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), add())} placeholder="Add tag..." style={{ ...inputStyle, flex: 1 }} />
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
          {item.thumbnailUrl ? (
            <img src={item.thumbnailUrl} alt={item.title || item.filename} style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "6px", border: `1px solid ${P.steel}` }} />
          ) : (
            <div style={{ width: "120px", height: "120px", background: P.deep, borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${P.steel}`, fontSize: "0.7rem", color: P.steel, textAlign: "center", padding: "8px" }}>
              {item.filename || "No image"}
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

// ─── Main Component ─────────────────────────────────────
export const UploadAdmin = () => {
  const [category, setCategory] = useState("design");
  const [items, setItems] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadedResults, setUploadedResults] = useState([]);
  const [showCode, setShowCode] = useState(false);
  const fileInputRef = useRef(null);

  const categoryConfig = CATEGORIES[category];

  // ─── Add files as staged items with thumbnails ─────
  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newItems = selectedFiles.map(file => {
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ").replace(/PXL \d{8} \d+/i, "Untitled");
      return {
        file,
        filename: file.name,
        thumbnailUrl: URL.createObjectURL(file),
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
        uploaded: false,
        uploadUrl: null,
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

  // ─── Upload all staged items ──────────────────────
  const uploadAll = async () => {
    const toUpload = items.filter(it => !it.uploaded && it.file);
    if (toUpload.length === 0) return;

    setUploading(true);
    const results = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.uploaded || !item.file) continue;

      try {
        setUploadProgress(prev => ({ ...prev, [i]: { status: "uploading", progress: 0 } }));

        const blob = await upload(item.file.name, item.file, {
          access: "public",
          handleUploadUrl: "/api/upload",
          onUploadProgress: ({ percentage }) => {
            setUploadProgress(prev => ({ ...prev, [i]: { status: "uploading", progress: Math.round(percentage) } }));
          },
        });

        setUploadProgress(prev => ({ ...prev, [i]: { status: "complete", progress: 100 } }));

        setItems(prev => prev.map((it, idx) => idx === i ? { ...it, uploaded: true, uploadUrl: blob.url } : it));
        results.push({ index: i, url: blob.url, success: true });
      } catch (error) {
        setUploadProgress(prev => ({ ...prev, [i]: { status: "error", progress: 0 } }));
        results.push({ index: i, error: error.message, success: false });
      }
    }

    setUploadedResults(results);
    setUploading(false);
    setShowCode(true);
  };

  // ─── Generate code ────────────────────────────────
  const generateCode = () => {
    const uploaded = items.filter(it => it.uploaded && it.uploadUrl);
    if (uploaded.length === 0) return "// No uploaded items yet.";

    const arrayName = category === "design" ? "DESIGN_PROJECTS" :
                      category === "photography" ? "PHOTO_GALLERY" :
                      category === "ai-human" ? "AI_WORKS" :
                      category === "motion" ? "MOTION_WORKS" : "CURATED_WORKS";

    const lines = uploaded.map((it, i) => {
      const id = `${category.charAt(0)}${Date.now().toString(36)}${i}`;
      const colorsStr = it.colors.length > 0 ? `[${it.colors.join(", ")}]` : "[]";
      const tagsStr = it.tags.length > 0 ? `[${it.tags.map(t => `"${t}"`).join(", ")}]` : "[]";

      let obj = `  { id: "${id}", title: "${it.title}", img: "${it.uploadUrl}"`;

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

    return `// Add to ${arrayName} in src/data/portfolio.js:\n[\n${lines.join(",\n")}\n]`;
  };

  const stagedCount = items.filter(it => !it.uploaded).length;
  const uploadedCount = items.filter(it => it.uploaded).length;

  return (
    <div style={{ background: P.abyss, color: P.ghost, minHeight: "100vh", padding: "40px 20px" }}>
      <SEO title="Content Manager - RareGh0st" description="Portfolio content management" />

      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <div>
            <h1 style={{ color: P.cyan, fontSize: "2rem", marginBottom: "6px" }}>Content Manager</h1>
            <p style={{ color: P.steel, fontSize: "0.9rem" }}>Upload, tag, describe, and generate portfolio code.</p>
          </div>
          <div style={{ display: "flex", gap: "12px", fontSize: "0.85rem" }}>
            {stagedCount > 0 && <span style={{ color: P.amber }}>{stagedCount} staged</span>}
            {uploadedCount > 0 && <span style={{ color: P.green }}>{uploadedCount} uploaded</span>}
          </div>
        </div>

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
            <label style={labelStyle}>Add Images</label>
            <input ref={fileInputRef} type="file" multiple accept="image/*,video/*" onChange={handleFileSelect} style={inputStyle} />
          </div>
        </div>

        {/* Staged items */}
        {items.length > 0 && (
          <div style={{ marginBottom: "30px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={{ color: P.ghost, fontSize: "1.4rem" }}>
                Items ({items.length})
              </h2>
              <button onClick={uploadAll} disabled={uploading || stagedCount === 0} style={btnPrimary(uploading || stagedCount === 0)}>
                {uploading ? "Uploading..." : `Upload ${stagedCount} item(s)`}
              </button>
            </div>

            {items.map((item, i) => (
              <div key={i} style={{ position: "relative" }}>
                {/* Progress overlay */}
                {uploadProgress[i] && uploadProgress[i].status === "uploading" && (
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 2, padding: "0 24px" }}>
                    <div style={{ height: "3px", background: P.deep, borderRadius: "2px", overflow: "hidden" }}>
                      <div style={{ width: `${uploadProgress[i].progress}%`, height: "100%", background: P.cyan, transition: "width 0.3s ease" }} />
                    </div>
                    <span style={{ fontSize: "0.75rem", color: P.cyan }}>{uploadProgress[i].progress}%</span>
                  </div>
                )}
                {uploadProgress[i] && uploadProgress[i].status === "complete" && (
                  <div style={{ position: "absolute", top: "12px", left: "24px", zIndex: 2, fontSize: "0.75rem", color: P.green, background: `${P.green}15`, padding: "2px 10px", borderRadius: "10px" }}>
                    Uploaded
                  </div>
                )}
                {uploadProgress[i] && uploadProgress[i].status === "error" && (
                  <div style={{ position: "absolute", top: "12px", left: "24px", zIndex: 2, fontSize: "0.75rem", color: P.magenta, background: `${P.magenta}15`, padding: "2px 10px", borderRadius: "10px" }}>
                    Error
                  </div>
                )}

                <ItemEditor item={item} index={i} onUpdate={updateItem} onRemove={removeItem} categoryConfig={categoryConfig} />
              </div>
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
        {showCode && uploadedCount > 0 && (
          <div style={{ ...cardStyle, border: `1px solid ${P.green}40` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={{ color: P.green, fontSize: "1.4rem" }}>Generated Code</h2>
              <button onClick={() => navigator.clipboard.writeText(generateCode())} style={{ ...btnPrimary(false), background: P.green, padding: "8px 16px", fontSize: "0.85rem" }}>
                Copy to Clipboard
              </button>
            </div>
            <pre style={{ background: P.abyss, padding: "20px", borderRadius: "6px", overflow: "auto", fontSize: "0.8rem", lineHeight: 1.6, border: `1px solid ${P.steel}40`, maxHeight: "400px" }}>
              <code>{generateCode()}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
