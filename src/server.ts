import { createServer } from "node:http";
import { loadEntries } from "./entries.ts";
import { handle } from "./handler.ts";

const port = Number(process.env.PORT ?? 3100);
const entries = loadEntries();

createServer((req, res) => {
  const { status, body } = handle(req.method ?? "GET", req.url ?? "/", entries);
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(body));
}).listen(port, () => {
  console.log(`changelog API listening on http://localhost:${port}`);
});
