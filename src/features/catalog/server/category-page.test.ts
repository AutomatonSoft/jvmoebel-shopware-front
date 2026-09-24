import { beforeEach, describe, expect, mock, test } from "bun:test";

import type { ShopCategoryPageContent } from "@/features/catalog/model/category-page";
import type { ShopProductListingPage } from "@/features/catalog/model/product-listing-page";

const content: ShopCategoryPageContent = {
  breadcrumbs: [],
  category: {
    canonicalPath: "/category/",
    description: "",
    id: "category-id",
    name: "Category",
  },
  children: [],
  cmsPage: null,
  hasProductListing: false,
};
const listing = {} as ShopProductListingPage;
let hasProductListing = false;
const loadListing = mock(async () => listing);

mock.module("next/cache", () => ({
  cacheLife: () => {},
  cacheTag: () => {},
}));
mock.module("@/features/catalog/server/product-listing", () => ({
  getShopProductListingPage: loadListing,
}));
mock.module("@/features/storefront-shell/server/storefront-config", () => ({
  getStorefrontShellData: async () => ({ navigation: [] }),
}));
mock.module("@/integrations/shopware/category-page", () => ({
  getShopwareCategoryPageContent: async () => ({
    ...content,
    hasProductListing,
  }),
}));
mock.module("@/integrations/shopware/session", () => ({
  getShopwareRequestSession: () => ({ client: {} }),
}));

const { getShopCategoryPage } =
  await import("@/features/catalog/server/category-page");

beforeEach(() => {
  hasProductListing = false;
  loadListing.mockClear();
});

describe("getShopCategoryPage", () => {
  test("does not request products for a folder category", async () => {
    const page = await getShopCategoryPage("category-id");

    expect(page.listing).toBeNull();
    expect(loadListing).not.toHaveBeenCalled();
  });

  test("requests products for a category with a listing", async () => {
    hasProductListing = true;

    const page = await getShopCategoryPage("category-id");

    expect(page.listing).toBe(listing);
    expect(loadListing).toHaveBeenCalledTimes(1);
    expect(loadListing).toHaveBeenCalledWith(expect.any(Object), "category-id");
  });
});
