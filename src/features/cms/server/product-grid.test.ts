import { beforeEach, describe, expect, mock, test } from "bun:test";
import type { CmsProductGridData } from "@/features/cms/contracts/product-grid";
import {
  context,
  fakeClient,
  rawProduct,
} from "../../../../tests/cache-audit/support";

// Mock the external API boundary, not a chosen single-product implementation.
let useMocks = false;
let price = 120;
let unavailable = new Set<string>();
let failProducts = false;
const api = fakeClient(({ operation, options }) => {
  if (operation.includes("/context")) return context;
  if (failProducts) throw new Error("Products unavailable");
  const liveProduct = (id: string) => ({
    ...rawProduct(id, price),
    name: "Live product",
    translated: { name: "Live product" },
    cover: { media: { url: "/live.webp", alt: "Live image" } },
    calculatedPrice: { unitPrice: price, listPrice: { price: price + 30 } },
  });
  if (operation.includes("/product/{productId}")) {
    const id = (options.pathParams as { productId: string }).productId;
    return { product: unavailable.has(id) ? null : liveProduct(id) };
  }
  if (
    operation.includes("/search") ||
    operation === "readProduct post /product"
  ) {
    const body = options.body as {
      ids?: string[];
      filter?: Array<{ field: string; value: string | string[] }>;
    };
    const filter = body.filter?.find((item) => item.field === "id");
    const ids =
      body.ids ??
      (Array.isArray(filter?.value)
        ? filter.value
        : filter?.value.split("|")) ??
      [];
    return {
      elements: ids
        .filter((id) => !unavailable.has(id))
        .reverse()
        .map(liveProduct),
      total: ids.length,
    };
  }
  throw new Error(`Unexpected product API operation: ${operation}`);
});
mock.module("next/server", () => ({ connection: async () => {} }));
mock.module("@/integrations/shopware/mock-mode", () => ({
  shouldUseShopwareMocks: () => useMocks,
}));
mock.module("@/integrations/shopware/session", () => ({
  getShopwareRequestSession: () => ({ client: api.client }),
}));
const { getLiveCmsProductGrid } = await import("./product-grid");
const cachedData: CmsProductGridData = {
  currency: "EUR",
  locale: "de-DE",
  layout: "grid",
  title: "Featured products",
  products: [
    {
      id: "product-1",
      image: { alt: "Cached image", url: "/cached.webp" },
      name: "Cached product",
      position: 0,
      unitPrice: 100,
      url: "/produkt/product-1",
    },
  ],
};
beforeEach(() => {
  useMocks = false;
  price = 120;
  failProducts = false;
  unavailable = new Set();
  api.calls.length = 0;
});

describe("getLiveCmsProductGrid", () => {
  test("T03: reference-only input can be hydrated without a cached price", async () => {
    const references = {
      ...cachedData,
      products: [{ id: "product-1", position: 0 }],
    } as unknown as CmsProductGridData;
    const result = await getLiveCmsProductGrid(references);
    expect(result.products).toHaveLength(1);
    expect(result.products[0]).toMatchObject({
      id: "product-1",
      unitPrice: 120,
      name: "Live product",
      position: 0,
    });
  });
  test("replaces cached product prices with current Shopware data", async () => {
    const result = await getLiveCmsProductGrid(cachedData);
    expect(result.products[0]).toMatchObject({
      image: { url: "/live.webp" },
      name: "Live product",
      previousPrice: 150,
      unitPrice: 120,
    });
  });
  test("keeps deterministic fixture data in mock mode", async () => {
    useMocks = true;
    expect(await getLiveCmsProductGrid(cachedData)).toBe(cachedData);
    expect(api.calls).toHaveLength(0);
  });
  test("does not show a cached price when a product disappeared", async () => {
    unavailable.add("missing");
    expect(
      (
        await getLiveCmsProductGrid({
          ...cachedData,
          products: [{ ...cachedData.products[0], id: "missing" }],
        })
      ).products,
    ).toEqual([]);
  });
  test("T03: eight distinct product references use at most one product query and preserve CMS order", async () => {
    const products = Array.from({ length: 8 }, (_, position) => ({
      ...cachedData.products[0],
      id: `p${position}`,
      position,
    }));
    const result = await getLiveCmsProductGrid({ ...cachedData, products });
    expect(result.products.map((product) => product.id)).toEqual(
      products.map((product) => product.id),
    );
    expect(result.products.every((product) => product.unitPrice === 120)).toBe(
      true,
    );
    expect(
      api.calls.filter(({ operation }) => !operation.includes("/context")),
    ).toHaveLength(1);
    expect(
      api.calls.filter(({ operation }) => operation.includes("/context"))
        .length,
    ).toBeLessThanOrEqual(1);
  });
  test("T03: later calls see new prices; an API failure never resurrects CMS prices", async () => {
    expect(
      (await getLiveCmsProductGrid(cachedData)).products[0].unitPrice,
    ).toBe(120);
    price = 230;
    expect(
      (await getLiveCmsProductGrid(cachedData)).products[0].unitPrice,
    ).toBe(230);
    failProducts = true;
    expect((await getLiveCmsProductGrid(cachedData)).products).toEqual([]);
    for (const call of api.calls)
      expect(call.options.fetchOptions).toMatchObject({ cache: "no-store" });
  });
  test("T03: an empty grid performs no context or product request", async () => {
    expect(
      (await getLiveCmsProductGrid({ ...cachedData, products: [] })).products,
    ).toEqual([]);
    expect(api.calls).toHaveLength(0);
  });
});
