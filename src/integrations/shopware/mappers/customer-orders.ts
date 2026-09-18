import type { components } from "@shopware/api-client/store-api-types";

import type { CustomerOrderSummary } from "@/features/customer-account/model/account";

type ShopwareOrder = components["schemas"]["Order"];

export function mapShopwareCustomerOrders(
  orders: readonly ShopwareOrder[],
): CustomerOrderSummary[] {
  return orders.map((order) => ({
    currency: order.currency?.isoCode || "EUR",
    date: order.orderDateTime || order.orderDate,
    number: order.orderNumber || order.id,
    status:
      order.stateMachineState.translated?.name ||
      order.stateMachineState.name ||
      "In Bearbeitung",
    total: order.amountTotal ?? order.price.totalPrice,
  }));
}
