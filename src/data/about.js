export const ABOUT_SECTIONS = Object.freeze([
  { id: "artist", label: "The Artist", title: "I make inner worlds visible." },
  { id: "work", label: "The Work", title: "Each work is an excavation." },
  { id: "inside", label: "Inside the Work", title: "550+ layers. One resolved world." },
  { id: "symbols", label: "Symbol Field", title: "Forms return. Their meaning changes." },
  { id: "method", label: "The Method", title: "Discovery becomes structure." },
  { id: "human", label: "Behind the Signal", title: "A person remains behind every layer." },
  { id: "return", label: "Return", title: "Look longer. Follow the symbols." },
]);

export const ABOUT_DISCOVERIES = Object.freeze([
  { workId: "1", crop: "50% 42%", note: "Consciousness under pressure" },
  { workId: "3", crop: "47% 36%", note: "The figure at the centre" },
  { workId: "4", crop: "52% 30%", note: "Sacred and fractured" },
]);

export const ABOUT_SYMBOLS = Object.freeze([
  {
    id: "watching-eyes",
    label: "Watching eyes",
    association: "Eyes recur as witnesses: looking outward, looking inward, and refusing the comfort of an unwatched world.",
    workIds: ["3", "4"],
    evidence: [
      "The Boy Who Walked Out of the Storm describes every eye watching.",
      "The Beast identifies a weeping third eye.",
    ],
  },
  {
    id: "skulls",
    label: "Skulls",
    association: "Skulls hold mortality in full view while the surrounding worlds continue to move, glow, fracture, and rebuild.",
    workIds: ["1", "4"],
    evidence: [
      "Sanity Is In Rare Supply explicitly centres a seeing skull.",
      "The Beast is publicly catalogued with the skull motif.",
    ],
  },
  {
    id: "spirals-fractals",
    label: "Spirals + fractals",
    association: "Repeating patterns turn accumulation into structure: a visual record of complexity resolving without becoming simple.",
    workIds: ["1", "3"],
    evidence: [
      "Sanity Is In Rare Supply is described as a fractal meditation.",
      "The Boy Who Walked Out of the Storm describes every pattern spiralling.",
    ],
  },
]);

export const ABOUT_METHOD = Object.freeze([
  { id: "observe", label: "Observe", body: "Begin with atmosphere, tension, or an image that will not let go." },
  { id: "gather", label: "Gather", body: "Collect photographs, fragments, symbols, textures, and generated material." },
  { id: "layer", label: "Layer", body: "Let one image call forth another until relationships begin to surface." },
  { id: "dialogue", label: "Dialogue", body: "Test what each element changes in the meaning of the whole." },
  { id: "edit", label: "Edit", body: "Remove noise, redirect attention, and give the internal order room to appear." },
  { id: "complete", label: "Complete", body: "Stop when the composition can hold its contradictions without explanation." },
]);

export const ABOUT_HUMAN_ANCHORS = Object.freeze([
  {
    id: "image-language",
    title: "Where images began",
    body: "When ordinary words failed, images became a second language—a place where contradiction and meaning could exist together.",
    image: "https://0at986lkng8uss8h.public.blob.vercel-storage.com/20-wvmXjmJW2nc3nnVRelNtBQYM84AmuN.png",
    imageAlt: "Eric Fallis in winter workwear during blue hour in Calgary",
  },
  {
    id: "studio-practice",
    title: "A cumulative practice",
    body: "The studio process is obsessive, intuitive, and cumulative. One image calls forth another until an internal order begins to appear.",
    image: null,
    imageAlt: "",
  },
  {
    id: "mediums",
    title: "Across mediums",
    body: "Photoshop, photography, illustration, symbolic collage, motion, and AI-assisted material meet inside one evolving visual language.",
    image: null,
    imageAlt: "",
  },
  {
    id: "room-for-play",
    title: "Room for play",
    body: "Jokes, cultural fragments, absurdity, and moments of light remain in conversation with the heavier material.",
    image: null,
    imageAlt: "",
  },
]);

export function getAboutManifestErrors({
  sections = ABOUT_SECTIONS,
  symbols = ABOUT_SYMBOLS,
  humanAnchors = ABOUT_HUMAN_ANCHORS,
} = {}, validWorkIds = []) {
  const errors = [];
  const validateUniqueIds = (items, label) => {
    const ids = items.map((item) => item.id);
    if (ids.some((id) => typeof id !== "string" || !id.trim()) || new Set(ids).size !== ids.length) {
      errors.push(`${label} IDs must be present and unique.`);
    }
  };

  validateUniqueIds(sections, "Section");
  validateUniqueIds(symbols, "Symbol");
  validateUniqueIds(humanAnchors, "Human anchor");

  if (humanAnchors.length !== 4) errors.push("The About page must contain exactly four human anchors.");

  const knownWorkIds = new Set(validWorkIds.map(String));
  symbols.forEach((symbol) => {
    if (!symbol.label?.trim() || !symbol.association?.trim()) {
      errors.push(`Symbol ${symbol.id || "(missing id)"} requires a label and association.`);
    }
    if (!Array.isArray(symbol.evidence) || symbol.evidence.length < 2 || symbol.evidence.some((item) => !item?.trim())) {
      errors.push(`Symbol ${symbol.id || "(missing id)"} requires demonstrated public evidence.`);
    }
    if (!Array.isArray(symbol.workIds) || symbol.workIds.length < 2) {
      errors.push(`Symbol ${symbol.id || "(missing id)"} must reference at least two works.`);
    }
    symbol.workIds?.forEach((workId) => {
      if (knownWorkIds.size && !knownWorkIds.has(String(workId))) {
        errors.push(`Symbol ${symbol.id || "(missing id)"} references unknown work ${workId}.`);
      }
    });
  });

  humanAnchors.forEach((anchor) => {
    if (!anchor.title?.trim() || !anchor.body?.trim()) {
      errors.push(`Human anchor ${anchor.id || "(missing id)"} requires a title and body.`);
    }
  });

  return errors;
}
