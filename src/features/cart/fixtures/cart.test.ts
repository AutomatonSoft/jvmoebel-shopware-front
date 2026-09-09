import { describe, expect, test } from "bun:test";

import { createShopCartMock } from "@/features/cart/fixtures/cart";
import { shopProductListingMock } from "@/features/catalog/fixtures/product-listing";

describe("createShopCartMock", () => {
  test("recalculates quantities and applies a mock promotion", () => {
    const product = shopProductListingMock.products[0];
    const cart = createShopCartMock({ [product.id]: 3 }, "WOHNEN");

    expect(cart.editable).toBe(true);
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0]?.quantity).toBe(3);
    expect(cart.subtotal).toBe(product.unitPrice * 3);
    expect(cart.adjustments[0]?.price).toBe(-120);
    expect(cart.total).toBe(product.unitPrice * 3 - 120);
  });
});
