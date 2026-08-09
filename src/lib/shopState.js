export const SHOP_MODES = Object.freeze({
  LOADING: "loading",
  PRELAUNCH: "prelaunch",
  LIVE: "live",
});

export function resolveShopMode(settings, productPayload) {
  if (!settings || settings.shop_live !== true) return SHOP_MODES.PRELAUNCH;
  if (!productPayload || !Array.isArray(productPayload.products)) return SHOP_MODES.PRELAUNCH;
  return SHOP_MODES.LIVE;
}
