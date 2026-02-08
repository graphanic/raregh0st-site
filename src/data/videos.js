import { P } from "./palette";

export const VIDEO_GENRES = [
  { id: "all", label: "All", color: P.cyan },
  { id: "codename-angel", label: "Codename Angel", color: P.magenta },
  { id: "gaming", label: "Video Games", color: P.green },
  { id: "photoshop", label: "Photoshop", color: P.purple },
  { id: "creative", label: "Creative", color: P.amber },
];

export const VIDEOS = [
  { id: 1, title: "Pilot: The House of Mirrors", genre: "codename-angel", duration: "18:42", description: "Philosophy is discovered, not explained.", color: P.magenta, series: "Codename Angel", episode: "S01E01" },
  { id: 2, title: "The Architect\u2019s Dilemma", genre: "codename-angel", duration: "22:15", description: "When the pattern-finder finds too many patterns.", color: P.magenta, series: "Codename Angel", episode: "S01E02" },
  { id: 3, title: "Elden Ring \u2014 Walking Through Caelid", genre: "gaming", duration: "1:12:30", description: "Sometimes the rot is the path.", color: P.green, series: "Gaming Sessions" },
  { id: 4, title: "Cyberpunk 2077 \u2014 Night City Philosophy", genre: "gaming", duration: "45:20", description: "What does it mean to be real in a world that isn\u2019t?", color: P.green, series: "Gaming Sessions" },
  { id: 5, title: "Digital Collage Masterclass", genre: "photoshop", duration: "34:18", description: "From asset to architecture.", color: P.purple, series: "Process" },
  { id: 6, title: "Neon Halos & Shadow Work", genre: "photoshop", duration: "28:50", description: "Color grading for emotional resonance.", color: P.purple, series: "Process" },
  { id: 7, title: "Making 'The Beast' \u2014 Full Timelapse", genre: "creative", duration: "16:44", description: "Every layer tells the truth differently.", color: P.amber, series: "Timelapse" },
  { id: 8, title: "The Infinity Mirror", genre: "codename-angel", duration: "25:30", description: "Truth approached through perspective.", color: P.magenta, series: "Codename Angel", episode: "S01E03" },
  { id: 9, title: "Baldur\u2019s Gate 3 \u2014 Choices", genre: "gaming", duration: "2:01:15", description: "RPG as ethical laboratory.", color: P.green, series: "Gaming Sessions" },
  { id: 10, title: "AI Art: Collaborator, Not Replacement", genre: "creative", duration: "19:22", description: "Working WITH AI without losing your soul.", color: P.amber, series: "Process" },
];
