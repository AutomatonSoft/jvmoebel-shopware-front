import { describe, expect, test } from "bun:test";

import { parseCmsCategoryRailData } from "@/features/cms/contracts/category-rail";

describe("parseCmsCategoryRailData", () => {
  test("parses and sorts category items", () => {
    const result = parseCmsCategoryRailData({
      categories: {
        beds: {
          image: { url: "/images/bedroom.webp" },
          label: "Betten",
          position: 2,
          url: "/bedroom/beds",
        },
        sofas: {
          id: "sofas",
          image: {
            alt: "Helles Sofa",
            url: "/images/hero-living.webp",
          },
          label: "Sofas",
          position: 0,
          url: "/living/sofas",
        },
      },
      title: "Beliebte Kategorien",
      viewAll: { label: "Alle Kategorien", url: "/shop" },
    });

    expect(result.data?.categories.map((category) => category.id)).toEqual([
      "sofas",
      "Betten-0",
    ]);
    expect(result.data?.categories[1]?.image.alt).toBe("Betten");
    expect(result.data?.viewAll).toEqual({
      label: "Alle Kategorien",
      url: "/shop",
    });
    expect(result.issues).toEqual([]);
  });

  test("omits invalid categories and incomplete links", () => {
    const result = parseCmsCategoryRailData({
      categories: [
        {
          image: {},
          label: "Ohne Bild",
          url: "/invalid",
        },
        {
          image: { url: "/images/lounge-chair.webp" },
          label: "Sessel",
          position: Number.NaN,
          url: "/living/armchairs",
        },
      ],
      title: "Beliebte Kategorien",
      viewAll: { label: "Alle Kategorien" },
    });

    expect(result.data?.categories).toHaveLength(1);
    expect(result.data?.categories[0]?.position).toBe(1);
    expect(result.data?.viewAll).toBeUndefined();
    expect(result.issues.map((issue) => issue.path)).toEqual([
      "categories.0",
      "viewAll",
    ]);
  });

  test("rejects content without a title or valid categories", () => {
    const missingTitle = parseCmsCategoryRailData({ categories: [] });
    const missingCategories = parseCmsCategoryRailData({
      categories: [],
      title: "Beliebte Kategorien",
    });

    expect(missingTitle.data).toBeNull();
    expect(missingTitle.issues.map((issue) => issue.path)).toEqual([
      "categories",
      "title",
    ]);
    expect(missingCategories.data).toBeNull();
    expect(missingCategories.issues.map((issue) => issue.path)).toEqual([
      "categories",
    ]);
  });
});
