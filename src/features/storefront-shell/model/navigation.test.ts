import { describe, expect, test } from "bun:test";

import {
  isShopwareCategoryId,
  shouldLoadNavigationChildren,
  type StoreNavigationItem,
} from "@/features/storefront-shell/model/navigation";

function createItem(
  overrides: Partial<StoreNavigationItem> = {},
): StoreNavigationItem {
  return {
    children: [],
    href: "/category",
    id: "0123456789abcdef0123456789abcdef",
    label: "Category",
    ...overrides,
  };
}

describe("category navigation", () => {
  test("recognizes Shopware category IDs", () => {
    expect(isShopwareCategoryId("0123456789abcdef0123456789abcdef")).toBe(true);
    expect(isShopwareCategoryId("category-slug")).toBe(false);
  });

  test("loads children when the Storefront contract omits childCount", () => {
    expect(shouldLoadNavigationChildren(createItem())).toBe(true);
  });

  test("keeps known leaves and external links navigable", () => {
    expect(shouldLoadNavigationChildren(createItem({ childCount: 0 }))).toBe(
      false,
    );
    expect(shouldLoadNavigationChildren(createItem({ type: "link" }))).toBe(
      false,
    );
    expect(
      shouldLoadNavigationChildren(
        createItem({ href: "https://example.com/category" }),
      ),
    ).toBe(false);
  });
});
