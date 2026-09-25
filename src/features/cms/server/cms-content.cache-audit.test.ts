import { expect, mock, test } from "bun:test";
import {
  fakeClient,
  rawCategory,
  rawCmsPage,
  rawProduct,
} from "../../../../tests/cache-audit/support";

mock.module("next/cache", () => ({ cacheLife: () => {}, cacheTag: () => {} }));
mock.module("next/server", () => ({ connection: async () => {} }));
mock.module("@/integrations/shopware/mock-mode", () => ({
  shouldUseShopwareMocks: () => false,
}));
function cmsSnapshot() {
  const page = rawCmsPage();
  const section = page.sections[0];
  const block = section.blocks[0];
  return {
    ...page,
    sections: [
      {
        ...section,
        blocks: [
          {
            ...block,
            slots: [
              ...block.slots,
              {
                id: "standard-listing",
                slot: "listing",
                type: "product-listing",
                data: {
                  listing: {
                    elements: [rawProduct("listing-product", 827364)],
                  },
                },
              },
            ],
          },
        ],
      },
    ],
  };
}
const api = fakeClient(({ operation }) => {
  if (operation.includes("/landing-page/"))
    return {
      id: "landing",
      name: "Landing",
      translated: {},
      active: true,
      cmsPage: cmsSnapshot(),
    };
  if (operation.includes("/category/"))
    return { ...rawCategory("folder", "folder"), cmsPage: cmsSnapshot() };
  if (operation.includes("/navigation/")) return [];
  throw new Error(`Unexpected ${operation}`);
});
mock.module("@/integrations/shopware/session", () => ({
  getShopwareRequestSession: () => ({ client: api.client }),
}));
mock.module("@/features/storefront-shell/server/storefront-config", () => ({
  getStorefrontShellData: async () => ({ navigation: [] }),
}));
const { getHomeCmsPage } = await import("./home-page");
const { getShopCategoryPage } =
  await import("@/features/catalog/server/category-page");
const { getStorefrontPage } =
  await import("@/features/storefront-shell/server/storefront-page");

for (const kind of ["home", "category", "landing"] as const) {
  test(`T03: ${kind} cached CMS content contains editorial content and product IDs, never product snapshots`, async () => {
    const result =
      kind === "home"
        ? await getHomeCmsPage()
        : kind === "category"
          ? (await getShopCategoryPage("folder")).cmsPage
          : await getStorefrontPage({
              route: {
                kind: "landing-page",
                entityId: "landing",
                canonicalPath: "/landing",
                shouldRedirect: false,
              },
            });
    const payload = JSON.stringify(result);
    expect(payload).toContain("Editorial title");
    expect(payload).toContain("Editorial content");
    expect(payload).toContain("cms-product");
    expect(payload).not.toContain("918273");
    expect(payload).not.toContain("827364");
    expect(payload).not.toContain("calculatedPrice");
    expect(payload).not.toContain("Live cms-product");
    expect(payload).not.toContain("live.webp");
  });
}
