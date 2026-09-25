/* eslint-disable no-console -- Audit CLI prints test results. */
// Runs with React's browser exports, in a separate process from RSC Bun tests.
import assert from "node:assert/strict";
import { Window } from "happy-dom";
import { act } from "react";
import type { ReactNode } from "react";

const browser = new Window({ url: "http://localhost/warenkorb" });
for (const [key, value] of Object.entries({
  window: browser,
  document: browser.document,
  navigator: browser.navigator,
  HTMLElement: browser.HTMLElement,
  IS_REACT_ACT_ENVIRONMENT: true,
})) {
  Object.defineProperty(globalThis, key, {
    configurable: true,
    writable: true,
    value,
  });
}
const { createRoot } = await import("react-dom/client");
const host = document.createElement("div");
document.body.append(host);
const root = createRoot(host);
async function render(node: ReactNode) {
  await act(async () => {
    root.render(node);
  });
}
async function settle(ms = 340) {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, ms));
  });
}

try {
  if (process.argv[2] === "search") {
    const { useProductSearch } =
      await import("../../src/features/search/hooks/use-product-search");
    let price = 129;
    let requests = 0;
    const options: RequestInit[] = [];
    globalThis.fetch = (async (_input: unknown, init?: RequestInit) => {
      requests++;
      options.push(init ?? {});
      return Response.json({
        currency: "EUR",
        locale: "de-DE",
        results: [{ id: "p", name: "Live", unitPrice: price }],
      });
    }) as typeof fetch;
    function Search({
      open,
      query = " chair ",
    }: {
      open: boolean;
      query?: string;
    }) {
      return <pre>{JSON.stringify(useProductSearch(query, open))}</pre>;
    }
    const state = () => JSON.parse(host.textContent ?? "{}");
    await render(<Search open />);
    await settle();
    assert.equal(
      state().results[0]?.unitPrice,
      129,
      "Initial live price must render",
    );
    await render(<Search open={false} />);
    price = 249;
    await render(<Search open />);
    assert.deepEqual(
      state().results,
      [],
      "Reopening must not flash previously cached prices during refresh",
    );
    await settle();
    assert.equal(
      requests,
      2,
      "Same query after reopening must reach the server again",
    );
    assert.equal(
      state().results[0]?.unitPrice,
      249,
      "Updated price must replace previous price",
    );
    assert.ok(
      options.every((option) => option.cache === "no-store"),
      "Browser HTTP cache must be bypassed for prices",
    );
    await render(<Search open query="   " />);
    await settle();
    assert.equal(requests, 2, "Empty queries must not call the backend");
    assert.deepEqual(state().results, [], "Empty search clears old results");
    let finishOld!: (response: Response) => void;
    globalThis.fetch = (async (input: unknown) =>
      String(input).includes("query=old")
        ? new Promise<Response>((resolve) => {
            finishOld = resolve;
          })
        : Response.json({
            currency: "EUR",
            locale: "de-DE",
            results: [{ id: "new", unitPrice: 777 }],
          })) as typeof fetch;
    await render(<Search open query="old" />);
    await settle();
    await render(<Search open query="new" />);
    await settle();
    assert.equal(state().results[0]?.id, "new");
    await act(async () => {
      finishOld(Response.json({ results: [{ id: "old", unitPrice: 1 }] }));
    });
    assert.equal(
      state().results[0]?.id,
      "new",
      "An obsolete response must not overwrite the current query",
    );
  } else if (process.argv[2] === "recent-storage") {
    const store =
      await import("../../src/features/catalog/hooks/recently-viewed-products");
    const { shopProductListingMock } =
      await import("../../src/features/catalog/fixtures/product-listing");
    const product = {
      ...shopProductListingMock.products[0],
      id: "first",
      unitPrice: 918273,
    };
    browser.localStorage.setItem(
      "jvmoebel:recently-viewed-products",
      JSON.stringify([product]),
    );
    const migrated = store.getRecentlyViewedProducts();
    assert.deepEqual(
      migrated.map((entry) => entry.id),
      ["first"],
      "Legacy IDs must be retained",
    );
    assert.ok(
      migrated.every((entry) =>
        Object.keys(entry).every((key) => key === "id"),
      ),
      "Legacy cached product fields must not escape storage",
    );
    for (let index = 0; index < 14; index++)
      store.rememberRecentlyViewedProduct({ ...product, id: String(index) });
    store.rememberRecentlyViewedProduct({ ...product, id: "12" });
    const result = store.getRecentlyViewedProducts();
    assert.equal(result.length, 12);
    assert.equal(result[0].id, "12");
    assert.equal(new Set(result.map((entry) => entry.id)).size, 12);
    const persisted = JSON.parse(
      browser.localStorage.getItem("jvmoebel:recently-viewed-products") ?? "[]",
    );
    assert.ok(
      persisted.every((entry: Record<string, unknown>) =>
        Object.keys(entry).every((key) => key === "id"),
      ),
      "Persist only product IDs, never prices or product snapshots",
    );
    assert.deepEqual(store.getServerRecentlyViewedProducts(), []);
  } else if (process.argv[2] === "recent-ui") {
    const { shopProductListingMock } =
      await import("../../src/features/catalog/fixtures/product-listing");
    const old = {
      ...shopProductListingMock.products[0],
      unitPrice: 918273,
      name: "STALE PRODUCT",
    };
    browser.localStorage.setItem(
      "jvmoebel:recently-viewed-products",
      JSON.stringify([old]),
    );
    let calls = 0;
    let finishLoad!: () => void;
    const pending = new Promise<void>((resolve) => {
      finishLoad = resolve;
    });
    globalThis.fetch = (async (_input: unknown, init?: RequestInit) => {
      calls++;
      assert.equal(init?.cache, "no-store");
      await pending;
      return Response.json({
        ...shopProductListingMock,
        products: [{ ...old, name: "FRESH PRODUCT", unitPrice: 249 }],
      });
    }) as typeof fetch;
    const { CartProductRails } =
      await import("../../src/features/cart/components/cart-product-rail");
    await render(
      <CartProductRails
        recommendations={{ ...shopProductListingMock, products: [] }}
      />,
    );
    assert.ok(
      !host.textContent?.includes("STALE PRODUCT"),
      "Pending hydration must not render the legacy snapshot",
    );
    finishLoad();
    await settle(30);
    assert.ok(
      calls > 0,
      "Recently viewed IDs must be hydrated from current server data",
    );
    assert.ok(
      host.textContent?.includes("FRESH PRODUCT"),
      "Fresh product must remain visible; deleting the rail is not a fix",
    );
    assert.ok(!host.textContent?.includes("STALE PRODUCT"));
    assert.ok(
      !host.textContent?.includes("918.273"),
      "Legacy price must never render",
    );
    await render(null);
    globalThis.fetch = (async () =>
      Response.json(
        { message: "Offline" },
        { status: 502 },
      )) as unknown as typeof fetch;
    await render(
      <CartProductRails
        recommendations={{ ...shopProductListingMock, products: [] }}
      />,
    );
    await settle(30);
    assert.ok(
      !host.textContent?.includes("STALE PRODUCT"),
      "API failure must not restore legacy snapshots",
    );
    assert.ok(
      !host.textContent?.includes("FRESH PRODUCT"),
      "A remount after API failure must not reuse an earlier price",
    );
  } else {
    throw new Error("Unknown browser audit scenario");
  }
  console.log(`PASS ${process.argv[2]}`);
} finally {
  await act(async () => {
    root.unmount();
  });
  await browser.happyDOM.close();
}
