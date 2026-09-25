import { expect, test } from "bun:test";
import { resolve } from "node:path";

for (const scenario of ["recent-storage", "recent-ui"]) {
  test(`T02: ${scenario} preserves history without reusing product snapshots`, async () => {
    const child = Bun.spawn(
      [
        process.execPath,
        resolve("scripts/cache-audit/browser-scenarios.tsx"),
        scenario,
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
}
