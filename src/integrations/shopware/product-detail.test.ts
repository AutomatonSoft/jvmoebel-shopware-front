import { describe, expect, test } from "bun:test";
import type { components } from "@shopware/api-client/store-api-types";

import {
  findShopwareProductVariant,
  getShopwareProductDetail,
} from "@/integrations/shopware/product-detail";

type ShopwareProduct = components["schemas"]["Product"];

describe("getShopwareProductDetail", () => {
  test("loads a product with configurator data while skipping CMS data", async () => {
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
      query: { skipCmsPage: true, skipConfigurator: false },
    });
  });

  test("resolves a variant from the selected Shopware options", async () => {
    const requests: Array<{ operation: string; request: unknown }> = [];
    const client = {
      invoke: async (operation: string, request: unknown) => {
        requests.push({ operation, request });

        return {
          data: { variantId: "variant-product-id" },
        };
      },
    } as unknown as Parameters<typeof findShopwareProductVariant>[0];

    const variantId = await findShopwareProductVariant(
      client,
      "parent-product-id",
      ["black-option-id", "width-220-option-id"],
      "width-group-id",
    );

    expect(variantId).toBe("variant-product-id");
    expect(requests).toEqual([
      {
        operation:
          "searchProductVariantIds post /product/{productId}/find-variant",
        request: {
          body: {
            options: ["black-option-id", "width-220-option-id"],
            switchedGroup: "width-group-id",
          },
          fetchOptions: { cache: "no-store" },
          pathParams: { productId: "parent-product-id" },
        },
      },
    ]);
  });
});
