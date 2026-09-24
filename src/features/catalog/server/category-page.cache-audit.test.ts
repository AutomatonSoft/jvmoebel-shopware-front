import { beforeEach, expect, mock, test } from "bun:test";
import {
  context,
  deferred,
  fakeClient,
  rawCategory,
  rawProduct,
  turn,
} from "../../../../tests/cache-audit/support";

mock.module("next/cache", () => ({ cacheLife: () => {}, cacheTag: () => {} }));
mock.module("@/integrations/shopware/mock-mode", () => ({
  shouldUseShopwareMocks: () => false,
}));
mock.module("@/features/storefront-shell/server/storefront-config", () => ({
  getStorefrontShellData: async () => ({ navigation: [] }),
}));
let categoryType = "page";
let price = 129;
let listingFailure = false;
let navigation = deferred<unknown[]>();
const api = fakeClient(async ({ operation }) => {
  if (operation.includes("/category/"))
    return rawCategory("category", categoryType);
  if (operation.includes("/navigation/")) return navigation.promise;
  if (operation.includes("/context")) return context;
  if (operation.includes("/product-listing/")) {
    if (listingFailure) throw new Error("Listing unavailable");
    return {
      elements: [rawProduct("live", price)],
      total: 1,
      aggregations: {},
    };
  }
  throw new Error(`Unexpected API operation: ${operation}`);
});
mock.module("@/integrations/shopware/session", () => ({
  getShopwareRequestSession: () => ({ client: api.client }),
}));
const { getShopCategoryPage } = await import("./category-page");

beforeEach(() => {
  categoryType = "page";
  price = 129;
  listingFailure = false;
  api.calls.length = 0;
  navigation = deferred();
});

test("T04: once category type is known, slow children do not delay starting the live listing", async () => {
  const result = getShopCategoryPage("category");
  await turn();
  const listingStartedBeforeNavigation = api.calls.some(({ operation }) =>
    operation.includes("/product-listing/"),
  );
  navigation.resolve([]);
  const page = await result;
  expect(page.listing?.products[0].unitPrice).toBe(129);
  expect(listingStartedBeforeNavigation).toBe(true);
  expect(
    api.calls.filter(({ operation }) => operation.includes("/category/"))
      .length,
  ).toBe(1);
  expect(
    api.calls.filter(({ operation }) => operation.includes("/product-listing/"))
      .length,
  ).toBe(1);
});

test("T04: folder categories never start a listing, including while children are pending", async () => {
  categoryType = "folder";
  const result = getShopCategoryPage("category");
  await turn();
  navigation.resolve([]);
  expect((await result).listing).toBeNull();
  expect(
    api.calls.filter(({ operation }) =>
      operation.includes("/product-listing/"),
    ),
  ).toHaveLength(0);
});

test("T04 guard: independent calls observe a price change and forward listing errors", async () => {
  navigation.resolve([]);
  expect(
    (await getShopCategoryPage("category")).listing?.products[0].unitPrice,
  ).toBe(129);
  price = 249;
  expect(
    (await getShopCategoryPage("category")).listing?.products[0].unitPrice,
  ).toBe(249);
  for (const call of api.calls.filter(({ operation }) =>
    operation.includes("/product-listing/"),
  )) {
    expect(call.options.fetchOptions).toMatchObject({ cache: "no-store" });
  }
  listingFailure = true;
  await expect(getShopCategoryPage("category")).rejects.toThrow(
    "Listing unavailable",
  );
});
