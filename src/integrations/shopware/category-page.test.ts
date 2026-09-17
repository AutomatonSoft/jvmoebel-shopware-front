import { describe, expect, test } from "bun:test";

import type { ShopProductPageRequest } from "@/features/catalog/model/product-listing-page";
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
              cmsPage: {
                id: "category-cms-page-id",
                sections: [],
                type: "product_list",
              },
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

        return {
          data: {
            aggregations: { price: { max: 1200, min: 100 } },
            elements: [],
            limit: 12,
            page: 2,
            total: 24,
          },
        };
      },
    } as unknown as ShopwareClient;
    const productRequest = {
      categoryIds: [],
      companyIds: [],
      page: 2,
      propertyIds: [],
      sort: "featured",
    } satisfies ShopProductPageRequest;

    const page = await getShopwareCategoryPage(
      client,
      "category-id",
      productRequest,
    );

    expect(page).toMatchObject({
      breadcrumbs: [],
      category: {
        canonicalPath: "/Moebel-Wohnen/",
        description: "Möbel & Wohnen",
        id: "category-id",
        name: "Möbel & Wohnen",
      },
      children: [],
      cmsPage: {
        id: "category-cms-page-id",
        sections: [],
        type: "product_list",
      },
      listing: {
        pagination: {
          currentPage: 2,
          pageSize: 12,
          totalPages: 2,
          totalProducts: 24,
        },
        products: [],
      },
    });
    expect(requests).toContainEqual({
      operation: "readProductListing post /product-listing/{categoryId}",
      request: expect.objectContaining({
        body: expect.objectContaining({ limit: 12, page: 2 }),
        pathParams: { categoryId: "category-id" },
      }),
    });
  });
});
