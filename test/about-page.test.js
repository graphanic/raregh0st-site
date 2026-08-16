import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  ABOUT_DISCOVERIES,
  ABOUT_HUMAN_ANCHORS,
  ABOUT_SECTIONS,
  ABOUT_SYMBOLS,
  getAboutManifestErrors,
} from "../src/data/about.js";
import { PORTFOLIO_WORKS } from "../src/data/catalog.js";

const workIds = PORTFOLIO_WORKS.map((work) => work.id);

test("the About manifest is valid against the public portfolio catalog", () => {
  assert.deepEqual(getAboutManifestErrors(undefined, workIds), []);
  assert.equal(ABOUT_SECTIONS.length, 7);
  assert.equal(ABOUT_HUMAN_ANCHORS.length, 4);
});

test("every artwork discovery and symbol points to a published work", () => {
  const knownIds = new Set(workIds);

  ABOUT_DISCOVERIES.forEach((discovery) => assert.ok(knownIds.has(discovery.workId)));
  ABOUT_SYMBOLS.forEach((symbol) => {
    assert.ok(symbol.evidence.length >= 2);
    assert.ok(symbol.workIds.length >= 2);
    symbol.workIds.forEach((workId) => assert.ok(knownIds.has(workId)));
  });
});

test("the Symbol Field excludes unsupported generic animal language", () => {
  const labels = ABOUT_SYMBOLS.map((symbol) => symbol.label.toLowerCase());
  assert.ok(!labels.includes("animal"));
  assert.ok(!labels.includes("animals"));
  assert.ok(!labels.includes("magpie"));
});

test("manifest validation rejects missing evidence and invalid work references", () => {
  const invalidSymbols = [{
    ...ABOUT_SYMBOLS[0],
    evidence: [],
    workIds: ["not-a-work"],
  }];
  const errors = getAboutManifestErrors({
    sections: ABOUT_SECTIONS,
    symbols: invalidSymbols,
    humanAnchors: ABOUT_HUMAN_ANCHORS,
  }, workIds);

  assert.ok(errors.some((error) => error.includes("demonstrated public evidence")));
  assert.ok(errors.some((error) => error.includes("at least two works")));
  assert.ok(errors.some((error) => error.includes("unknown work")));
});

test("the About experience uses the truthful layer statistic", async () => {
  const source = await readFile(new URL("../src/components/about/AboutExperience.jsx", import.meta.url), "utf8");

  assert.match(source, /550\+/);
  assert.match(source, /More than 550 layers/);
  assert.doesNotMatch(source, /001\s*(?:→|\/|to)\s*550/i);
});
