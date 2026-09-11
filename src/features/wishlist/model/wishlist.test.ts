import { describe, expect, test } from "bun:test";

import { parseWishlistProductIds } from "@/features/wishlist/model/wishlist";

describe("parseWishlistProductIds", () => {
  test("keeps unique non-empty product identifiers", () => {
    expect(
      parseWishlistProductIds(
        JSON.stringify(["sofa-1", "chair-2", "sofa-1", "", null]),
      ),
    ).toEqual(["sofa-1", "chair-2"]);
  });

  test("returns an empty list for missing or malformed storage data", () => {
    expect(parseWishlistProductIds(null)).toEqual([]);
    expect(parseWishlistProductIds("not-json")).toEqual([]);
    expect(parseWishlistProductIds('{"productId":"sofa-1"}')).toEqual([]);
  });
});
