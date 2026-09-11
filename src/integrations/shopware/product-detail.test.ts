import { describe, expect, test } from "bun:test";
import type { components } from "@shopware/api-client/store-api-types";

import { getShopwareProductDetail } from "@/integrations/shopware/product-detail";

type ShopwareProduct = components["schemas"]["Product"];

describe("getShopwareProductDetail", () => {
  test("loads a product while explicitly skipping CMS data", async () => {
    const requests: Array<{ operation: string; request: unknown }> = [];
    const product = {
      calculatedPrice: { listPrice: null, unitPrice: 799 },
      id: "product-id",
      name: "Sessel Nara",
      productNumber: "SW-10002",
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
            },
          };
        }

        return { data: { product } };
      },
    } as unknown as Parameters<typeof getShopwareProductDetail>[0];

    const pageData = await getShopwareProductDetail(client, "product-id");

    expect(pageData?.product.id).toBe("product-id");
    expect(requests.map(({ operation }) => operation)).toEqual([
      "readContext get /context",
      "readProductDetail post /product/{productId}",
    ]);
    expect(requests[1]?.request).toMatchObject({
      pathParams: { productId: "product-id" },
      query: { skipCmsPage: true, skipConfigurator: true },
    });
  });
});
