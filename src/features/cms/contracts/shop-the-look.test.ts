import { describe, expect, test } from "bun:test";

import { parseCmsShopTheLookData } from "@/features/cms/contracts/shop-the-look";

describe("parseCmsShopTheLookData", () => {
  test("parses and sorts look items", () => {
    const result = parseCmsShopTheLookData({
      image: { url: "/images/hero-editorial.webp" },
      items: {
        chair: {
          hotspot: { x: 28, y: 72 },
          name: "Noma Loungesessel",
          position: 2,
          url: "/product/noma",
        },
        sofa: {
          description: "Modulares Sofa in Rostrot",
          hotspot: { x: 69, y: 63 },
          id: "look-sofa",
          name: "Alba Modulsofa",
          position: 0,
          url: "/product/alba",
        },
      },
      title: "Shop the Look",
      viewAll: { label: "Gesamten Look entdecken", url: "/living" },
    });

    expect(result.data?.items.map((item) => item.id)).toEqual([
      "look-sofa",
      "Noma Loungesessel-0",
    ]);
    expect(result.data?.image.alt).toBe("Shop the Look");
    expect(result.data?.items[0]?.hotspot).toEqual({ x: 69, y: 63 });
    expect(result.data?.viewAll).toEqual({
      label: "Gesamten Look entdecken",
      url: "/living",
    });
    expect(result.issues).toEqual([]);
  });

  test("omits invalid hotspots and incomplete links", () => {
    const result = parseCmsShopTheLookData({
      image: { url: "/images/hero-editorial.webp" },
      items: [
        {
          hotspot: { x: 120, y: 40 },
          name: "Außerhalb des Bildes",
          url: "/invalid",
        },
        {
          hotspot: { x: 50, y: 50 },
          name: "Forma Couchtisch",
          position: Number.NaN,
          url: "/product/forma",
        },
      ],
      title: "Shop the Look",
      viewAll: { label: "Gesamten Look entdecken" },
    });

    expect(result.data?.items).toHaveLength(1);
    expect(result.data?.items[0]?.position).toBe(1);
    expect(result.data?.viewAll).toBeUndefined();
    expect(result.issues.map((issue) => issue.path)).toEqual([
      "items.0",
      "viewAll",
    ]);
  });

  test("rejects content without an image, title or valid items", () => {
    const result = parseCmsShopTheLookData({ items: [] });

    expect(result.data).toBeNull();
    expect(result.issues.map((issue) => issue.path)).toEqual([
      "image.url",
      "items",
      "title",
    ]);
  });
});
