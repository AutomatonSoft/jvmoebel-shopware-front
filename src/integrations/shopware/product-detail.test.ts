import { describe, expect, test } from "bun:test";
import type { components } from "@shopware/api-client/store-api-types";

import {
  findShopwareProductVariant,
  getShopwareProductCardData,
  getShopwareProductDetail,
  isShopwareProductAvailable,
} from "@/integrations/shopware/product-detail";

type ShopwareProduct = components["schemas"]["Product"];

describe("getShopwareProductCardData", () => {
  test("loads the current price without configurator or cross-selling requests", async () => {
    const requests: Array<{ operation: string; request: unknown }> = [];
    const product = {
      calculatedPrice: { listPrice: null, unitPrice: 120 },
      id: "product-id",
      name: "Sessel Nara",
      translated: { name: "Sessel Nara" },
    } as ShopwareProduct;
    const client = {
      invoke: async (operation: string, request: unknown) => {
        requests.push({ operation, request });

        return operation === "readContext get /context"
          ? {
              data: {
                currency: { isoCode: "EUR" },
                languageInfo: { localeCode: "de-DE" },
              },
            }
          : { data: { product } };
      },
    } as unknown as Parameters<typeof getShopwareProductCardData>[0];

    const result = await getShopwareProductCardData(client, "product-id");

    expect(result?.product.unitPrice).toBe(120);
    expect(requests.map(({ operation }) => operation)).toEqual([
      "readContext get /context",
      "readProductDetail post /product/{productId}",
    ]);
    expect(requests[1]?.request).toMatchObject({
      fetchOptions: { cache: "no-store" },
      pathParams: { productId: "product-id" },
      query: { skipCmsPage: true, skipConfigurator: true },
    });
  });
});

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

        if (
          operation ===
          "readProductCrossSellings post /product/{productId}/cross-selling"
        ) {
          return { data: [] };
        }

        return { data: { product } };
      },
    } as unknown as Parameters<typeof getShopwareProductDetail>[0];

    const pageData = await getShopwareProductDetail(client, "product-id");

    expect(pageData?.product.id).toBe("product-id");
    expect(requests.map(({ operation }) => operation)).toEqual([
      "readContext get /context",
      "readProductDetail post /product/{productId}",
      "readProductCrossSellings post /product/{productId}/cross-selling",
    ]);
    expect(requests[1]?.request).toMatchObject({
      pathParams: { productId: "product-id" },
      query: { skipCmsPage: true, skipConfigurator: false },
    });
    expect(requests[2]?.request).toMatchObject({
      fetchOptions: { cache: "no-store" },
      pathParams: { productId: "product-id" },
    });
  });

  test("loads inherited cross-selling products from the parent product", async () => {
    const requests: Array<{ operation: string; request: unknown }> = [];
    const product = {
      calculatedPrice: { listPrice: null, unitPrice: 799 },
      id: "variant-product-id",
      name: "Sessel Nara",
      parentId: "parent-product-id",
      productNumber: "SW-10002.1",
      translated: { description: "Bequemer Sessel", name: "Sessel Nara" },
    } as ShopwareProduct;
    const relatedProduct = {
      calculatedPrice: { listPrice: null, unitPrice: 399 },
      id: "related-product-id",
      name: "Hocker Nara",
      productNumber: "SW-10003",
      translated: { description: "Passender Hocker", name: "Hocker Nara" },
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

        if (operation === "readProductDetail post /product/{productId}") {
          return { data: { product } };
        }

        const requestedProductId = (
          request as { pathParams: { productId: string } }
        ).pathParams.productId;

        return {
          data:
            requestedProductId === "variant-product-id"
              ? []
              : [
                  {
                    crossSelling: {
                      id: "accessories",
                      name: "Passende Produkte",
                      position: 1,
                    },
                    products: [relatedProduct],
                    total: 1,
                  },
                ],
        };
      },
    } as unknown as Parameters<typeof getShopwareProductDetail>[0];

    const pageData = await getShopwareProductDetail(
      client,
      "variant-product-id",
    );

    expect(pageData?.relatedProducts.map(({ id }) => id)).toEqual([
      "related-product-id",
    ]);
    expect(
      requests
        .filter(
          ({ operation }) =>
            operation ===
            "readProductCrossSellings post /product/{productId}/cross-selling",
        )
        .map(
          ({ request }) =>
            (request as { pathParams: { productId: string } }).pathParams
              .productId,
        ),
    ).toEqual(["variant-product-id", "parent-product-id"]);
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

  test("checks current product availability without CMS or configurator data", async () => {
    const requests: Array<{ operation: string; request: unknown }> = [];
    const client = {
      invoke: async (operation: string, request: unknown) => {
        requests.push({ operation, request });

        return { data: { product: { available: false } } };
      },
    } as unknown as Parameters<typeof isShopwareProductAvailable>[0];

    await expect(
      isShopwareProductAvailable(client, "unavailable-product-id"),
    ).resolves.toBe(false);
    expect(requests).toEqual([
      {
        operation: "readProductDetail post /product/{productId}",
        request: {
          fetchOptions: { cache: "no-store" },
          pathParams: { productId: "unavailable-product-id" },
          query: { skipCmsPage: true, skipConfigurator: true },
        },
      },
    ]);
  });
});
