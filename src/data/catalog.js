import { P } from "./palette.js";
import { PIECES } from "./pieces.js";
import {
  AI_WORKS,
  CURATED_WORKS,
  DESIGN_PROJECTS,
  MOTION_WORKS,
  PHOTO_GALLERY,
} from "./portfolio.js";

export const PORTFOLIO_CATEGORIES = [
  {
    id: "photoshop-originals",
    label: "Photoshop Originals",
    icon: "✦",
    color: P.magenta,
    description: "Original compositions authored in Photoshop — including works built with thoughtfully chosen AI-assisted assets.",
    filterLabel: "Series",
  },
  {
    id: "short-films",
    label: "Short Films",
    icon: "▶",
    color: P.amber,
    description: "Completed authored films where image, motion, sound, and story become one work.",
  },
  {
    id: "ai-adaptations",
    label: "AI Adaptations",
    icon: "✧",
    color: P.purple,
    description: "AI-led transformations and moving reinterpretations of original works, ideas, and visual lineages.",
    filterLabel: "Source",
  },
  {
    id: "photography",
    label: "Photography",
    icon: "◎",
    color: P.ghost,
    description: "Observed moments, urban signals, landscapes, and human presence caught through the lens.",
    filterLabel: "Subject",
  },
  {
    id: "graphic-design",
    label: "Graphic Design",
    icon: "◆",
    color: P.cyan,
    description: "Identity, broadcast, social, print, and commissioned design shaped for a purpose.",
    filterLabel: "Project Type",
  },
];

export const DEFAULT_PORTFOLIO_CATEGORY = PORTFOLIO_CATEGORIES[0].id;

export const LEGACY_CATEGORY_MAP = {
  curated: "photoshop-originals",
  motion: "short-films",
  "ai-human": "ai-adaptations",
  photography: "photography",
  design: "graphic-design",
};

const CATEGORY_IDS = new Set(PORTFOLIO_CATEGORIES.map((category) => category.id));
const DEFAULT_COLORS = [P.cyan, P.magenta];

const SOURCE_WORK_IDS = {
  amlnrakwi0: "4",
  amlm7z8pb0: "2",
  amlm7z8pb1: "2",
  amlm776md0: "amlfy33zk23",
  amlm776md1: "amlfy33zk23",
  amlm776md2: "amlfy33zk23",
  amlm6kgs20: "amlfy33zk6",
  amlm5v59w0: "amlfy33zk3",
  amlm2tu3h0: "amlfy33zk2",
  amlm2tu3h1: "amlfy33zk2",
  amllfjzh90: "amlfy33zk22",
  amll6gbpz0: "amlfy33zk28",
  amll1zlie0: "amlfy33zk28",
  amlj426ff0: "amlfy33zk7",
  amlj2rw2p0: "amlfy33zk5",
  amlj1iqht0: "amlfy33zk30",
  amloyatwj0: "amlfy33zk30",
};

const FEATURED_HOME_ORDER = new Map([
  ["1", 1],
  ["cmo907xwf0", 2],
  ["amlnrakwi0", 3],
  ["pmlf8zg3e0", 4],
  ["dmli3x39p0", 5],
  ["4", 6],
]);

const slugify = (value = "") => value
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/(^-|-$)/g, "");

const colorsFor = (work) => work.colors?.length ? work.colors : DEFAULT_COLORS;
const mediaTypeFor = (work) => work.mediaType || (/\.(mp4|mov|webm)(\?|$)/i.test(work.img || "") ? "video" : "image");
const cleanValue = (value) => typeof value === "string" && value.trim() ? value.trim() : null;

const normalizeBase = (work, primaryCategory, sortOrder, sourceKind) => ({
  ...work,
  id: String(work.id),
  slug: work.slug || slugify(work.title),
  primaryCategory,
  title: work.title || "Untitled",
  year: cleanValue(work.year),
  img: work.img || null,
  mediaType: mediaTypeFor(work),
  description: cleanValue(work.description),
  series: cleanValue(work.series),
  medium: cleanValue(work.medium),
  tags: work.tags || [],
  colors: colorsFor(work),
  sortOrder,
  sourceKind,
  sourceWorkId: SOURCE_WORK_IDS[String(work.id)] || work.sourceWorkId || null,
  printEdition: work.printEdition || null,
});

const showcaseWorks = PIECES.map((work, index) => normalizeBase(
  work,
  "photoshop-originals",
  index + 1,
  "showcase",
));

const aiWorks = AI_WORKS.map((work, index) => normalizeBase(
  work,
  work.type === "hybridized" ? "ai-adaptations" : "photoshop-originals",
  work.type === "hybridized" ? index + 1 : index + 100,
  "gallery",
));

const canonicalMedia = new Set(aiWorks.map((work) => work.img).filter(Boolean));
const adaptedMotionWorks = MOTION_WORKS
  .filter((work) => !canonicalMedia.has(work.img))
  .map((work, index) => normalizeBase(
    { ...work, series: work.series || "Glitchcore" },
    "ai-adaptations",
    index + 500,
    "gallery",
  ));

const shortFilms = CURATED_WORKS.map((work, index) => normalizeBase(
  { ...work, medium: work.medium || "Short Film" },
  "short-films",
  index + 1,
  "film",
));

const photographyWorks = PHOTO_GALLERY.map((work, index) => ({
  ...normalizeBase(work, "photography", index + 1, "gallery"),
  subject: cleanValue(work.category),
  medium: work.medium || "Photography",
}));

const graphicDesignWorks = DESIGN_PROJECTS.map((work, index) => ({
  ...normalizeBase(work, "graphic-design", index + 1, "case-study"),
  projectType: cleanValue(work.category),
  medium: work.medium || "Graphic Design",
}));

// New Content Manager records are added here in the normalized catalog shape.
export const CATALOG_ADDITIONS = [];

const baseCatalog = [
  ...showcaseWorks,
  ...aiWorks,
  ...adaptedMotionWorks,
  ...shortFilms,
  ...photographyWorks,
  ...graphicDesignWorks,
  ...CATALOG_ADDITIONS.map((work, index) => normalizeBase(
    work,
    work.primaryCategory,
    Number(work.sortOrder) || index + 1000,
    work.sourceKind || "gallery",
  )),
];

const titleById = new Map(baseCatalog.map((work) => [work.id, work.title]));

export const PORTFOLIO_WORKS = baseCatalog.map((work) => ({
  ...work,
  sourceTitle: work.sourceWorkId ? titleById.get(String(work.sourceWorkId)) || null : null,
  featured: Boolean(work.featured || FEATURED_HOME_ORDER.has(work.id)),
  homeOrder: Number(work.homeOrder) || FEATURED_HOME_ORDER.get(work.id) || null,
}));

export const FEATURED_WORKS = PORTFOLIO_WORKS
  .filter((work) => work.featured)
  .sort((a, b) => a.homeOrder - b.homeOrder);

export const normalizeCategoryId = (value) => {
  const normalized = LEGACY_CATEGORY_MAP[value] || value;
  return CATEGORY_IDS.has(normalized) ? normalized : DEFAULT_PORTFOLIO_CATEGORY;
};

export const getCategory = (categoryId) => PORTFOLIO_CATEGORIES.find(
  (category) => category.id === normalizeCategoryId(categoryId),
);

export const getWorkById = (id) => PORTFOLIO_WORKS.find((work) => work.id === String(id));

export const getAdaptationsForWork = (id) => PORTFOLIO_WORKS
  .filter((work) => String(work.sourceWorkId || "") === String(id))
  .sort((a, b) => a.sortOrder - b.sortOrder);

export const getWorksByCategory = (categoryId) => PORTFOLIO_WORKS
  .filter((work) => work.primaryCategory === normalizeCategoryId(categoryId))
  .sort((a, b) => (
    a.sortOrder - b.sortOrder
    || String(b.year || "").localeCompare(String(a.year || ""))
    || a.title.localeCompare(b.title)
  ));

export const getWorkFilterValue = (work) => {
  if (work.primaryCategory === "photoshop-originals") return work.series;
  if (work.primaryCategory === "ai-adaptations") return work.sourceTitle || "Independent Adaptations";
  if (work.primaryCategory === "photography") return work.subject;
  if (work.primaryCategory === "graphic-design") return work.projectType;
  return null;
};

export const getWorkHref = (work) => {
  if (work.sourceKind === "showcase") return `/portfolio/${work.id}`;
  if (work.sourceKind === "case-study") return `/portfolio/design/${work.slug || work.id}`;
  return `/portfolio?category=${encodeURIComponent(work.primaryCategory)}&work=${encodeURIComponent(work.id)}`;
};
