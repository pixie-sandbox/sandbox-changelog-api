import { test } from "node:test";
import assert from "node:assert/strict";
import { listEntries, loadEntries, type ChangelogEntry } from "../src/entries.ts";

const sample: ChangelogEntry[] = [
  { title: "Old", description: "x", date: "2025-12-31T00:00:00.000Z" },
  { title: "Newest", description: "x", date: "2026-08-29T00:00:00.000Z" },
  { title: "Middle", description: "x", date: "2026-01-01T00:00:00.000Z" },
];

test("entries come back newest first", () => {
  assert.deepEqual(listEntries(sample).map((e) => e.title), ["Newest", "Middle", "Old"]);
});

test("a year narrows to that calendar year, in UTC", () => {
  assert.deepEqual(listEntries(sample, { year: 2026 }).map((e) => e.title), ["Newest", "Middle"]);
  assert.deepEqual(listEntries(sample, { year: 2025 }).map((e) => e.title), ["Old"]);
});

test("a year with no entries is empty, not an error", () => {
  assert.deepEqual(listEntries(sample, { year: 2019 }), []);
});

test("the published data loads and every entry has the contract's fields", () => {
  const entries = loadEntries();
  assert.ok(entries.length > 0, "data/changelog.json is empty");
  for (const e of entries) {
    assert.equal(typeof e.title, "string");
    assert.equal(typeof e.description, "string");
    assert.ok(!Number.isNaN(Date.parse(e.date)), `bad date on ${e.title}`);
  }
});
