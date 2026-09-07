import { describe, expect, test } from "bun:test";
import type { components } from "@shopware/api-client/store-api-types";

import { getShopwareProductListing } from "@/integrations/shopware/product-listing";

type ShopwareProduct = components["schemas"]["Product"];

describe("getShopwareProductListing", () => {
  test("loads products from the sales-channel root without a CMS request", async () => {
    const requests: Array<{ operation: string; request: unknown }> = [];
    const product = {
      calculatedPrice: { listPrice: null, unitPrice: 799 },
      id: "product-id",
      name: "Sessel Nara",
      translated: { description: "Bequemer Sessel", name: "Sessel Nara" },
    } as ShopwareProduct;
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
            elements: [product],
            total: 1,
          },
        };
      },
    } as unknown as Parameters<typeof getShopwareProductListing>[0];

    const listing = await getShopwareProductListing(client);

    expect(listing?.products).toHaveLength(1);
    expect(requests.map(({ operation }) => operation)).toEqual([
      "readContext get /context",
      "readProductListing post /product-listing/{categoryId}",
    ]);
    expect(requests[1]?.request).toMatchObject({
      body: {
        associations: {
          categories: {},
          cover: { associations: { media: {} } },
          manufacturer: {},
          properties: { associations: { group: {} } },
        },
        limit: 100,
        page: 1,
      },
      pathParams: { categoryId: "root-category-id" },
    });
  });
});
