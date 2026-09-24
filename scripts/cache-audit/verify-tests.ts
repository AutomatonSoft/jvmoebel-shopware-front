/* eslint-disable no-console -- Verification CLI prints a success summary. */
import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const manifest = JSON.parse(
  await readFile("tests/cache-audit/protected-files.sha256.json", "utf8"),
) as Record<string, string>;
const failures: string[] = [];
for (const [path, expected] of Object.entries(manifest)) {
  try {
    // Normalize line endings so Git's CRLF settings do not create false failures.
    const content = (await readFile(path, "utf8")).replace(/\r\n/g, "\n");
    if (createHash("sha256").update(content).digest("hex") !== expected)
      failures.push(`CHANGED ${path}`);
  } catch {
    failures.push(`MISSING ${path}`);
  }
}
async function checkUnexpectedTests(directory: string) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name).replaceAll("\\", "/");
    if (entry.isDirectory()) await checkUnexpectedTests(path);
    else if (/\.(?:test|spec)\.[cm]?[jt]sx?$/.test(path) && !(path in manifest))
      failures.push(`UNREVIEWED TEST ${path}`);
  }
}
await checkUnexpectedTests("src");
await checkUnexpectedTests("tests");
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else
  console.log(
    `PASS: ${Object.keys(manifest).length} protected files unchanged`,
  );
