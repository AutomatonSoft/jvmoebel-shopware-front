import { describe, expect, test } from "bun:test";
import type { components } from "@shopware/api-client/store-api-types";

import { mapShopwareCustomerOrders } from "@/integrations/shopware/mappers/customer-orders";

type ShopwareOrder = components["schemas"]["Order"];

describe("mapShopwareCustomerOrders", () => {
  test("maps the data displayed in the account dashboard", () => {
    const orders = [
      {
        amountTotal: 1299,
        currency: { isoCode: "EUR" },
        id: "order-id",
        orderDate: "2026-09-01",
        orderDateTime: "2026-09-01T12:00:00.000Z",
        orderNumber: "10042",
        price: { totalPrice: 1299 },
        stateMachineState: {
          name: "Open",
          translated: { name: "Offen" },
        },
      },
    ] as ShopwareOrder[];

    expect(mapShopwareCustomerOrders(orders)).toEqual([
      {
        currency: "EUR",
        date: "2026-09-01T12:00:00.000Z",
        number: "10042",
        status: "Offen",
        total: 1299,
      },
    ]);
  });

  test("uses safe fallbacks for optional order fields", () => {
    const order = {
      id: "order-id",
      orderDate: "2026-09-01",
      orderDateTime: "2026-09-01T12:00:00.000Z",
      price: { totalPrice: 99 },
      stateMachineState: { name: "Open" },
    } as ShopwareOrder;

    expect(mapShopwareCustomerOrders([order])).toEqual([
      {
        currency: "EUR",
        date: "2026-09-01T12:00:00.000Z",
        number: "order-id",
        status: "Open",
        total: 99,
      },
    ]);
  });
});
