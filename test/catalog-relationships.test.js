import test from "node:test";
import assert from "node:assert/strict";
import {
  getAdjacentWorks,
  getRelatedWorks,
  getWorksByCategory,
} from "../src/data/catalog.js";

test("adjacent works respect category boundaries without wrapping", () => {
  const ordered = getWorksByCategory("photoshop-originals");
  const first = getAdjacentWorks(ordered[0].id);
  const last = getAdjacentWorks(ordered.at(-1).id);
  assert.equal(first.previous, null);
  assert.equal(first.next?.id, ordered[1].id);
  assert.equal(last.next, null);
  assert.equal(last.previous?.id, ordered.at(-2).id);
});

test("related works put direct original/adaptation relationships first", () => {
  const related = getRelatedWorks("2");
  assert.equal(related.length, 3);
  assert.equal(related[0].sourceWorkId, "2");
  assert.equal(related[1].sourceWorkId, "2");
  assert.equal(new Set(related.map((work) => work.id)).size, 3);
});

test("related works return a deterministic unique category-backed set", () => {
  const first = getRelatedWorks("1").map((work) => work.id);
  const second = getRelatedWorks("1").map((work) => work.id);
  assert.deepEqual(first, second);
  assert.equal(first.length, 3);
  assert.equal(new Set(first).size, 3);
});
