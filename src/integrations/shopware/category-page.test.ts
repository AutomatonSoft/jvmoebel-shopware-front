import { describe, expect, test } from "bun:test";

import { getShopwareCategoryPage } from "@/integrations/shopware/category-page";
import type { ShopwareClient } from "@/integrations/shopware/client";

describe("getShopwareCategoryPage", () => {
  test("loads category navigation and products for the selected category", async () => {
    const requests: Array<{ operation: string; request: unknown }> = [];
    const client = {
      invoke: async (operation: string, request: unknown) => {
        requests.push({ operation, request });

        if (operation === "readCategory post /category/{navigationId}") {
          return {
            data: {
              description: "Möbel &amp; Wohnen",
              id: "category-id",
              name: "Möbel & Wohnen",
              path: "|root-category-id|",
              seoUrl: "/Moebel-Wohnen/",
              translated: {
                description: "Möbel &amp; Wohnen",
                name: "Möbel & Wohnen",
              },
              type: "page",
            },
          };
        }

        if (operation === "readContext get /context") {
          return {
            data: {
              currency: { isoCode: "EUR" },
              languageInfo: { localeCode: "de-DE" },
              salesChannel: { navigationCategoryId: "root-category-id" },
            },
          };
        }

        if (
          operation === "readNavigation post /navigation/{activeId}/{rootId}"
        ) {
          return { data: [] };
        }

        return { data: { elements: [], total: 0 } };
      },
    } as unknown as ShopwareClient;

    const page = await getShopwareCategoryPage(client, "category-id");

    expect(page).toMatchObject({
      breadcrumbs: [],
      category: {
        canonicalPath: "/Moebel-Wohnen/",
        description: "Möbel & Wohnen",
        id: "category-id",
        name: "Möbel & Wohnen",
      },
      children: [],
      listing: null,
    });
    expect(requests).toContainEqual({
      operation: "readProductListing post /product-listing/{categoryId}",
      request: expect.objectContaining({
        pathParams: { categoryId: "category-id" },
      }),
    });
  });
});
