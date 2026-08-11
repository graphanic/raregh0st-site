export const VIDEO_CATEGORIES = [
  { id: "all", label: "All Videos" },
  { id: "tutorials", label: "Tutorials" },
  { id: "creative-process", label: "Creative Process" },
  { id: "gaming", label: "Gaming" },
];

export const VIDEO_CATEGORY_IDS = VIDEO_CATEGORIES
  .filter((category) => category.id !== "all")
  .map((category) => category.id);

export const VIDEOS = [
  {
    id: "raregh0st-logo-sting",
    youtubeId: "EMNWUWex7H8",
    title: "Raregh0st Logo Sting",
    category: "creative-process",
    publishedAt: "2026-02-17",
    duration: "0:15",
    description: "A fifteen-second threshold into the RareGh0st signal—identity compressed into motion, light, and sound.",
    featured: true,
  },
  {
    id: "test-clash-royale-video-3",
    youtubeId: "1-szxCcWMhc",
    title: "Test Clash Royale Video 3",
    category: "gaming",
    publishedAt: "2026-01-24",
    duration: "2:34",
    description: "A compact Clash Royale edit from the gaming archive, cut around pressure, timing, and impact.",
  },
  {
    id: "test-clash-royale-video-2",
    youtubeId: "6IYq0H4nIR8",
    title: "Test Clash Royale Video 2",
    category: "gaming",
    publishedAt: "2026-01-24",
    duration: "3:12",
    description: "An early gameplay transmission—fast decisions, close margins, and the rhythm of the arena.",
  },
  {
    id: "the-knife-process-video",
    youtubeId: "gBxMMed4PWk",
    title: "The Knife Process Video",
    category: "creative-process",
    publishedAt: "2024-05-01",
    duration: "1:09",
    description: "A brief look inside the making of The Knife: composition, atmosphere, and the image taking shape.",
  },
  {
    id: "illustrator-3d-text",
    youtubeId: "MDZxXBc3Mkc",
    title: "How to make 3D text in Illustrator",
    category: "tutorials",
    publishedAt: "2024-03-25",
    duration: "13:29",
    description: "Build dimensional type in Adobe Illustrator through a direct, practical walkthrough.",
  },
  {
    id: "false-prophet-speedart",
    youtubeId: "eMA50b9dki0",
    title: "Photoshop Speedart: The False Prophet",
    category: "creative-process",
    publishedAt: "2023-04-07",
    duration: "5:20",
    description: "A Photoshop speedart tracing The False Prophet from raw construction to its final symbolic world.",
  },
];

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const DURATION_PATTERN = /^(?:\d+:)?\d{1,2}:\d{2}$/;
const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

export function sortVideosNewestFirst(videos) {
  return [...videos].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function filterVideos(videos, category) {
  if (category === "all") return [...videos];
  return videos.filter((video) => video.category === category);
}

export function getFeaturedVideo(videos) {
  return videos.find((video) => video.featured) || sortVideosNewestFirst(videos)[0] || null;
}

export function getVideoManifestErrors(videos) {
  const errors = [];
  const ids = new Set();
  const youtubeIds = new Set();
  let featuredCount = 0;

  videos.forEach((video, index) => {
    const label = video?.id || `entry ${index + 1}`;

    if (!video?.id || ids.has(video.id)) errors.push(`${label}: id must be present and unique`);
    if (video?.id) ids.add(video.id);

    if (!YOUTUBE_ID_PATTERN.test(video?.youtubeId || "") || youtubeIds.has(video.youtubeId)) {
      errors.push(`${label}: youtubeId must be a unique 11-character YouTube ID`);
    }
    if (video?.youtubeId) youtubeIds.add(video.youtubeId);

    if (!video?.title?.trim()) errors.push(`${label}: title is required`);
    if (!VIDEO_CATEGORY_IDS.includes(video?.category)) errors.push(`${label}: category is invalid`);
    if (!DATE_PATTERN.test(video?.publishedAt || "") || Number.isNaN(Date.parse(`${video.publishedAt}T00:00:00Z`))) {
      errors.push(`${label}: publishedAt must be a valid YYYY-MM-DD date`);
    }
    if (!DURATION_PATTERN.test(video?.duration || "")) errors.push(`${label}: duration is invalid`);
    if (!video?.description?.trim()) errors.push(`${label}: description is required`);
    if (video?.featured) featuredCount += 1;
  });

  if (featuredCount > 1) errors.push("Only one video can be featured");
  return errors;
}

const manifestErrors = getVideoManifestErrors(VIDEOS);
if (manifestErrors.length > 0) {
  throw new Error(`Invalid video manifest:\n${manifestErrors.join("\n")}`);
}
