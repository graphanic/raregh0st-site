import { P } from "./palette";

export const SOCIALS = [
  {
    id: "youtube", label: "YouTube", icon: "\u25B6", color: "#ff0000",
    handle: "@RareGh0st",
    profileUrl: "https://youtube.com/@RareGh0st",
    embed: {
      type: "youtube",
      // Featured video (large embed) -- placeholder for now, swap in a real ID when ready
      featured: "dQw4w9WgXcQ",
      // Horizontal scroll row of videos -- mix real + placeholder
      videos: ["dQw4w9WgXcQ", "jNQXAC9IVRw", "9bZkp7q19f0", "kJQP7kiw5Fk"],
      // Optional: channel playlist (uncomment when ready)
      // playlist: "PLxxxxxxx",
    },
  },
  {
    id: "twitch", label: "Twitch", icon: "\u25C6", color: "#9146ff",
    handle: "RareGh0st",
    profileUrl: "https://twitch.tv/RareGh0st",
    embed: {
      type: "twitch",
      channel: "RareGh0st",
    },
  },
  {
    id: "tiktok", label: "TikTok", icon: "\u266A", color: "#00f2ea",
    handle: "@raregh0st",
    profileUrl: "https://tiktok.com/@raregh0st",
    embed: {
      type: "tiktok",
      // Placeholder video IDs -- swap in real ones
      videos: ["7306209886498767137", "7304908906549226786", "7299755400175640874"],
    },
  },
  {
    id: "instagram", label: "Instagram", icon: "\u25CE", color: "#e1306c",
    handle: "@raregh0st",
    profileUrl: "https://instagram.com/raregh0st",
    embed: {
      type: "instagram",
      // Placeholder post shortcodes -- swap in real ones
      posts: ["CxNm1234567", "CxKm7654321", "CwPp1122334"],
    },
  },
  {
    id: "x", label: "X", icon: "\uD835\uDD4F", color: P.ghost,
    handle: "@RareGh0st",
    profileUrl: "https://x.com/RareGh0st",
    embed: {
      type: "x-timeline",
      profileUrl: "https://twitter.com/RareGh0st",
    },
  },
  {
    id: "threads", label: "Threads", icon: "@", color: P.ghost,
    handle: "@raregh0st",
    profileUrl: "https://threads.net/@raregh0st",
    embed: {
      type: "link-only",
    },
  },
  {
    id: "facebook", label: "Facebook", icon: "f", color: "#1877f2",
    handle: "RareGh0st",
    profileUrl: "https://facebook.com/RareGh0st",
    embed: {
      type: "facebook",
      pageUrl: "https://www.facebook.com/RareGh0st",
    },
  },
];
