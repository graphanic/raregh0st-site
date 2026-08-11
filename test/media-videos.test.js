import test from "node:test";
import assert from "node:assert/strict";
import {
  VIDEOS,
  filterVideos,
  getFeaturedVideo,
  getVideoManifestErrors,
  sortVideosNewestFirst,
} from "../src/data/videos.js";

test("the curated video manifest is valid and uses real unique YouTube IDs", () => {
  assert.deepEqual(getVideoManifestErrors(VIDEOS), []);
  assert.equal(VIDEOS.length, 6);
  assert.equal(new Set(VIDEOS.map((video) => video.youtubeId)).size, VIDEOS.length);
});

test("videos are sorted newest first without mutating the manifest", () => {
  const originalOrder = VIDEOS.map((video) => video.id);
  const sorted = sortVideosNewestFirst(VIDEOS);

  assert.deepEqual(VIDEOS.map((video) => video.id), originalOrder);
  assert.deepEqual(sorted.map((video) => video.id), [
    "raregh0st-logo-sting",
    "test-clash-royale-video-3",
    "test-clash-royale-video-2",
    "the-knife-process-video",
    "illustrator-3d-text",
    "false-prophet-speedart",
  ]);
});

test("category filters preserve chronological ordering", () => {
  const sorted = sortVideosNewestFirst(VIDEOS);

  assert.deepEqual(
    filterVideos(sorted, "gaming").map((video) => video.id),
    ["test-clash-royale-video-3", "test-clash-royale-video-2"],
  );
  assert.deepEqual(filterVideos(sorted, "all"), sorted);
  assert.notEqual(filterVideos(sorted, "all"), sorted);
});

test("the hand-picked feature wins and the newest video is the fallback", () => {
  assert.equal(getFeaturedVideo(VIDEOS)?.id, "raregh0st-logo-sting");

  const withoutFeature = VIDEOS.map(({ featured, ...video }) => video);
  assert.equal(getFeaturedVideo(withoutFeature)?.id, "raregh0st-logo-sting");
  assert.equal(getFeaturedVideo([]), null);
});

test("manifest validation rejects duplicate IDs and multiple featured videos", () => {
  const invalid = [
    VIDEOS[0],
    { ...VIDEOS[1], id: VIDEOS[0].id, featured: true },
  ];
  const errors = getVideoManifestErrors(invalid);

  assert.ok(errors.some((error) => error.includes("id must be present and unique")));
  assert.ok(errors.some((error) => error.includes("Only one video can be featured")));
});
