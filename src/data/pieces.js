import { P, ART_IMGS, LOGO_IMG } from "./palette.js";
export { LOGO_IMG, ART_IMGS };

export const PIECES = [
  { id: 1, title: "Sanity Is In Rare Supply", year: "2024", series: "Kaleidoscope", medium: "Digital Collage / Photoshop + AI Composite", description: "A fractal meditation on consciousness under pressure. The skull sees everything; the dice ask: who needs luck when you have vision?", printEdition: { size: 10, status: "coming-soon" }, colors: [P.cyan, P.magenta], tags: ["skull", "consciousness", "collage"], img: ART_IMGS[0] },
  { id: 2, title: "Please Wake Up", year: "2024", series: "Kaleidoscope", medium: "Digital Collage / Photoshop + AI Composite", description: "The hand reaches into the opened mind \u2014 not to take, but to reconnect.", printEdition: { size: 10, status: "coming-soon" }, colors: [P.purple, P.magenta], tags: ["brain", "surreal", "healing"], img: ART_IMGS[1] },
  { id: 3, title: "The Boy Who Walked Out of the Storm", year: "2024", series: "Kaleidoscope", medium: "Digital Collage / Photoshop + AI Composite", description: '"Did I lose my MIND?" \u2014 Every eye watches. Every pattern spirals. But the figure at center holds.', printEdition: { size: 10, status: "coming-soon" }, colors: [P.magenta, P.cyan], tags: ["mind", "eyes", "identity"], img: ART_IMGS[2] },
  { id: 4, title: "The Beast", year: "2024", series: "Revelations", medium: "Digital Collage / Photoshop + AI Composite", description: "Crown of thorns. Third eye weeping. The scales of justice chained. And still \u2014 the doves fly.", printEdition: { size: 10, status: "coming-soon" }, colors: [P.red, P.steel], tags: ["skull", "thorns", "sacred"], img: ART_IMGS[3] },
  { id: 5, title: "The Great Resistance", year: "2023", series: "Revelations", medium: "Digital Collage / Photoshop + AI Composite", description: "Orbital rings of information. The universe is watching \u2014 and so are the people.", printEdition: { size: 10, status: "coming-soon" }, colors: [P.red, P.cyan], tags: ["political", "commentary"], img: ART_IMGS[4] },
  // Placeholder motion piece removed from live rotation. Re-add a finished version below
  // (or via the Content Manager) with a real title, description, and series when ready:
  // { id: 6, title: "…", year: "2026", series: "Kaleidoscope", medium: "Digital Collage / Photoshop", description: "…", printEdition: null, colors: [P.cyan, P.magenta], tags: ["collage"], img: "/images/curated/example.png" },
];
