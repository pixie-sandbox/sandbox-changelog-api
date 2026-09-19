import { test } from "node:test";
import assert from "node:assert/strict";
import { handle } from "../src/handler.ts";
import type { ChangelogEntry } from "../src/entries.ts";

const entries: ChangelogEntry[] = [
  { title: "A", description: "x", date: "2026-08-29T00:00:00.000Z" },
  { title: "B", description: "x", date: "2025-03-01T00:00:00.000Z" },
];

test("GET /entries returns every entry and the count", () => {
  const r = handle("GET", "/entries", entries);
  assert.equal(r.status, 200);
  assert.deepEqual(r.body, { entries: [entries[0], entries[1]], count: 2 });
});

test("GET /entries?year= filters", () => {
  const r = handle("GET", "/entries?year=2025", entries);
  assert.equal(r.status, 200);
  assert.equal((r.body as { count: number }).count, 1);
});

test("a malformed year is a 400 that says what is expected", () => {
  const r = handle("GET", "/entries?year=last", entries);
  assert.equal(r.status, 400);
  assert.match(JSON.stringify(r.body), /four-digit year/);
});

test("unknown paths are 404 and other methods are 405", () => {
  assert.equal(handle("GET", "/nope", entries).status, 404);
  assert.equal(handle("POST", "/entries", entries).status, 405);
});

test("GET /health", () => {
  assert.deepEqual(handle("GET", "/health", entries), { status: 200, body: { status: "ok" } });
});
