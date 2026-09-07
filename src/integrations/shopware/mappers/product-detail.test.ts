import { describe, expect, test } from "bun:test";
import type { components } from "@shopware/api-client/store-api-types";

import { mapShopwareProductDetail } from "@/integrations/shopware/mappers/product-detail";

type ShopwareProduct = components["schemas"]["Product"];

describe("mapShopwareProductDetail", () => {
  test("normalizes a Store API product without CMS data", () => {
    const product = {
      available: true,
      calculatedPrice: { listPrice: null, unitPrice: 1499 },
      categories: [
        {
          id: "sofas",
          name: "Sofas",
          translated: { name: "Sofas" },
        },
      ],
      cover: {
        media: {
          alt: "Sofa Vorderansicht",
          translated: { alt: "Sofa Vorderansicht" },
          url: "https://shop.example.com/media/front.webp",
        },
      },
      deliveryTime: { max: 6, min: 2, unit: "week" },
      description: "<p>Ausführliche Produktbeschreibung.</p>",
      id: "product-id",
      measurements: {
        height: { unit: "cm", value: 82 },
        length: { unit: "cm", value: 95 },
        width: { unit: "cm", value: 220 },
      },
      media: [
        {
          media: {
            alt: "Sofa Detail",
            translated: { alt: "Sofa Detail" },
            url: "https://shop.example.com/media/detail.webp",
          },
          position: 2,
        },
      ],
      name: "Sofa Alba",
      productNumber: "SW-10001",
      properties: [
        {
          group: { id: "material", name: "Material" },
          groupId: "material",
          id: "velvet",
          name: "Samt",
          translated: { name: "Samt" },
        },
      ],
      translated: {
        description: "<p>Ausführliche Produktbeschreibung.</p>",
        name: "Sofa Alba",
      },
    } as ShopwareProduct;

    const pageData = mapShopwareProductDetail({
      currency: "EUR",
      locale: "de-DE",
      product,
    });

    expect(pageData).toMatchObject({
      currency: "EUR",
      locale: "de-DE",
      product: {
        articleNumber: "SW-10001",
        availability: "Auf Lager",
        deliveryEstimate: "2–6 Wochen",
        dimensions: { height: 82, length: 95, unit: "cm", width: 220 },
        gallery: [
          { url: "https://shop.example.com/media/front.webp" },
          { url: "https://shop.example.com/media/detail.webp" },
        ],
        longDescription: "Ausführliche Produktbeschreibung.",
        services: [],
      },
      relatedProducts: [],
    });
    expect(pageData.product.specifications).toEqual([
      { id: "article-number", label: "Artikelnummer", value: "SW-10001" },
      { id: "category", label: "Kategorie", value: "Sofas" },
      { id: "material", label: "Material", value: "Samt" },
    ]);
  });
});
