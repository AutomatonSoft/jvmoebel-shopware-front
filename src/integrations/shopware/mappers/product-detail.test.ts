import { describe, expect, test } from "bun:test";
import type { components } from "@shopware/api-client/store-api-types";

import { mapShopwareProductDetail } from "@/integrations/shopware/mappers/product-detail";

type ShopwareProduct = components["schemas"]["Product"];

describe("mapShopwareProductDetail", () => {
  test("normalizes a Store API product without CMS data", () => {
    const product = {
      available: true,
      availableStock: 7,
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
      ean: "4260123456789",
      id: "product-id",
      manufacturer: {
        name: "JV Möbel",
        translated: { name: "JV Möbel" },
      },
      measurements: {
        height: { unit: "cm", value: 82 },
        length: { unit: "cm", value: 95 },
        weight: { unit: "kg", value: 42 },
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
      purchaseUnit: 1,
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
      shippingFree: true,
      unit: {
        name: "Stück",
        shortCode: "Stück",
        translated: { name: "Stück", shortCode: "Stück" },
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
        isAvailable: true,
        longDescription: "Ausführliche Produktbeschreibung.",
        services: [],
        shippingFree: true,
      },
      relatedProducts: [],
    });
    expect(pageData.product.specifications).toEqual([
      { id: "article-number", label: "Artikelnummer", value: "SW-10001" },
      { id: "ean", label: "EAN", value: "4260123456789" },
      { id: "manufacturer", label: "Hersteller", value: "JV Möbel" },
      { id: "category", label: "Kategorie", value: "Sofas" },
      { id: "purchase-unit", label: "Verkaufseinheit", value: "1 Stück" },
      { id: "weight", label: "Gewicht", value: "42 kg" },
      {
        id: "available-stock",
        label: "Verfügbarer Bestand",
        value: "7 Stück",
      },
      { id: "material", label: "Material", value: "Samt" },
    ]);
  });
});
