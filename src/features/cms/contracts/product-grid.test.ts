import { describe, expect, test } from "bun:test";

import { parseCmsProductGridData } from "@/features/cms/contracts/product-grid";

describe("parseCmsProductGridData", () => {
  test("parses and sorts products from an object", () => {
    const data = parseCmsProductGridData({
      currency: "EUR",
      locale: "de-DE",
      products: {
        chair: {
          calculatedPrice: { unitPrice: 895 },
          cover: { media: { url: "/images/chair.webp" } },
          id: "chair",
          name: "Chair",
          position: 2,
          url: "/product/chair",
        },
        sofa: {
          badge: "Sale",
          calculatedPrice: {
            listPrice: { price: 2890 },
            unitPrice: 2490,
          },
          cover: {
            media: {
              alt: "Modular sofa",
              url: "/images/sofa.webp",
            },
          },
          id: "sofa",
          position: 0,
          ratingAverage: 4.9,
          reviewCount: 128,
          translated: {
            description: "Natural boucle",
            name: "Modular Sofa",
          },
          url: "/product/sofa",
        },
      },
      title: "Featured products",
      viewAll: { label: "View all", url: "/shop" },
    });

    expect(data.data?.products.map((product) => product.id)).toEqual([
      "sofa",
      "chair",
    ]);
    expect(data.data?.products[0]).toEqual({
      badge: "Sale",
      description: "Natural boucle",
      id: "sofa",
      image: {
        alt: "Modular sofa",
        url: "/images/sofa.webp",
      },
      name: "Modular Sofa",
      position: 0,
      previousPrice: 2890,
      rating: 4.9,
      reviewCount: 128,
      unitPrice: 2490,
      url: "/product/sofa",
    });
    expect(data.data?.viewAll).toEqual({
      label: "View all",
      url: "/shop",
    });
    expect(data.issues).toEqual([]);
  });

  test("omits invalid products and incomplete links", () => {
    const data = parseCmsProductGridData({
      currency: "EUR",
      locale: "de-DE",
      products: [
        {
          calculatedPrice: {},
          cover: { media: { url: "/images/invalid.webp" } },
          id: "invalid",
          name: "Invalid product",
          url: "/invalid",
        },
        {
          calculatedPrice: { unitPrice: 100 },
          cover: { media: { url: "/images/valid.webp" } },
          id: "valid",
          name: "Valid product",
          position: Number.NaN,
          url: "/valid",
        },
      ],
      title: "Products",
      viewAll: { label: "Missing URL" },
    });

    expect(data.data?.products).toHaveLength(1);
    expect(data.data?.products[0]?.position).toBe(1);
    expect(data.data?.viewAll).toBeUndefined();
    expect(data.issues.map((issue) => issue.path)).toEqual([
      "products.0",
      "viewAll",
    ]);
  });

  test("rejects a grid without metadata or valid products", () => {
    expect(parseCmsProductGridData({ products: [] }).data).toBeNull();
    expect(
      parseCmsProductGridData({
        currency: "EUR",
        locale: "de-DE",
        products: [],
        title: "Products",
      }).data,
    ).toBeNull();
  });
});
