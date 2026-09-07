import { describe, expect, test } from "bun:test";

import { mapShopwareProductSearchResult } from "@/integrations/shopware/mappers/product-search";

describe("mapShopwareProductSearchResult", () => {
  test("normalizes Shopware search data for the storefront", () => {
    const product = {
      calculatedPrice: { unitPrice: 895 },
      categories: [
        {
          id: "chairs",
          name: "Chairs",
          path: "|home|chairs|",
          translated: { name: "Armchairs" },
        },
      ],
      cover: {
        media: {
          alt: "Chair",
          translated: { alt: "Rust lounge chair" },
          url: "https://shop.example.com/media/chair.webp",
        },
      },
      description: "<p>Rust wool</p>",
      id: "chair-id",
      name: "Chair",
      translated: {
        description: "<p>Rust wool · Black oak</p>",
        name: "Nara Chair",
      },
    } as unknown as Parameters<typeof mapShopwareProductSearchResult>[0];

    expect(mapShopwareProductSearchResult(product)).toEqual({
      categoryLabel: "Armchairs",
      description: "Rust wool · Black oak",
      id: "chair-id",
      image: {
        alt: "Rust lounge chair",
        url: "https://shop.example.com/media/chair.webp",
      },
      name: "Nara Chair",
      unitPrice: 895,
      url: "/produkt/chair-id",
    });
  });
});
