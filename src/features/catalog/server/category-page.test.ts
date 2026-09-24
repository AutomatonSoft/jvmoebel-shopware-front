import { beforeEach, describe, expect, mock, test } from "bun:test";
import {
  context,
  fakeClient,
  rawCategory,
  rawProduct,
} from "../../../../tests/cache-audit/support";

let hasProductListing = false;
const api = fakeClient(({ operation }) => {
  if (operation.includes("/category/"))
    return rawCategory("category-id", hasProductListing ? "page" : "folder");
  if (operation.includes("/navigation/")) return [];
  if (operation.includes("/context")) return context;
  if (operation.includes("/product-listing/"))
    return { elements: [rawProduct("product")], total: 1 };
  throw new Error(`Unexpected API operation: ${operation}`);
});
mock.module("next/cache", () => ({ cacheLife: () => {}, cacheTag: () => {} }));
mock.module("@/integrations/shopware/mock-mode", () => ({
  shouldUseShopwareMocks: () => false,
}));
mock.module("@/features/storefront-shell/server/storefront-config", () => ({
  getStorefrontShellData: async () => ({ navigation: [] }),
}));
mock.module("@/integrations/shopware/session", () => ({
  getShopwareRequestSession: () => ({ client: api.client }),
}));
const { getShopCategoryPage } = await import("./category-page");

beforeEach(() => {
  hasProductListing = false;
  api.calls.length = 0;
});

describe("getShopCategoryPage", () => {
  test("does not request products for a folder category", async () => {
    expect((await getShopCategoryPage("category-id")).listing).toBeNull();
    expect(
      api.calls.filter(({ operation }) =>
        operation.includes("/product-listing/"),
      ),
    ).toHaveLength(0);
  });
  test("requests products for a category with a listing", async () => {
    hasProductListing = true;
    const page = await getShopCategoryPage("category-id");
    expect(page.listing?.products.map((product) => product.id)).toEqual([
      "product",
    ]);
    const requests = api.calls.filter(({ operation }) =>
      operation.includes("/product-listing/"),
    );
    expect(requests).toHaveLength(1);
    expect(requests[0].options.pathParams).toEqual({
      categoryId: "category-id",
    });
  });
});
