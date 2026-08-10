export const SANITY_PROCESS_FEATURE = Object.freeze({
  workId: "1",
  videoSrc: "/images/process/sanity-550-layers.mp4",
  plannedVideoSrc: "/images/process/sanity-550-layers.mp4",
});

export function resolveProcessFeatureState(videoSrc, isDevelopment = false) {
  const hasVideo = typeof videoSrc === "string" && videoSrc.trim().length > 0;
  const isPlaceholder = Boolean(isDevelopment) && !hasVideo;
  const isVisible = hasVideo || isPlaceholder;

  return {
    hasVideo,
    isPlaceholder,
    isVisible,
    pathwaysChapter: isVisible ? "04" : "03",
  };
}
