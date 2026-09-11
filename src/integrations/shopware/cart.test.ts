import { describe, expect, test } from "bun:test";
import type { components } from "@shopware/api-client/store-api-types";

import { mapShopwareCart } from "@/integrations/shopware/cart";

type Cart = components["schemas"]["Cart"];

describe("mapShopwareCart", () => {
  test("separates products, discounts, shipping and the final total", () => {
    const cart = {
      apiAlias: "cart",
      deliveries: [{ shippingCosts: { totalPrice: 39 } }],
      errors: [
        {
          key: "promotion-not-found",
          level: 10,
          message: "Der Gutscheincode ist ungültig.",
          messageKey: "promotion-not-found",
        },
      ],
      lineItems: [
        {
          id: "product-line-item",
          label: "Sofa Oxford",
          price: { quantity: 2, totalPrice: 2400, unitPrice: 1200 },
          quantity: 2,
          referencedId: "product-id",
          type: "product",
        },
        {
          id: "promotion-line-item",
          label: "Aktion",
          price: { quantity: 1, totalPrice: -200, unitPrice: -200 },
          type: "promotion",
        },
      ],
      price: { totalPrice: 2239 },
    } as Cart;

    const result = mapShopwareCart(cart, "EUR", "de-DE");

    expect(result.items).toEqual([
      expect.objectContaining({
        id: "product-line-item",
        quantity: 2,
        totalPrice: 2400,
        unitPrice: 1200,
        url: "/produkt/product-id",
      }),
    ]);
    expect(result.adjustments).toEqual([
      { id: "promotion-line-item", label: "Aktion", price: -200 },
    ]);
    expect(result.subtotal).toBe(2400);
    expect(result.shippingCosts).toBe(39);
    expect(result.total).toBe(2239);
    expect(result.messages).toEqual(["Der Gutscheincode ist ungültig."]);
  });
});
