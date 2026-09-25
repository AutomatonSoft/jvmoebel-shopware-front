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
          thumbnails: [
            {
              height: 800,
              url: "https://shop.example.com/media/front-800.webp",
              width: 800,
            },
          ],
          translated: { alt: "Sofa Vorderansicht" },
          url: "https://shop.example.com/media/front.webp",
        },
      },
      deliveryTime: { max: 6, min: 2, unit: "week" },
      description: "<p>Ausführliche Produktbeschreibung.</p>",
      ean: "4260123456789",
      id: "product-id",
      manufacturer: {
        name: "JV Moebel",
        translated: { name: "JV Moebel" },
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
        dimensions: [
          { id: "width", label: "Breite", value: "220 cm" },
          { id: "height", label: "Höhe", value: "82 cm" },
          { id: "depth", label: "Tiefe", value: "95 cm" },
        ],
        gallery: [
          { url: "https://shop.example.com/media/front.webp" },
          { url: "https://shop.example.com/media/detail.webp" },
        ],
        isAvailable: true,
        longDescription: "Ausführliche Produktbeschreibung.",
        longDescriptionHtml: "<p>Ausführliche Produktbeschreibung.</p>",
        services: [],
        shippingFree: true,
      },
      relatedProducts: [],
    });
    expect(pageData.product.specifications).toEqual([
      { id: "article-number", label: "Artikelnummer", value: "SW-10001" },
      { id: "ean", label: "EAN", value: "4260123456789" },
      { id: "manufacturer", label: "Hersteller", value: "JV Moebel" },
      { id: "category", label: "Kategorie", value: "Sofas" },
      { id: "purchase-unit", label: "Verkaufseinheit", value: "1 Stück" },
      { id: "weight", label: "Gewicht", value: "42 kg" },
      { id: "material", label: "Material", value: "Samt" },
    ]);
  });

  test("uses imported dimension properties when native measurements are empty", () => {
    const product = {
      calculatedPrice: { listPrice: null, unitPrice: 999 },
      id: "imported-product-id",
      name: "Importiertes Sofa",
      productNumber: "IMPORT-10001",
      properties: [
        {
          group: { id: "width", name: "Breite" },
          groupId: "width",
          id: "width-258",
          name: "258",
          translated: { name: "258" },
        },
        {
          group: { id: "height", name: "Höhe" },
          groupId: "height",
          id: "height-95",
          name: "95",
          translated: { name: "95" },
        },
        {
          group: { id: "depth", name: "Tiefe" },
          groupId: "depth",
          id: "depth-182-5",
          name: "182,5",
          translated: { name: "182,5" },
        },
        {
          group: { id: "length", name: "Länge" },
          groupId: "length",
          id: "length-240",
          name: "240",
          translated: { name: "240" },
        },
      ],
      translated: { description: "", name: "Importiertes Sofa" },
    } as ShopwareProduct;

    const pageData = mapShopwareProductDetail({
      currency: "EUR",
      locale: "de-DE",
      product,
    });

    expect(pageData.product.dimensions).toEqual([
      { id: "width", label: "Breite", value: "258 cm" },
      { id: "height", label: "Höhe", value: "95 cm" },
      { id: "depth", label: "Tiefe", value: "182,5 cm" },
    ]);
  });

  test("does not derive product specifications from the description", () => {
    const product = {
      calculatedPrice: { listPrice: null, unitPrice: 2999 },
      description: "<p>EAN: 4260174429632</p><p>Höhe: 90 cm</p>",
      ean: null,
      id: "product-with-description-data",
      name: "Ecksofa",
      productNumber: "SOFA-1",
      translated: {
        description: "<p>EAN: 4260174429632</p><p>Höhe: 90 cm</p>",
        name: "Ecksofa",
      },
    } as unknown as ShopwareProduct;

    const pageData = mapShopwareProductDetail({
      currency: "EUR",
      locale: "de-DE",
      product,
    });

    expect(pageData.product.dimensions).toEqual([]);
    expect(pageData.product.specifications).not.toContainEqual(
      expect.objectContaining({ label: "EAN" }),
    );
    expect(pageData.product.longDescription).toBe(
      "EAN: 4260174429632 Höhe: 90 cm",
    );
    expect(pageData.product.longDescriptionHtml).toBe(
      "<p>EAN: 4260174429632</p><p>Höhe: 90 cm</p>",
    );
  });

  test("maps selectable numeric dimensions from the Shopware configurator", () => {
    const product = {
      calculatedPrice: { listPrice: null, unitPrice: 999 },
      id: "variant-180",
      name: "Variables Sofa",
      optionIds: ["black", "width-180"],
      parentId: "parent-product-id",
      productNumber: "VARIANT-180",
      translated: { description: "", name: "Variables Sofa" },
    } as ShopwareProduct;

    const pageData = mapShopwareProductDetail({
      configurator: [
        {
          id: "width-group",
          name: "Breite",
          options: [
            {
              combinable: true,
              groupId: "width-group",
              id: "width-220",
              name: "220",
              translated: { name: "220" },
            },
            {
              combinable: true,
              groupId: "width-group",
              id: "width-180",
              name: "180",
              translated: { name: "180" },
            },
          ],
          translated: { name: "Breite" },
        },
        {
          id: "color-group",
          name: "Farbe",
          options: [
            {
              colorHexCode: "#111111",
              groupId: "color-group",
              id: "black",
              name: "Schwarz",
              translated: { colorHexCode: null, name: "Schwarz" },
            },
            {
              colorHexCode: "#f5f5f5",
              groupId: "color-group",
              id: "white",
              name: "Weiß",
              translated: { colorHexCode: null, name: "Weiß" },
            },
          ],
          translated: { name: "Farbe" },
        },
      ] as components["schemas"]["PropertyGroup"][],
      currency: "EUR",
      locale: "de-DE",
      product,
    });

    expect(pageData.product).toMatchObject({
      colorVariantGroups: [
        {
          id: "color-group",
          label: "Farbe",
          options: [
            {
              available: true,
              hex: "#111111",
              id: "black",
              label: "Schwarz",
              selected: true,
              selection: ["width-180", "black"],
            },
            {
              available: true,
              hex: "#f5f5f5",
              id: "white",
              label: "Weiß",
              selected: false,
              selection: ["width-180", "white"],
            },
          ],
        },
      ],
      sizeVariantGroups: [
        {
          id: "width-group",
          label: "Breite",
          options: [
            {
              available: true,
              id: "width-180",
              label: "180 cm",
              selected: true,
              selection: ["black", "width-180"],
            },
            {
              available: true,
              id: "width-220",
              label: "220 cm",
              selected: false,
              selection: ["black", "width-220"],
            },
          ],
        },
      ],
      variantParentId: "parent-product-id",
    });
  });
});
