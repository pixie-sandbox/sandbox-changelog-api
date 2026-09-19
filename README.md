# sandbox-changelog-api

Serves the sandbox site's changelog to consumers other than the site — a
status page, a mobile client, anything that wants the entries as JSON rather
than as a web page.

The site ([pixie-sandbox-site](https://github.com/pixie-sandbox/pixie-sandbox-site))
renders the changelog; this service serves the same entries. **What an entry
carries is one contract across both repositories**: a field added to an entry
is added here and in the site, and each repository's tests check its half.

## Run

    npm start          # http://localhost:3100
    npm test

Node 24 or later. There are no dependencies: Node runs the TypeScript
directly, and the tests use `node:test`.

## API

| Method | Path | Returns |
|---|---|---|
| GET | `/entries` | `{ entries, count }`, newest first |
| GET | `/entries?year=2026` | the same, narrowed to one calendar year (UTC) |
| GET | `/health` | `{ status: "ok" }` |

A malformed `year` is a 400 that says what is expected. Other methods are 405.

## Layout

- `data/changelog.json` — the entries, in the site's shape
- `src/entries.ts` — the entry type and the query over entries
- `src/handler.ts` — the HTTP surface as a pure function, tested without a socket
- `src/server.ts` — `node:http` wiring
