import { describe, expect, test } from "bun:test";

import {
  findOfferCategory,
  offerCategories,
} from "@/features/offers/model/offer-categories";

describe("offer categories", () => {
  test("provides unique deep-link values", () => {
    expect(
      new Set(offerCategories.map((category) => category.value)).size,
    ).toBe(offerCategories.length);
  });

  test("resolves a known category and ignores an unknown value", () => {
    expect(findOfferCategory("sofas")?.label).toBe("Sofas & Couches");
    expect(findOfferCategory("unknown")).toBeUndefined();
  });
});
