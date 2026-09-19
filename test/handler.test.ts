import { test } from "node:test";
import assert from "node:assert/strict";
import { handle } from "../src/handler.ts";
import type { ChangelogEntry } from "../src/entries.ts";

const entries: ChangelogEntry[] = [
  { title: "A", description: "x", date: "2026-08-29T00:00:00.000Z", breaking: true },
  { title: "B", description: "x", date: "2025-03-01T00:00:00.000Z" },
];

test("GET /entries returns every entry and the count", () => {
  const r = handle("GET", "/entries", entries);
  assert.equal(r.status, 200);
  const body = r.body as { entries: ChangelogEntry[]; count: number };
  assert.equal(body.count, 2);
  assert.equal(body.entries[0].title, "A");
  assert.equal(body.entries[1].title, "B");
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

test("GET /entries?breaking=true returns only breaking entries (AC8)", () => {
  const r = handle("GET", "/entries?breaking=true", entries);
  assert.equal(r.status, 200);
  const body = r.body as { entries: (ChangelogEntry & { breaking: boolean })[]; count: number };
  assert.equal(body.count, 1);
  assert.equal(body.entries[0].title, "A");
  assert.equal(body.entries[0].breaking, true);
});

test("GET /entries?breaking=true returns 200 with empty list when no breaking entries (AC11)", () => {
  const nonBreaking: ChangelogEntry[] = [
    { title: "X", description: "x", date: "2026-01-01T00:00:00.000Z" },
  ];
  const r = handle("GET", "/entries?breaking=true", nonBreaking);
  assert.equal(r.status, 200);
  assert.deepEqual(r.body, { entries: [], count: 0 });
});

test("every entry in the response has a boolean breaking field (AC7)", () => {
  const r = handle("GET", "/entries", entries);
  assert.equal(r.status, 200);
  const body = r.body as { entries: (ChangelogEntry & { breaking: boolean })[]; count: number };
  for (const e of body.entries) {
    assert.equal(typeof e.breaking, "boolean");
  }
});

test("?breaking=false is a 400 (AC9)", () => {
  const r = handle("GET", "/entries?breaking=false", entries);
  assert.equal(r.status, 400);
});

test("?breaking=1 is a 400 (AC9)", () => {
  const r = handle("GET", "/entries?breaking=1", entries);
  assert.equal(r.status, 400);
});

test("?breaking=yes is a 400 (AC9)", () => {
  const r = handle("GET", "/entries?breaking=yes", entries);
  assert.equal(r.status, 400);
});

test("?breaking= (empty string) is a 400 (AC9)", () => {
  const r = handle("GET", "/entries?breaking=", entries);
  assert.equal(r.status, 400);
});
