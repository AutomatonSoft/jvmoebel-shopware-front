import { beforeEach, describe, expect, mock, test } from "bun:test";

import type { CmsProductGridData } from "@/features/cms/contracts/product-grid";

const loadProduct = mock(async (id: string) =>
  id === "missing"
    ? null
    : {
        currency: "EUR",
        locale: "de-DE",
        product: {
          badge: "Neu",
          id,
          image: { alt: "Live image", url: "/live.webp" },
          name: "Live product",
          previousPrice: 150,
          rating: 4.5,
          reviewCount: 10,
          unitPrice: 120,
          url: `/produkt/${id}`,
        },
      },
);
let useMocks = false;

mock.module("next/server", () => ({ connection: async () => {} }));
mock.module("@/integrations/shopware/product-detail", () => ({
  getShopwareProductCardData: (_client: unknown, id: string) => loadProduct(id),
}));
mock.module("@/integrations/shopware/mock-mode", () => ({
  shouldUseShopwareMocks: () => useMocks,
}));
mock.module("@/integrations/shopware/session", () => ({
  getShopwareRequestSession: () => ({ client: {} }),
}));

const { getLiveCmsProductGrid } =
  await import("@/features/cms/server/product-grid");

const cachedData: CmsProductGridData = {
  currency: "EUR",
  layout: "grid",
  locale: "de-DE",
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
  title: "Featured products",
};

beforeEach(() => {
  useMocks = false;
  loadProduct.mockClear();
});

describe("getLiveCmsProductGrid", () => {
  test("replaces cached product prices with current Shopware data", async () => {
    const result = await getLiveCmsProductGrid(cachedData);

    expect(loadProduct).toHaveBeenCalledWith("product-1");
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
    expect(loadProduct).not.toHaveBeenCalled();
  });

  test("does not show a cached price when a product disappeared", async () => {
    const result = await getLiveCmsProductGrid({
      ...cachedData,
      products: [{ ...cachedData.products[0], id: "missing" }],
    });

    expect(result.products).toEqual([]);
  });
});
