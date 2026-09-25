/* eslint-disable no-console -- Standalone audit CLI prints build and check results. */
/** Real Next production regression checks. Only the local fake Store API is used. */
import assert from "node:assert/strict";
import { cp, mkdtemp, readFile, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import {
  context,
  rawCategory,
  rawCmsPage,
  rawProduct,
} from "../../tests/cache-audit/support";

const source = process.cwd();
const workdir = await mkdtemp(join(tmpdir(), "jv-cache-audit-"));
let price = 1299;
const requests: Array<{ path: string; started: number; finished: number }> = [];
const api = Bun.serve({
  hostname: "127.0.0.1",
  port: 0,
  async fetch(request) {
    const path = new URL(request.url).pathname.replace(/^\/store-api/, "");
    const call = { path, started: performance.now(), finished: 0 };
    requests.push(call);
    const body =
      request.method === "POST"
        ? ((await request.json()) as Record<string, unknown>)
        : {};
    let data: unknown;
    if (path === "/jv-seo/redirect") data = { data: null };
    else if (path === "/context") data = context;
    else if (path === "/storefront-config")
      data = {
        header: {
          branding: { name: "Audit store", logo: null },
          navigation: [],
        },
        footer: {
          about: { description: "Audit", eyebrow: "Audit", title: "Audit" },
          categoryNavigation: [],
          serviceNavigation: [],
          copyrightText: "Audit",
          internationalLinks: [],
          paymentBadges: [],
          shippingBadges: [],
          socialLinks: [],
          revocation: {
            buttonLabel: null,
            enabled: false,
            recipientEmail: null,
          },
        },
      };
    else if (path === "/seo-url")
      data = {
        elements: [
          {
            foreignKey: "category",
            seoPathInfo: "audit-category",
            routeName: "frontend.navigation.page",
            isCanonical: true,
            isDeleted: false,
          },
        ],
      };
    else if (path.startsWith("/category/"))
      data = {
        ...rawCategory(),
        cmsPage: path.endsWith("/home") ? rawCmsPage() : null,
      };
    else if (path.startsWith("/navigation/")) {
      await Bun.sleep(150);
      data = [];
    } else if (
      path.startsWith("/product-listing/") ||
      path === "/search" ||
      path === "/product"
    ) {
      const ids = Array.isArray(body.ids) ? (body.ids as string[]) : ["live"];
      data = {
        elements: ids.map((id) => rawProduct(id, price)),
        total: ids.length,
        limit: 12,
        page: 1,
        aggregations: {},
      };
    } else if (path.startsWith("/product/"))
      data = {
        product: rawProduct(path.split("/").at(-1)!, price),
        configurator: [],
      };
    else {
      console.error("Unexpected fixture endpoint", path);
      return Response.json(
        { error: "Unknown fixture endpoint" },
        { status: 501 },
      );
    }
    call.finished = performance.now();
    return Response.json(data);
  },
});
let frontend: ReturnType<typeof Bun.spawn> | undefined;
let serverLog = "";
let failures = 0;

async function check(name: string, fn: () => void | Promise<void>) {
  try {
    await fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    failures++;
    console.error(
      `FAIL ${name}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

try {
  for (const entry of [
    "src",
    "package.json",
    "tsconfig.json",
    "postcss.config.mjs",
    "next-env.d.ts",
  ])
    await cp(join(source, entry), join(workdir, entry), { recursive: true });
  // Tests are typechecked separately in the repository; the fixture builds production only.
  const tsconfig = JSON.parse(
    await readFile(join(workdir, "tsconfig.json"), "utf8"),
  );
  tsconfig.exclude = ["node_modules", "**/*.test.ts", "**/*.test.tsx"];
  await writeFile(join(workdir, "tsconfig.json"), JSON.stringify(tsconfig));
  await symlink(
    join(source, "node_modules"),
    join(workdir, "node_modules"),
    "junction",
  );
  await symlink(join(source, "public"), join(workdir, "public"), "junction");
  const config = (
    await readFile(join(source, "next.config.ts"), "utf8")
  ).replace('output: "standalone",', "");
  await writeFile(join(workdir, "next.config.ts"), config);
  const env = {
    ...process.env,
    NODE_ENV: "production",
    SHOPWARE_USE_MOCKS: "false",
    SHOPWARE_ENDPOINT: `${api.url}store-api`,
    SHOPWARE_ACCESS_TOKEN: "audit-only",
    NEXT_TELEMETRY_DISABLED: "1",
  };
  console.log(`Isolated production build: ${workdir}`);
  const next = resolve("node_modules/next/dist/bin/next");
  const build = Bun.spawn(["node", next, "build", "--webpack"], {
    cwd: workdir,
    env,
    stdout: "pipe",
    stderr: "pipe",
  });
  const [out, err, code] = await Promise.all([
    new Response(build.stdout).text(),
    new Response(build.stderr).text(),
    build.exited,
  ]);
  if (code !== 0)
    throw new Error(`Production fixture build failed:\n${out}\n${err}`);
  console.log(out);
  const portProbe = Bun.serve({
    hostname: "127.0.0.1",
    port: 0,
    fetch: () => new Response(),
  });
  const port = portProbe.port;
  portProbe.stop(true);
  frontend = Bun.spawn(
    ["node", next, "start", "--hostname", "127.0.0.1", "--port", String(port)],
    { cwd: workdir, env, stdout: "pipe", stderr: "pipe" },
  );
  const collect = async (stream: ReadableStream<Uint8Array>) => {
    const reader = stream.getReader();
    for (let part = await reader.read(); !part.done; part = await reader.read())
      serverLog += new TextDecoder().decode(part.value);
  };
  void collect(frontend.stdout as ReadableStream<Uint8Array>);
  void collect(frontend.stderr as ReadableStream<Uint8Array>);
  const base = `http://127.0.0.1:${port}`;
  let ready = false;
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      ready = (await fetch(`${base}/api/health`)).ok;
    } catch {
      /* booting */
    }
    if (ready) break;
    await Bun.sleep(100);
  }
  assert.ok(ready, "Production Next server must start");
  async function page(path: string) {
    const response = await fetch(`${base}${path}`, {
      headers: { "User-Agent": "Mozilla/5.0 cache-audit" },
    });
    const html = await response.text();
    assert.equal(response.status, 200, html.slice(-1500));
    return { html, cacheControl: response.headers.get("cache-control") };
  }
  const start = requests.length;
  const cold = await page("/audit-category");
  const firstRequests = requests.slice(start);
  price = 2499;
  const warmStart = requests.length;
  const warm = await page("/audit-category");
  const warmRequests = requests.slice(warmStart);
  await check(
    "T04/T05 guard: exactly one fresh listing per HTTP render; cached category remains reusable",
    () => {
      assert.equal(
        firstRequests.filter((call) =>
          call.path.startsWith("/product-listing/"),
        ).length,
        1,
      );
      assert.equal(
        warmRequests.filter((call) => call.path.startsWith("/product-listing/"))
          .length,
        1,
      );
      assert.equal(
        warmRequests.filter((call) => call.path.startsWith("/category/"))
          .length,
        0,
      );
      assert.ok(cold.html.includes("1.299"));
      assert.ok(warm.html.includes("2.499"));
      assert.ok(!warm.html.includes("1.299"));
      assert.ok(warm.cacheControl?.includes("no-store"));
    },
  );
  await check(
    "T04: listing starts before unrelated navigation completes in a cold production request",
    () => {
      const listing = firstRequests.find((call) =>
        call.path.startsWith("/product-listing/"),
      );
      const navigation = firstRequests.find((call) =>
        call.path.startsWith("/navigation/"),
      );
      assert.ok(listing && navigation, "Fixture must exercise both requests");
      assert.ok(
        listing.started < navigation.finished,
        JSON.stringify(firstRequests),
      );
    },
  );
  await check(
    "T03 guard: a warm CMS page still renders current prices",
    async () => {
      const first = await page("/");
      price = 3499;
      const second = await page("/");
      assert.ok(
        first.html.includes("2.499"),
        "First CMS response must display the live price",
      );
      assert.ok(
        second.html.includes("3.499"),
        "Second CMS response must display the changed price",
      );
      assert.ok(
        !second.html.includes("2.499"),
        "Previous live CMS price must not survive",
      );
      assert.ok(
        !second.html.includes("918.273"),
        "CMS snapshot price must never render",
      );
      assert.ok(
        second.html.includes("Editorial title"),
        "CMS cannot simply be removed",
      );
    },
  );
  console.log(
    JSON.stringify({
      failures,
      coldRequestCount: firstRequests.length,
      warmRequestCount: warmRequests.length,
      workdir,
    }),
  );
  process.exitCode = failures ? 1 : 0;
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  console.error(serverLog);
  process.exitCode = 1;
} finally {
  frontend?.kill();
  if (frontend) await frontend.exited;
  api.stop(true);
  // Retain the exact generated fixture for inspection; never recursively remove a caller path.
  console.log(`Generated fixture retained at ${workdir}`);
}
