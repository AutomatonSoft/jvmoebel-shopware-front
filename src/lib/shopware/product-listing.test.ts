import { describe, expect, test } from "bun:test";

import {
  filterAndSortShopProducts,
  type ShopProduct,
  type ShopProductFilters,
} from "@/lib/shopware/product-listing";

const products = [
  {
    category: "sofas",
    categoryLabel: "Sofas",
    colors: [{ hex: "#ffffff", label: "Cream", value: "cream" }],
    createdAt: "2026-01-01",
    description: "Sofa",
    featuredRank: 1,
    id: "sofa",
    image: { alt: "Sofa", url: "/images/hero-living.webp" },
    material: "Linen",
    name: "Sofa",
    rating: 4.5,
    unitPrice: 2000,
    url: "/product/sofa",
  },
  {
    category: "chairs",
    categoryLabel: "Chairs",
    colors: [{ hex: "#000000", label: "Black", value: "black" }],
    createdAt: "2026-02-01",
    description: "Chair",
    featuredRank: 0,
    id: "chair",
    image: { alt: "Chair", url: "/images/lounge-chair.webp" },
    material: "Velvet",
    name: "Chair",
    rating: 4.9,
    unitPrice: 900,
    url: "/product/chair",
  },
] satisfies ShopProduct[];

const allProductsFilters = {
  categories: [],
  colors: [],
  materials: [],
  maximumPrice: 3000,
  minimumPrice: 0,
} satisfies ShopProductFilters;

describe("shop product listing", () => {
  test("combines filters across groups", () => {
    const filteredProducts = filterAndSortShopProducts(
      products,
      {
        ...allProductsFilters,
        categories: ["sofas"],
        colors: ["cream"],
        materials: ["Linen"],
      },
      "featured",
    );

    expect(filteredProducts.map((product) => product.id)).toEqual(["sofa"]);
  });

  test("applies an inclusive price range", () => {
    const filteredProducts = filterAndSortShopProducts(
      products,
      {
        ...allProductsFilters,
        maximumPrice: 900,
        minimumPrice: 900,
      },
      "featured",
    );

    expect(filteredProducts.map((product) => product.id)).toEqual(["chair"]);
  });

  test("sorts products without mutating the source list", () => {
    const sortedProducts = filterAndSortShopProducts(
      products,
      allProductsFilters,
      "price-ascending",
    );

    expect(sortedProducts.map((product) => product.id)).toEqual([
      "chair",
      "sofa",
    ]);
    expect(products.map((product) => product.id)).toEqual(["sofa", "chair"]);
  });
});
