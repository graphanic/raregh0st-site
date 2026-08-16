import test from "node:test";
import assert from "node:assert/strict";
import {
  ANALYTICS_CONSENT,
  APOLLO_APP_ID,
  APOLLO_TRACKER_BASE_URL,
  buildApolloTrackerUrl,
  isAnalyticsAllowed,
  loadApolloTracker,
} from "../src/lib/apolloTracker.js";

test("Apollo uses the supplied tracker endpoint and app ID", () => {
  assert.equal(APOLLO_APP_ID, "6a7c7021b38078001095b70a");
  assert.equal(
    buildApolloTrackerUrl("fixed"),
    `${APOLLO_TRACKER_BASE_URL}?nocache=fixed`,
  );
});

test("only explicit analytics consent enables tracking", () => {
  assert.equal(isAnalyticsAllowed(ANALYTICS_CONSENT.ALLOW), true);
  assert.equal(isAnalyticsAllowed(ANALYTICS_CONSENT.ESSENTIAL), false);
  assert.equal(isAnalyticsAllowed(null), false);
  assert.equal(isAnalyticsAllowed(true), false);
});

test("the tracker mounts once and initializes only after its script loads", () => {
  const scripts = [];
  const listeners = {};
  const script = {
    addEventListener(type, listener) {
      listeners[type] = listener;
    },
    setAttribute(name, value) {
      this.attributes = { ...this.attributes, [name]: value };
    },
  };
  const browserDocument = {
    head: {
      appendChild(node) {
        scripts.push(node);
      },
    },
    createElement(tagName) {
      assert.equal(tagName, "script");
      return script;
    },
    querySelector() {
      return scripts[0] ?? null;
    },
  };
  const calls = [];
  const browserWindow = {};

  const mounted = loadApolloTracker({
    document: browserDocument,
    window: browserWindow,
    cacheBust: "test",
  });

  assert.equal(mounted, script);
  assert.equal(scripts.length, 1);
  assert.equal(script.src, `${APOLLO_TRACKER_BASE_URL}?nocache=test`);
  assert.equal(script.async, true);
  assert.equal(script.defer, true);
  assert.equal(calls.length, 0);

  browserWindow.trackingFunctions = {
    onLoad(config) {
      calls.push(config);
    },
  };
  listeners.load();
  assert.deepEqual(calls, [{ appId: APOLLO_APP_ID }]);

  loadApolloTracker({ document: browserDocument, window: browserWindow });
  assert.equal(scripts.length, 1);
  assert.equal(calls.length, 1);
});

test("the loader is inert outside a browser document", () => {
  assert.equal(loadApolloTracker({ document: null, window: {} }), null);
});
