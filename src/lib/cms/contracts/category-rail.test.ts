import { describe, expect, test } from "bun:test";

import { parseCmsCategoryRailData } from "@/lib/cms/contracts/category-rail";

describe("parseCmsCategoryRailData", () => {
  test("parses and sorts category items", () => {
    const data = parseCmsCategoryRailData({
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

    expect(data?.categories.map((category) => category.id)).toEqual([
      "sofas",
      "Betten-0",
    ]);
    expect(data?.categories[1]?.image.alt).toBe("Betten");
    expect(data?.viewAll).toEqual({
      label: "Alle Kategorien",
      url: "/shop",
    });
  });

  test("omits invalid categories and incomplete links", () => {
    const data = parseCmsCategoryRailData({
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

    expect(data?.categories).toHaveLength(1);
    expect(data?.categories[0]?.position).toBe(1);
    expect(data?.viewAll).toBeUndefined();
  });

  test("rejects content without a title or valid categories", () => {
    expect(parseCmsCategoryRailData({ categories: [] })).toBeNull();
    expect(
      parseCmsCategoryRailData({
        categories: [],
        title: "Beliebte Kategorien",
      }),
    ).toBeNull();
  });
});
