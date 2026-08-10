import test from "node:test";
import assert from "node:assert/strict";
import { resolveProcessFeatureState } from "../src/data/homeFeatures.js";

test("missing process video renders a development-only placeholder", () => {
  assert.deepEqual(resolveProcessFeatureState(null, true), {
    hasVideo: false,
    isPlaceholder: true,
    isVisible: true,
    pathwaysChapter: "04",
  });
});

test("missing process video stays hidden in production without a numbering gap", () => {
  assert.deepEqual(resolveProcessFeatureState(null, false), {
    hasVideo: false,
    isPlaceholder: false,
    isVisible: false,
    pathwaysChapter: "03",
  });
});

test("configured process video is visible in production and advances the chapter", () => {
  assert.deepEqual(resolveProcessFeatureState("/images/process/sanity-550-layers.mp4", false), {
    hasVideo: true,
    isPlaceholder: false,
    isVisible: true,
    pathwaysChapter: "04",
  });
});
