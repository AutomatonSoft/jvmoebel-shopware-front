import { expect, test } from "bun:test";
import { createShopwareClient } from "./client";

test("T06: a stalled read is aborted within a 5-second budget, without retry or stale fallback", async () => {
  let requests = 0;
  const timers: ReturnType<typeof setTimeout>[] = [];
  const server = Bun.serve({
    hostname: "127.0.0.1",
    port: 0,
    fetch: () => {
      requests++;
      return new Promise<Response>((resolve) => {
        timers.push(
          setTimeout(
            () => resolve(Response.json({ elements: [], total: 0 })),
            6500,
          ),
        );
      });
    },
  });
  const client = createShopwareClient({
    config: { endpoint: `${server.url}store-api`, accessToken: "audit-only" },
  });
  const started = performance.now();
  let rejected = false;
  try {
    await client.invoke(
      "readProductListing post /product-listing/{categoryId}",
      {
        body: { limit: 12 },
        pathParams: { categoryId: "category" },
        fetchOptions: { cache: "no-store" },
      },
    );
  } catch {
    rejected = true;
  } finally {
    server.stop(true);
    timers.forEach(clearTimeout);
  }
  expect(rejected).toBe(true);
  expect(performance.now() - started).toBeLessThan(5700);
  expect(requests).toBe(1);
}, 9000);

test("T06: caller's stricter timeout is respected", async () => {
  const timers: ReturnType<typeof setTimeout>[] = [];
  const server = Bun.serve({
    hostname: "127.0.0.1",
    port: 0,
    fetch: () =>
      new Promise<Response>((resolve) => {
        timers.push(
          setTimeout(() => resolve(Response.json({ elements: [] })), 1500),
        );
      }),
  });
  const client = createShopwareClient({
    config: { endpoint: `${server.url}store-api`, accessToken: "audit-only" },
  });
  try {
    await expect(
      client.invoke("readProductListing post /product-listing/{categoryId}", {
        body: {},
        pathParams: { categoryId: "category" },
        fetchOptions: { cache: "no-store", timeout: 40, retry: 0 },
      }),
    ).rejects.toThrow();
  } finally {
    server.stop(true);
    timers.forEach(clearTimeout);
  }
});
