import test from "node:test";
import assert from "node:assert/strict";
import { SHOP_MODES, resolveShopMode } from "../src/lib/shopState.js";

test("shop state stays pre-launch when settings are missing or disabled", () => {
  assert.equal(resolveShopMode(undefined, { products: [] }), SHOP_MODES.PRELAUNCH);
  assert.equal(resolveShopMode({}, { products: [] }), SHOP_MODES.PRELAUNCH);
  assert.equal(resolveShopMode({ shop_live: false }, { products: [] }), SHOP_MODES.PRELAUNCH);
});

test("shop state fails safely when live product data is unavailable", () => {
  assert.equal(resolveShopMode({ shop_live: true }, undefined), SHOP_MODES.PRELAUNCH);
  assert.equal(resolveShopMode({ shop_live: true }, {}), SHOP_MODES.PRELAUNCH);
});

test("shop state becomes live only with an explicit setting and product array", () => {
  assert.equal(resolveShopMode({ shop_live: true }, { products: [] }), SHOP_MODES.LIVE);
  assert.equal(resolveShopMode({ shop_live: true }, { products: [{ id: 1 }] }), SHOP_MODES.LIVE);
});
