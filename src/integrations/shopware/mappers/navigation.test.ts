import { describe, expect, test } from "bun:test";

import { mapShopwareCategory } from "@/integrations/shopware/mappers/navigation";

describe("mapShopwareCategory", () => {
  test("maps a category without a children array as a leaf item", () => {
    const category = {
      children: undefined,
      id: "footer-category",
      name: "Information",
      translated: {
        name: "Information",
      },
    } as unknown as Parameters<typeof mapShopwareCategory>[0];

    expect(mapShopwareCategory(category)).toEqual({
      childCount: 0,
      children: [],
      href: "/navigation/footer-category",
      id: "footer-category",
      label: "Information",
    });
  });

  test("preserves the visible child count without preloading children", () => {
    const category = {
      children: undefined,
      id: "parent-category",
      name: "Living room",
      translated: {
        name: "Living room",
      },
      visibleChildCount: 3,
    } as unknown as Parameters<typeof mapShopwareCategory>[0];

    expect(mapShopwareCategory(category)).toMatchObject({
      childCount: 3,
      children: [],
    });
  });
});
