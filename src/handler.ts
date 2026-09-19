/**
 * The HTTP surface, as a function from a request line to a response.
 *
 * Kept apart from `server.ts` so it is tested without opening a socket:
 * a test that binds a port is a test that fails wherever the network is
 * fenced, and the behaviour under test is not the socket.
 */
import { listEntries, type ChangelogEntry } from "./entries.ts";

export type Response = {
  status: number;
  body: unknown;
};

export function handle(method: string, rawUrl: string, entries: ChangelogEntry[]): Response {
  const url = new URL(rawUrl, "http://localhost");

  if (method !== "GET") {
    return { status: 405, body: { error: "Only GET is supported." } };
  }

  if (url.pathname === "/health") {
    return { status: 200, body: { status: "ok" } };
  }

  if (url.pathname === "/entries") {
    const yearParam = url.searchParams.get("year");
    if (yearParam !== null && !/^\d{4}$/.test(yearParam)) {
      return { status: 400, body: { error: "`year` must be a four-digit year, e.g. 2026." } };
    }
    const year = yearParam === null ? undefined : Number(yearParam);
    const items = listEntries(entries, { year });
    return { status: 200, body: { entries: items, count: items.length } };
  }

  return { status: 404, body: { error: `No route for ${url.pathname}.` } };
}
