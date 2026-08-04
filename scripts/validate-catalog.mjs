import {
  FEATURED_WORKS,
  PORTFOLIO_CATEGORIES,
  PORTFOLIO_WORKS,
} from "../src/data/catalog.js";

const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};

const categoryIds = new Set(PORTFOLIO_CATEGORIES.map((category) => category.id));
const workIds = PORTFOLIO_WORKS.map((work) => work.id);
const workIdSet = new Set(workIds);

check(workIdSet.size === workIds.length, "Every catalog work must have a unique ID.");
check(
  PORTFOLIO_WORKS.every((work) => categoryIds.has(work.primaryCategory)),
  "Every catalog work must belong to exactly one registered primary category.",
);
check(
  PORTFOLIO_WORKS.every((work) => Number.isFinite(work.sortOrder) && work.sortOrder > 0),
  "Every catalog work must have a positive deterministic sort order.",
);
check(
  PORTFOLIO_WORKS.every((work) => !work.sourceWorkId || workIdSet.has(String(work.sourceWorkId))),
  "Every sourceWorkId must resolve to another catalog work.",
);

const mediaPaths = PORTFOLIO_WORKS.map((work) => work.img).filter(Boolean);
check(
  new Set(mediaPaths).size === mediaPaths.length,
  "The canonical catalog must not contain duplicate media paths.",
);

const shortFilms = PORTFOLIO_WORKS.filter((work) => work.primaryCategory === "short-films");
check(
  shortFilms.length === 1 && shortFilms[0].title === "Neon Cloche of the Void",
  "Short Films must launch with Neon Cloche of the Void as its only work.",
);
check(
  shortFilms.every((work) => !work.id.startsWith("mml")),
  "Legacy Glitchcore motion loops must not be classified as Short Films.",
);

const printEditions = PORTFOLIO_WORKS.filter((work) => work.printEdition);
check(printEditions.length === 5, "Exactly the five showcase originals should launch with print editions.");
check(
  printEditions.every((work) => work.printEdition.size === 10 && work.printEdition.status === "coming-soon"),
  "Every launch print edition must be a coming-soon edition of ten.",
);
check(
  PORTFOLIO_WORKS.every((work) => !("price" in work) && !("availability" in work) && !("edition" in work)),
  "Portfolio records must not retain legacy price, availability, or freeform edition fields.",
);
check(
  new Set(FEATURED_WORKS.map((work) => work.primaryCategory)).size === PORTFOLIO_CATEGORIES.length,
  "Homepage featured works must represent all five primary categories.",
);

if (failures.length) {
  failures.forEach((failure) => console.error(`Catalog validation failed: ${failure}`));
  process.exit(1);
}

console.log(`Catalog valid: ${PORTFOLIO_WORKS.length} unique works across ${PORTFOLIO_CATEGORIES.length} categories.`);

