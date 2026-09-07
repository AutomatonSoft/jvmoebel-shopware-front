import { describe, expect, test } from "bun:test";

import {
  filterAndSortShopProducts,
  type ShopProductFilters,
} from "@/features/catalog/model/filter-products";
import type { ShopProduct } from "@/features/catalog/model/product-listing";

const products = [
  {
    attributes: [
      {
        id: "color",
        label: "Colour",
        options: [{ label: "Cream", value: "cream" }],
      },
      {
        id: "material",
        label: "Material",
        options: [{ label: "Linen", value: "linen" }],
      },
      {
        id: "size",
        label: "Size",
        options: [
          { label: "Large", value: "large" },
          { label: "Extra large", value: "extra-large" },
        ],
      },
    ],
    category: "sofas",
    categoryLabel: "Sofas",
    colors: [{ hex: "#ffffff", label: "Cream", value: "cream" }],
    company: "JV Studio",
    createdAt: "2026-01-01",
    description: "Sofa",
    featuredRank: 1,
    id: "sofa",
    image: { alt: "Sofa", url: "/images/hero-living.webp" },
    material: "Linen",
    name: "Sofa",
    rating: 4.5,
    sizes: ["large", "extra-large"],
    unitPrice: 2000,
    url: "/product/sofa",
  },
  {
    attributes: [
      {
        id: "color",
        label: "Colour",
        options: [{ label: "Black", value: "black" }],
      },
      {
        id: "material",
        label: "Material",
        options: [{ label: "Velvet", value: "velvet" }],
      },
      {
        id: "size",
        label: "Size",
        options: [
          { label: "Small", value: "small" },
          { label: "Medium", value: "medium" },
        ],
      },
    ],
    category: "chairs",
    categoryLabel: "Chairs",
    colors: [{ hex: "#000000", label: "Black", value: "black" }],
    company: "Nordic Form",
    createdAt: "2026-02-01",
    description: "Chair",
    featuredRank: 0,
    id: "chair",
    image: { alt: "Chair", url: "/images/lounge-chair.webp" },
    material: "Velvet",
    name: "Chair",
    rating: 4.9,
    sizes: ["small", "medium"],
    unitPrice: 900,
    url: "/product/chair",
  },
] satisfies ShopProduct[];

const allProductsFilters = {
  attributes: {},
  categories: [],
  maximumPrice: 3000,
  minimumPrice: 0,
} satisfies ShopProductFilters;

describe("shop product listing", () => {
  test("combines filters across groups", () => {
    const filteredProducts = filterAndSortShopProducts(
      products,
      {
        ...allProductsFilters,
        attributes: {
          color: ["cream"],
          material: ["linen"],
          size: ["large"],
        },
        categories: ["sofas"],
        companies: ["JV Studio"],
      },
      "featured",
    );

    expect(filteredProducts.map((product) => product.id)).toEqual(["sofa"]);
  });

  test("matches any selected option within an attribute group", () => {
    const filteredProducts = filterAndSortShopProducts(
      products,
      {
        ...allProductsFilters,
        attributes: { size: ["medium", "extra-large"] },
      },
      "featured",
    );

    expect(filteredProducts.map((product) => product.id)).toEqual([
      "chair",
      "sofa",
    ]);
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
