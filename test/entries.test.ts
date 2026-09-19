import { test } from "node:test";
import assert from "node:assert/strict";
import { listEntries, loadEntries, type ChangelogEntry } from "../src/entries.ts";

const sample: ChangelogEntry[] = [
  { title: "Old", description: "x", date: "2025-12-31T00:00:00.000Z" },
  { title: "Newest", description: "x", date: "2026-08-29T00:00:00.000Z" },
  { title: "Middle", description: "x", date: "2026-01-01T00:00:00.000Z" },
];

const breakingSample: ChangelogEntry[] = [
  { title: "Breaking entry", description: "x", date: "2026-08-01T00:00:00.000Z", breaking: true },
  { title: "Non-breaking entry", description: "x", date: "2026-07-01T00:00:00.000Z" },
  { title: "Explicit false", description: "x", date: "2026-06-01T00:00:00.000Z", breaking: false },
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

test("breaking:true filters to only entries where breaking === true (AC8)", () => {
  const result = listEntries(breakingSample, { breaking: true });
  assert.deepEqual(result.map((e) => e.title), ["Breaking entry"]);
});

test("an entry with no breaking field is excluded when breaking:true is requested (AC8)", () => {
  const result = listEntries(breakingSample, { breaking: true });
  const titles = result.map((e) => e.title);
  assert.ok(!titles.includes("Non-breaking entry"), "non-breaking entry should be excluded");
  assert.ok(!titles.includes("Explicit false"), "explicit-false entry should be excluded");
});

test("every entry from listEntries carries a boolean breaking field (AC7)", () => {
  const result = listEntries(sample);
  for (const e of result) {
    assert.equal(typeof e.breaking, "boolean", `breaking should be boolean on ${e.title}`);
  }
});

test("entries missing the breaking field come out as breaking:false (AC7)", () => {
  const result = listEntries(sample);
  for (const e of result) {
    assert.equal(e.breaking, false, `breaking should be false for ${e.title}`);
  }
});

test("breaking:true with no breaking entries returns empty list (AC11)", () => {
  const result = listEntries(sample, { breaking: true });
  assert.deepEqual(result, []);
});
