import { describe, expect, test } from "bun:test";

import { buildShopProductFilterOptions } from "@/features/catalog/model/filter-options";
import type { ShopProduct } from "@/features/catalog/model/product-listing";

function createProduct(
  overrides: Partial<ShopProduct> & Pick<ShopProduct, "id">,
): ShopProduct {
  return {
    attributes: [
      {
        id: "color",
        label: "Colour",
        options: [{ hex: "#ded6c8", label: "Cream", value: "cream" }],
      },
      {
        id: "material",
        label: "Material",
        options: [{ label: "Linen", value: "linen" }],
      },
    ],
    category: "sofas",
    categoryLabel: "Sofas",
    colors: [{ hex: "#ded6c8", label: "Cream", value: "cream" }],
    company: "JV Studio",
    createdAt: "2026-01-01",
    description: "Product description",
    featuredRank: 0,
    image: { alt: "Product", url: "/images/hero-living.webp" },
    material: "Linen",
    name: "Product",
    sizes: ["large"],
    unitPrice: 1000,
    url: `/product/${overrides.id}`,
    ...overrides,
  };
}

describe("shop catalog filter options", () => {
  test("preserves option order and counts matching products", () => {
    const products = [
      createProduct({ id: "sofa" }),
      createProduct({
        attributes: [
          {
            id: "color",
            label: "Colour",
            options: [
              { hex: "#ded6c8", label: "Cream", value: "cream" },
              {
                hex: "#292a29",
                label: "Charcoal",
                value: "charcoal",
              },
            ],
          },
          {
            id: "material",
            label: "Material",
            options: [{ label: "Wool", value: "wool" }],
          },
        ],
        category: "chairs",
        categoryLabel: "Chairs",
        colors: [
          { hex: "#ded6c8", label: "Cream", value: "cream" },
          { hex: "#292a29", label: "Charcoal", value: "charcoal" },
        ],
        company: "Noma Living",
        id: "chair",
        material: "Wool",
        sizes: ["small", "large"],
      }),
    ];

    expect(buildShopProductFilterOptions(products)).toEqual({
      attributeGroups: [
        {
          id: "color",
          label: "Colour",
          options: [
            { count: 2, hex: "#ded6c8", label: "Cream", value: "cream" },
            {
              count: 1,
              hex: "#292a29",
              label: "Charcoal",
              value: "charcoal",
            },
          ],
        },
        {
          id: "material",
          label: "Material",
          options: [
            { count: 1, label: "Linen", value: "linen" },
            { count: 1, label: "Wool", value: "wool" },
          ],
        },
      ],
      categories: [
        { count: 1, label: "Sofas", value: "sofas" },
        { count: 1, label: "Chairs", value: "chairs" },
      ],
      companies: [
        { count: 1, label: "JV Studio", value: "JV Studio" },
        { count: 1, label: "Noma Living", value: "Noma Living" },
      ],
    });
  });
});
