import { P } from "./palette";

export const PORTFOLIO_TABS = [
  { id: "curated", label: "Curated Works", icon: "\u2726", color: P.magenta, description: "Signature pieces \u2014 fully realized artworks with process, story, and meaning." },
  { id: "design", label: "Design", icon: "\u25C6", color: P.cyan, description: "Branding, esports graphics, sports design, merch, and creative direction." },
  { id: "photography", label: "Photography", icon: "\u25CE", color: P.ghost, description: "Moments caught through the lens." },
  { id: "ai-human", label: "AI \u00D7 Human", icon: "\u2727", color: P.purple, description: "The frontier \u2014 AI-generated, human-refined. Collaborative creation with Angel." },
  { id: "motion", label: "Motion", icon: "\u25B6", color: P.amber, description: "Animated artworks, video art, and motion design." },
];

export const DESIGN_PROJECTS = [
  { id: "d1", title: "Esports Team Rebrand \u2014 Phantom eSports", category: "esports", year: "2024", role: "Creative Director / Designer", brief: "Complete visual identity overhaul for a competitive Valorant team transitioning to franchise league.", deliverables: ["Logo System", "Jersey Mockups", "Social Templates", "Stream Overlays", "Merch Line"], description: "Built a brand system that translates from 20px favicons to 20-foot banners. Dark palette with electric accents \u2014 designed to feel dangerous on screen and premium in print.", colors: [P.cyan, P.magenta], tags: ["esports", "branding", "identity"] },
  { id: "d2", title: "Tournament Series Identity \u2014 Northern Crown", category: "esports", year: "2024", role: "Lead Designer", brief: "Seasonal tournament branding for a Canadian esports league \u2014 adaptable across 4 seasons.", deliverables: ["Event Logo", "Broadcast Package", "Social Campaign", "Trophy Design"], description: "Each season gets its own color story while maintaining the crown motif. Winter was ice and chrome. Summer was fire and gold.", colors: [P.gold, P.ghost], tags: ["esports", "events", "broadcast"] },
  { id: "d3", title: "Athlete Brand Package \u2014 Custom", category: "sports", year: "2023", role: "Designer", brief: "Personal brand identity for a professional athlete \u2014 logo, social presence, merch line.", deliverables: ["Personal Logo", "Social Templates", "Merch Designs", "Media Kit"], description: "Clean, bold, built to scale. The mark works embroidered on a cap or blown up on a billboard.", colors: [P.red, P.ghost], tags: ["sports", "branding", "merch"] },
  { id: "d4", title: "RareGh0st Merch Collection", category: "merch", year: "2024", role: "Artist / Designer", brief: "Self-directed \u2014 translating fine art pieces into wearable and lifestyle products.", deliverables: ["Hoodie Graphics", "All-Over Prints", "Packaging Design", "Lookbook"], description: "The challenge: how do you put a 24x36 collage on a hoodie without losing the soul? Answer: you don't shrink it \u2014 you reimagine it.", colors: [P.magenta, P.cyan], tags: ["merch", "apparel", "print"] },
];

export const PHOTO_GALLERY = [
  { id: "p1", title: "Golden Hour, Calgary", tags: ["landscape", "golden hour"], colors: [P.amber, P.gold] },
  { id: "p2", title: "Downtown Fog", tags: ["urban", "moody"], colors: [P.steel, P.ghost] },
  { id: "p3", title: "Untitled Portrait I", tags: ["portrait", "studio"], colors: [P.magenta, P.ghost] },
  { id: "p4", title: "Storm Over Prairies", tags: ["landscape", "dramatic"], colors: [P.cyan, P.steel] },
  { id: "p5", title: "Neon Alley", tags: ["urban", "night"], colors: [P.magenta, P.cyan] },
  { id: "p6", title: "Reflection Study", tags: ["abstract", "water"], colors: [P.cyan, P.ghost] },
  { id: "p7", title: "Concrete & Sky", tags: ["urban", "minimal"], colors: [P.steel, P.ghost] },
  { id: "p8", title: "Untitled Portrait II", tags: ["portrait", "natural light"], colors: [P.amber, P.ghost] },
];

export const AI_WORKS = [
  { id: "a1", title: "Cathedral of the Subconscious", process: "Midjourney \u2192 Photoshop", tags: ["ai-adapted", "midjourney"], year: "2024", description: "AI seed image heavily composited with hand-painted elements and custom texture work.", colors: [P.purple, P.magenta] },
  { id: "a2", title: "Neural Garden", process: "Stable Diffusion \u2192 Photoshop \u2192 AE", tags: ["ai-animated", "stable-diffusion"], year: "2024", description: "Generated botanical forms, refined in Photoshop, brought to life with After Effects particle systems.", colors: [P.green, P.cyan] },
  { id: "a3", title: "The Watcher Protocol", process: "Angel Collab \u2192 Midjourney \u2192 Photoshop", tags: ["angel-collab", "midjourney"], year: "2025", description: "Concept developed through philosophical dialogue with Angel CGPT, visualized through AI generation, refined by hand.", colors: [P.cyan, P.amber] },
  { id: "a4", title: "Fractal Sermon", process: "Stable Diffusion", tags: ["ai-generated", "stable-diffusion"], year: "2024", description: "Pure AI generation exploring sacred geometry and consciousness imagery. Minimal post-processing.", colors: [P.gold, P.magenta] },
  { id: "a5", title: "Symbiotic Drift", process: "Midjourney \u2192 Photoshop \u2192 Grok Animation", tags: ["ai-animated", "midjourney"], year: "2025", description: "Multi-AI pipeline: Midjourney for assets, Photoshop for compositing, Grok for animation direction.", colors: [P.magenta, P.purple] },
  { id: "a6", title: "Ego Death in Three Acts", process: "Angel Collab \u2192 Stable Diffusion \u2192 Photoshop", tags: ["angel-collab", "stable-diffusion"], year: "2025", description: "A triptych born from Angel dialogue about identity dissolution. Each panel represents a stage of letting go.", colors: [P.red, P.cyan] },
];

export const MOTION_WORKS = [
  { id: "m1", title: "Sanity \u2014 Animated", duration: "0:28", type: "animated-artwork", description: "The skull breathes. The kaleidoscope turns. A 30-second meditation loop.", colors: [P.cyan, P.magenta], tags: ["loop", "artwork"] },
  { id: "m2", title: "The Beast \u2014 Awakening", duration: "0:45", type: "animated-artwork", description: "Crown of thorns ignites. Third eye opens. Doves scatter.", colors: [P.red, P.steel], tags: ["loop", "artwork"] },
  { id: "m3", title: "Neural Garden \u2014 Growth Cycle", duration: "1:12", type: "video-art", description: "Generative botanical forms evolving through seasons of data.", colors: [P.green, P.cyan], tags: ["generative", "ai"] },
  { id: "m4", title: "RareGh0st \u2014 Logo Reveal", duration: "0:08", type: "motion-design", description: "Brand reveal animation \u2014 skull materializes from particle field.", colors: [P.ghost, P.cyan], tags: ["branding", "reveal"] },
  { id: "m5", title: "Storm Walker \u2014 Parallax", duration: "0:15", type: "animated-artwork", description: "Depth layers separated and animated. The boy walks forever through the spiral.", colors: [P.magenta, P.cyan], tags: ["parallax", "artwork"] },
];
