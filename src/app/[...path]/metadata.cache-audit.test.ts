import { expect, mock, test } from "bun:test";
import {
  context,
  fakeClient,
  rawCategory,
  rawProduct,
} from "../../../tests/cache-audit/support";

mock.module("next/cache", () => ({ cacheLife: () => {}, cacheTag: () => {} }));
mock.module("next/navigation", () => ({
  notFound: () => {
    throw new Error("NOT_FOUND");
  },
  permanentRedirect: () => {
    throw new Error("REDIRECT");
  },
}));
mock.module("@/features/catalog/components/category-page", () => ({
  CategoryPage: () => null,
}));
mock.module("@/features/catalog/components/product-detail", () => ({
  ProductDetail: () => null,
}));
mock.module("@/features/cms/components/cms-landing-page-view", () => ({
  CmsLandingPageView: () => null,
}));
mock.module(
  "@/features/storefront-shell/components/storefront-route-loading",
  () => ({ StorefrontPageLoading: () => null }),
);
mock.module("@/integrations/shopware/mock-mode", () => ({
  shouldUseShopwareMocks: () => false,
}));
mock.module("@/features/storefront-shell/server/storefront-config", () => ({
  getStorefrontShellData: async () => ({ navigation: [] }),
}));
let failListing = false;
const api = fakeClient(({ operation }) => {
  if (operation.includes("/seo-url"))
    return {
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
  if (operation.includes("/category/")) return rawCategory();
  if (operation.includes("/navigation/")) return [];
  if (operation.includes("/context")) return context;
  if (operation.includes("/product-listing/")) {
    if (failListing) throw new Error("Listing offline");
    return { elements: [rawProduct("live")], total: 1, aggregations: {} };
  }
  throw new Error(`Unexpected ${operation}`);
});
mock.module("@/integrations/shopware/session", () => ({
  getShopwareRequestSession: () => ({ client: api.client }),
}));
const { generateMetadata } = await import("./page");

test("T05: category metadata reads no products, context or navigation", async () => {
  api.calls.length = 0;
  const metadata = await generateMetadata({
    params: Promise.resolve({ path: ["audit-category"] }),
    searchParams: Promise.resolve({ page: "4", minPrice: "100" }),
  });
  expect(metadata).toMatchObject({
    title: "Audit title",
    description: "Audit description",
    alternates: { canonical: "/audit-category" },
  });
  expect(
    api.calls.filter(({ operation }) =>
      /product-listing|\/context|\/navigation\//.test(operation),
    ),
  ).toHaveLength(0);
});

test("T05: listing failure cannot prevent valid category metadata", async () => {
  failListing = true;
  try {
    const metadata = await generateMetadata({
      params: Promise.resolve({ path: ["audit-category"] }),
      searchParams: Promise.resolve({}),
    });
    expect(metadata.title).toBe("Audit title");
  } finally {
    failListing = false;
  }
});
