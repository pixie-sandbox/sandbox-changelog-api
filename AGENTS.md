# Working in this repository

- TypeScript, run directly by Node 24+ (type stripping). Use only erasable
  syntax — no `enum`, no `namespace`, no parameter properties — and import
  local files with their `.ts` extension.
- No dependencies. Add one only if the change cannot be made without it.
- Tests use `node:test` and `node:assert/strict`, in `test/*.test.ts`. Test
  `handle()` directly; do not open a socket in a test.
- The entry shape is shared with `pixie-sandbox/pixie-sandbox-site`
  (`data/changelog.json` there). A change to what an entry carries belongs in
  both repositories.
