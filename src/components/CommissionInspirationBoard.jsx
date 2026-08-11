import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  PORTFOLIO_CATEGORIES,
  PORTFOLIO_WORKS,
  getCategory,
  getWorkById,
  getWorkHref,
} from "../data/catalog";
import {
  MAX_PORTFOLIO_REFERENCES,
  MAX_REFERENCE_NOTE_LENGTH,
  MAX_UPLOAD_REFERENCES,
  createPortfolioReference,
  referenceKey,
} from "../lib/commissionReferences";

const posterFor = (src) => (
  src && src.startsWith("/") && /\.mp4$/i.test(src)
    ? src.replace(/\.mp4$/i, ".jpg")
    : undefined
);

function ReferenceMedia({ reference, alt = "" }) {
  if (reference.previewUrl) {
    return <img src={reference.previewUrl} alt={alt} />;
  }
  if (reference.mediaType === "video" && reference.img) {
    return <video src={reference.img} poster={posterFor(reference.img)} muted playsInline preload="metadata" aria-label={alt} />;
  }
  if (reference.img) {
    return <img src={reference.img} alt={alt} />;
  }
  return <div className="commission-reference-fallback" aria-hidden />;
}

function ReferenceCard({ reference, onNoteChange, onRemove }) {
  const [editing, setEditing] = useState(Boolean(reference.note));
  const work = reference.type === "portfolio" ? getWorkById(reference.workId) : null;
  const title = reference.type === "portfolio" ? reference.title : reference.originalName;
  const label = reference.type === "portfolio" ? "Inspired by…" : "Reference photo";
  const media = {
    ...reference,
    img: reference.img || work?.img,
    mediaType: reference.mediaType || work?.mediaType,
  };

  return (
    <article className="commission-reference-card">
      <div className="commission-reference-card-main">
        <div className="commission-reference-thumb">
          <ReferenceMedia reference={media} alt="" />
        </div>
        <div className="commission-reference-copy">
          <div className="commission-reference-label">{label}</div>
          {work ? (
            <Link to={getWorkHref(work)}>{title} ↗</Link>
          ) : (
            <div className="commission-reference-title">{title}</div>
          )}
          {reference.note && !editing && <p>{reference.note}</p>}
        </div>
        <div className="commission-reference-actions">
          <button type="button" onClick={() => setEditing((value) => !value)} aria-expanded={editing}>
            {editing ? "Hide note" : reference.note ? "Edit note" : "Describe"}
          </button>
          <button type="button" onClick={() => onRemove(reference)} aria-label={`Remove ${title} from inspiration board`}>
            Remove
          </button>
        </div>
      </div>
      {editing && (
        <label className="commission-reference-note">
          <span>What specifically inspires you here?</span>
          <textarea
            rows={3}
            maxLength={MAX_REFERENCE_NOTE_LENGTH}
            value={reference.note || ""}
            onChange={(event) => onNoteChange(reference, event.target.value)}
            placeholder="A mood, colour, symbol, texture, composition, memory…"
          />
          <small>{(reference.note || "").length} / {MAX_REFERENCE_NOTE_LENGTH}</small>
        </label>
      )}
    </article>
  );
}

function PortfolioPicker({ selectedReferences, onConfirm, onClose }) {
  const panelRef = useRef(null);
  const searchRef = useRef(null);
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState(() => new Set(selectedReferences.map((reference) => reference.workId)));
  const [limitError, setLimitError] = useState("");

  const filteredWorks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return PORTFOLIO_WORKS.filter((work) => {
      if (category !== "all" && work.primaryCategory !== category) return false;
      if (!normalizedQuery) return true;
      const haystack = [work.title, work.series, work.description, ...(work.tags || [])].filter(Boolean).join(" ").toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [category, query]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousActive = document.activeElement;
    document.body.style.overflow = "hidden";
    const frame = window.requestAnimationFrame(() => searchRef.current?.focus());

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = [...panelRef.current.querySelectorAll('button:not([disabled]), input:not([disabled]), [href], textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')];
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousActive?.focus?.();
    };
  }, [onClose]);

  const toggleWork = (work) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(work.id)) {
        next.delete(work.id);
        setLimitError("");
        return next;
      }
      if (next.size >= MAX_PORTFOLIO_REFERENCES) {
        setLimitError(`Choose up to ${MAX_PORTFOLIO_REFERENCES} portfolio artworks.`);
        return current;
      }
      next.add(work.id);
      setLimitError("");
      return next;
    });
  };

  const confirmSelection = () => {
    const previousById = new Map(selectedReferences.map((reference) => [reference.workId, reference]));
    const references = [...selectedIds].flatMap((id) => {
      const work = getWorkById(id);
      if (!work) return [];
      return [createPortfolioReference(work, previousById.get(id)?.note || "")];
    });
    onConfirm(references);
  };

  return (
    <div className="portfolio-picker-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section ref={panelRef} className="portfolio-picker" role="dialog" aria-modal="true" aria-labelledby="portfolio-picker-title">
        <header className="portfolio-picker-header">
          <div>
            <div className="portfolio-picker-kicker">Build your visual story</div>
            <h3 id="portfolio-picker-title">Choose work that carries the feeling.</h3>
            <p>Select up to {MAX_PORTFOLIO_REFERENCES} artworks. You can describe each one after adding it.</p>
          </div>
          <button type="button" onClick={onClose}>Close</button>
        </header>

        <div className="portfolio-picker-tools">
          <label>
            <span className="sr-only">Search portfolio artworks</span>
            <input ref={searchRef} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search titles, symbols, or tags" />
          </label>
          <div className="portfolio-picker-count" aria-live="polite">{selectedIds.size} / {MAX_PORTFOLIO_REFERENCES} selected</div>
        </div>

        <div className="portfolio-picker-categories" aria-label="Filter portfolio categories">
          <button type="button" aria-pressed={category === "all"} onClick={() => setCategory("all")}>All work</button>
          {PORTFOLIO_CATEGORIES.map((item) => (
            <button key={item.id} type="button" aria-pressed={category === item.id} onClick={() => setCategory(item.id)}>
              {item.label}
            </button>
          ))}
        </div>

        <div
          className={`portfolio-picker-error${limitError ? "" : " is-empty"}`}
          role={limitError ? "alert" : undefined}
          aria-live="polite"
        >
          {limitError}
        </div>

        <div className="portfolio-picker-grid">
          {filteredWorks.map((work) => {
            const selected = selectedIds.has(work.id);
            const workCategory = getCategory(work.primaryCategory);
            return (
              <button key={work.id} type="button" className="portfolio-picker-card" aria-pressed={selected} onClick={() => toggleWork(work)}>
                <span className="portfolio-picker-media">
                  <ReferenceMedia reference={work} alt="" />
                  <span className="portfolio-picker-state">{selected ? "Selected" : "Use as inspiration"}</span>
                </span>
                <span className="portfolio-picker-card-copy">
                  <small>{workCategory?.label || "Portfolio"}</small>
                  <strong>{work.title}</strong>
                </span>
              </button>
            );
          })}
          {filteredWorks.length === 0 && <div className="portfolio-picker-empty">No portfolio work matches that search.</div>}
        </div>

        <footer className="portfolio-picker-footer">
          <span>{selectedIds.size === 0 ? "You can also continue with photo references only." : `${selectedIds.size} artwork${selectedIds.size === 1 ? "" : "s"} ready to add.`}</span>
          <div>
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="button" onClick={confirmSelection}>Add selected work</button>
          </div>
        </footer>
      </section>
    </div>
  );
}

export function CommissionInspirationBoard({
  references,
  onPortfolioChange,
  onFilesSelected,
  onNoteChange,
  onRemove,
  uploadBusy,
  uploadError,
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const portfolioReferences = references.filter((reference) => reference.type === "portfolio");
  const uploadReferences = references.filter((reference) => reference.type === "upload");
  const canAddPortfolio = portfolioReferences.length < MAX_PORTFOLIO_REFERENCES;
  const canUpload = uploadReferences.length < MAX_UPLOAD_REFERENCES;

  return (
    <section className="commission-inspiration-board" aria-labelledby="commission-inspiration-title">
      <div className="commission-inspiration-heading">
        <div>
          <div className="commission-inspiration-kicker">Inspired by</div>
          <h3 id="commission-inspiration-title">Gather the visual threads of your story.</h3>
        </div>
        <p>{portfolioReferences.length} / {MAX_PORTFOLIO_REFERENCES} artworks · {uploadReferences.length} / {MAX_UPLOAD_REFERENCES} photos</p>
      </div>

      {references.length > 0 ? (
        <div className="commission-reference-list">
          {references.map((reference) => (
            <ReferenceCard
              key={referenceKey(reference)}
              reference={reference}
              onNoteChange={onNoteChange}
              onRemove={onRemove}
            />
          ))}
        </div>
      ) : (
        <div className="commission-inspiration-empty">
          Choose work from the portfolio or add a personal photo. Each reference can hold its own note about the feeling, symbol, colour, or composition you want to carry forward.
        </div>
      )}

      <div className="commission-inspiration-controls">
        <button type="button" onClick={() => setPickerOpen(true)} disabled={!canAddPortfolio}>
          {canAddPortfolio ? "Add from portfolio" : "Portfolio limit reached"}
        </button>
        <label aria-disabled={!canUpload || uploadBusy}>
          <input
            className="sr-only"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            disabled={!canUpload || uploadBusy}
            onChange={(event) => {
              onFilesSelected([...event.target.files]);
              event.target.value = "";
            }}
          />
          <span>{uploadBusy ? "Preparing photo…" : canUpload ? "Upload reference photo" : "Photo limit reached"}</span>
        </label>
      </div>
      <div className="commission-inspiration-help">Private reference photos are prepared in your browser, stripped of embedded metadata, and shared only with the studio.</div>
      {uploadError && <div className="commission-inspiration-error" role="alert">{uploadError}</div>}

      {pickerOpen && (
        <PortfolioPicker
          selectedReferences={portfolioReferences}
          onConfirm={(nextPortfolio) => {
            onPortfolioChange(nextPortfolio);
            setPickerOpen(false);
          }}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </section>
  );
}
