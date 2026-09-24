import { describe, expect, test } from "bun:test";

import {
  normalizeShopProductPageRequest,
  type ShopProductPageRequest,
} from "@/features/catalog/model/product-listing-page";

describe("normalizeShopProductPageRequest", () => {
  test("uses the same cache arguments for equivalent filter selections", () => {
    const first: ShopProductPageRequest = {
      categoryIds: ["second", "first"],
      companyIds: ["maker-b", "maker-a"],
      page: 2,
      propertyGroups: {
        size: ["large", "small"],
        color: ["blue", "red"],
      },
      propertyIds: ["large", "blue", "small", "red"],
      sort: "newest",
    };
    const second: ShopProductPageRequest = {
      ...first,
      categoryIds: ["first", "second"],
      companyIds: ["maker-a", "maker-b"],
      propertyGroups: {
        color: ["red", "blue"],
        size: ["small", "large"],
      },
      propertyIds: ["red", "small", "blue", "large"],
    };

    expect(JSON.stringify(normalizeShopProductPageRequest(first))).toBe(
      JSON.stringify(normalizeShopProductPageRequest(second)),
    );
    expect(first.categoryIds).toEqual(["second", "first"]);
    expect(first.propertyGroups.size).toEqual(["large", "small"]);
  });

  test("keeps different filter selections distinct", () => {
    const request: ShopProductPageRequest = {
      categoryIds: ["first"],
      companyIds: [],
      page: 1,
      propertyGroups: {},
      propertyIds: [],
      sort: "featured",
    };

    expect(JSON.stringify(normalizeShopProductPageRequest(request))).not.toBe(
      JSON.stringify(
        normalizeShopProductPageRequest({
          ...request,
          categoryIds: ["second"],
        }),
      ),
    );
  });
});
