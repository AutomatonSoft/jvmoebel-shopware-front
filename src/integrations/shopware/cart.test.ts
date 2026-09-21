import { describe, expect, test } from "bun:test";
import type { components } from "@shopware/api-client/store-api-types";

import type { ShopwareClient } from "@/integrations/shopware/client";
import {
  addShopwareProduct,
  mapShopwareCart,
} from "@/integrations/shopware/cart";

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
          payload: {
            options: [
              { group: "Farbe", option: "Schwarz" },
              { group: "Größe", option: "220 × 90 cm" },
              { group: "Farbe", option: "Schwarz" },
            ],
          },
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
        selectedOptions: [
          { label: "Farbe", value: "Schwarz" },
          { label: "Größe", value: "220 × 90 cm" },
        ],
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

  test("reports a rejected product addition from Shopware cart errors", async () => {
    const client = {
      invoke: async () => ({
        data: {
          apiAlias: "cart",
          errors: [
            {
              key: "product-stock-reached-product-id",
              level: 20,
              message: "Der verfügbare Bestand wurde erreicht.",
              messageKey: "product-stock-reached",
            },
          ],
          lineItems: [
            {
              cover: null,
              id: "product-id",
              referencedId: "product-id",
              type: "product",
            },
          ],
          price: { totalPrice: 0 },
        },
      }),
    } as unknown as ShopwareClient;

    await expect(addShopwareProduct(client, "product-id")).resolves.toEqual({
      messages: ["Der verfügbare Bestand wurde erreicht."],
      succeeded: false,
    });
  });

  test("rejects a product addition when the returned cart omits the product", async () => {
    const client = {
      invoke: async () => ({
        data: {
          apiAlias: "cart",
          lineItems: [],
          price: { totalPrice: 0 },
        },
      }),
    } as unknown as ShopwareClient;

    await expect(addShopwareProduct(client, "product-id")).resolves.toEqual({
      messages: [],
      succeeded: false,
    });
  });

  test("confirms a product addition only when the returned cart contains it", async () => {
    const requests: Array<{ operation: string; request: unknown }> = [];
    const client = {
      invoke: async (operation: string, request: unknown) => {
        requests.push({ operation, request });

        return {
          data: {
            apiAlias: "cart",
            lineItems: [
              {
                cover: null,
                id: "product-id",
                referencedId: "product-id",
                type: "product",
              },
            ],
            price: { totalPrice: 799 },
          },
        };
      },
    } as unknown as ShopwareClient;

    await expect(addShopwareProduct(client, "product-id")).resolves.toEqual({
      messages: [],
      succeeded: true,
    });
    expect(requests).toEqual([
      {
        operation: "addLineItem post /checkout/cart/line-item",
        request: {
          body: {
            items: [
              {
                id: "product-id",
                quantity: 1,
                referencedId: "product-id",
                type: "product",
              },
            ],
          },
          fetchOptions: { cache: "no-store" },
        },
      },
    ]);
  });
});
