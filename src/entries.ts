/**
 * The changelog entries this service publishes.
 *
 * `data/changelog.json` carries the same entries, in the same shape, as the
 * sandbox site's `data/changelog.json`. The site renders them; this service
 * serves them to everything else. What an entry carries is one contract
 * across both repositories — a change to it lands in both.
 */
import { readFileSync } from "node:fs";

export type ChangelogEntry = {
  title: string;
  description: string;
  /** ISO 8601, UTC. */
  date: string;
};

const DATA_URL = new URL("../data/changelog.json", import.meta.url);

export function loadEntries(): ChangelogEntry[] {
  return JSON.parse(readFileSync(DATA_URL, "utf8")) as ChangelogEntry[];
}

export type EntryQuery = {
  /** Only entries dated in this calendar year (UTC). */
  year?: number;
};

/** Entries newest first, optionally narrowed by `query`. */
export function listEntries(
  entries: ChangelogEntry[],
  query: EntryQuery = {},
): ChangelogEntry[] {
  return entries
    .filter((e) => query.year === undefined || new Date(e.date).getUTCFullYear() === query.year)
    .sort((a, b) => b.date.localeCompare(a.date));
}
