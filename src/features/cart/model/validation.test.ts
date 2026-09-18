import { describe, expect, test } from "bun:test";

import {
  parseCartItemRemoval,
  parseCartItemUpdate,
  parseProductId,
  parsePromotionCode,
} from "@/features/cart/model/validation";

describe("cart validation", () => {
  test("normalizes an item update and requires a positive safe integer", () => {
    const formData = new FormData();

    formData.set("id", " line-item-id ");
    formData.set("quantity", "2");
    expect(parseCartItemUpdate(formData)).toEqual({
      id: "line-item-id",
      quantity: 2,
    });

    formData.set("quantity", "1.5");
    expect(parseCartItemUpdate(formData)).toBeNull();
  });

  test("requires non-empty identifiers for cart mutations", () => {
    const formData = new FormData();

    formData.set("id", " item-id ");
    formData.set("code", " promo-code ");
    formData.set("productId", " product-id ");
    expect(parseCartItemRemoval(formData)).toBe("item-id");
    expect(parsePromotionCode(formData)).toBe("promo-code");
    expect(parseProductId(formData)).toBe("product-id");

    formData.set("code", " ");
    expect(parsePromotionCode(formData)).toBeNull();
  });
});
