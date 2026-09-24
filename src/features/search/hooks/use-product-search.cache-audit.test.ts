import { expect, test } from "bun:test";
import { resolve } from "node:path";

test("T01: real React search hook does not reuse previous prices when reopened", async () => {
  const child = Bun.spawn(
    [
      process.execPath,
      resolve("scripts/cache-audit/browser-scenarios.tsx"),
      "search",
    ],
    { stdout: "pipe", stderr: "pipe" },
  );
  const [stdout, stderr, code] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  expect({ code, output: code ? stdout + stderr : "PASS" }).toEqual({
    code: 0,
    output: "PASS",
  });
}, 15_000);
