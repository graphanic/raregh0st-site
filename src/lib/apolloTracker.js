export const APOLLO_APP_ID = "6a7c7021b38078001095b70a";
export const APOLLO_TRACKER_BASE_URL =
  "https://assets.apollo.io/micro/website-tracker/tracker.iife.js";
export const ANALYTICS_CONSENT_KEY = "analytics-consent-v1";
export const ANALYTICS_CONSENT = Object.freeze({
  ALLOW: "allow",
  ESSENTIAL: "essential",
});

const APOLLO_SCRIPT_ATTRIBUTE = "data-apollo-website-tracker";
const APOLLO_INITIALIZED_FLAG = "__rareGh0stApolloInitialized";

export const buildApolloTrackerUrl = (
  cacheBust = Math.random().toString(36).substring(7),
) => `${APOLLO_TRACKER_BASE_URL}?nocache=${cacheBust}`;

export const isAnalyticsAllowed = (consent) =>
  consent === ANALYTICS_CONSENT.ALLOW;

const initializeApollo = (browserWindow) => {
  if (browserWindow[APOLLO_INITIALIZED_FLAG]) return true;

  const onLoad = browserWindow.trackingFunctions?.onLoad;
  if (typeof onLoad !== "function") return false;

  onLoad({ appId: APOLLO_APP_ID });
  browserWindow[APOLLO_INITIALIZED_FLAG] = true;
  return true;
};

export const loadApolloTracker = ({
  document: browserDocument = globalThis.document,
  window: browserWindow = globalThis.window,
  cacheBust,
} = {}) => {
  if (!browserDocument?.head || !browserWindow) return null;

  const initialize = () => initializeApollo(browserWindow);
  const selector =
    `script[${APOLLO_SCRIPT_ATTRIBUTE}], ` +
    `script[src^="${APOLLO_TRACKER_BASE_URL}"]`;
  const existingScript = browserDocument.querySelector?.(selector);

  if (existingScript) {
    initialize();
    existingScript.addEventListener?.("load", initialize, { once: true });
    return existingScript;
  }

  const script = browserDocument.createElement("script");
  script.src = buildApolloTrackerUrl(cacheBust);
  script.async = true;
  script.defer = true;
  script.setAttribute(APOLLO_SCRIPT_ATTRIBUTE, "");
  script.addEventListener("load", initialize, { once: true });
  browserDocument.head.appendChild(script);
  return script;
};
