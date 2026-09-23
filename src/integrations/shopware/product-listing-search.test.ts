import { describe, expect, test } from "bun:test";

import { getShopwareProductListingPage } from "@/integrations/shopware/product-listing";

describe("getShopwareProductListingPage search", () => {
  test("uses the full product search endpoint for a search query", async () => {
    const requests: Array<{ operation: string; request: unknown }> = [];
    const client = {
      invoke: async (operation: string, request: unknown) => {
        requests.push({ operation, request });

        if (operation === "readContext get /context") {
          return {
            data: {
              currency: { isoCode: "EUR" },
              languageInfo: { localeCode: "de-DE" },
              salesChannel: { navigationCategoryId: "root-category-id" },
            },
          };
        }

        return {
          data: {
            aggregations: { price: { max: 0, min: 0 } },
            elements: [],
            limit: 12,
            page: 1,
            total: 0,
          },
        };
      },
    } as unknown as Parameters<typeof getShopwareProductListingPage>[0];

    await getShopwareProductListingPage(client, {
      categoryIds: [],
      companyIds: [],
      page: 1,
      propertyGroups: {},
      propertyIds: [],
      search: "Sofa",
      sort: "featured",
    });

    expect(requests[1]).toMatchObject({
      operation: "searchPage post /search",
      request: { body: { search: "Sofa" } },
    });
  });
});
