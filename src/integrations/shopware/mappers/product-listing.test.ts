import { describe, expect, test } from "bun:test";
import type { components } from "@shopware/api-client/store-api-types";

import { mapShopwareProductListing } from "@/integrations/shopware/mappers/product-listing";

type ShopwareProduct = components["schemas"]["Product"];

describe("mapShopwareProductListing", () => {
  test("normalizes Store API products for the local shop layout", () => {
    const product = {
      calculatedPrice: {
        listPrice: { price: 1299 },
        unitPrice: 999,
      },
      categories: [
        {
          id: "living-room",
          name: "Wohnzimmer",
          path: "|root|",
          translated: { name: "Wohnzimmer" },
        },
        {
          id: "sofas",
          name: "Sofas",
          path: "|root|living-room|",
          translated: { name: "Sofas" },
        },
      ],
      cover: {
        media: {
          alt: "Beiges Sofa",
          translated: { alt: "Beiges Sofa" },
          url: "https://shop.example.com/media/sofa.webp",
        },
      },
      createdAt: "2026-08-01T10:00:00.000Z",
      description: "<p>Ein bequemes Sofa.</p>",
      id: "product-id",
      manufacturer: {
        name: "JV Möbel",
        translated: { name: "JV Möbel" },
      },
      markAsTopseller: true,
      name: "Sofa Alba",
      properties: [
        {
          colorHexCode: "#ded6c8",
          group: {
            id: "color-group",
            name: "Farbe",
            translated: { name: "Farbe" },
          },
          groupId: "color-group",
          id: "beige",
          name: "Beige",
          translated: { colorHexCode: "#ded6c8", name: "Beige" },
        },
        {
          group: {
            id: "material-group",
            name: "Material",
            translated: { name: "Material" },
          },
          groupId: "material-group",
          id: "velvet",
          name: "Samt",
          translated: { name: "Samt" },
        },
        {
          group: {
            id: "size-group",
            name: "Größe",
            translated: { name: "Größe" },
          },
          groupId: "size-group",
          id: "large",
          name: "Groß",
          translated: { name: "Groß" },
        },
      ],
      ratingAverage: 4.8,
      translated: {
        description: "<p>Ein bequemes Sofa.</p>",
        name: "Sofa Alba",
      },
    } as ShopwareProduct;

    const listing = mapShopwareProductListing({
      currency: "EUR",
      locale: "de-DE",
      products: [product],
    });

    expect(listing?.products[0]).toMatchObject({
      attributes: [
        {
          id: "color-group",
          label: "Farbe",
          options: [{ hex: "#ded6c8", label: "Beige", value: "beige" }],
        },
        {
          id: "material-group",
          label: "Material",
          options: [{ label: "Samt", value: "velvet" }],
        },
        {
          id: "size-group",
          label: "Größe",
          options: [{ label: "Groß", value: "large" }],
        },
      ],
      badge: "Bestseller",
      category: "sofas",
      categoryLabel: "Sofas",
      colors: [{ hex: "#ded6c8", label: "Beige", value: "beige" }],
      company: "JV Möbel",
      description: "Ein bequemes Sofa.",
      image: {
        alt: "Beiges Sofa",
        url: "https://shop.example.com/media/sofa.webp",
      },
      material: "Samt",
      name: "Sofa Alba",
      previousPrice: 1299,
      rating: 4.8,
      sizes: ["large"],
      unitPrice: 999,
      url: "/produkt/product-id",
    });
  });

  test("returns null for an empty Shopware catalog", () => {
    expect(
      mapShopwareProductListing({
        currency: "EUR",
        locale: "de-DE",
        products: [],
      }),
    ).toBeNull();
  });
});
