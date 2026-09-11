import "server-only";

import type { components } from "@shopware/api-client/store-api-types";

import type { ShopCart } from "@/features/cart/model/cart";
import type { ShopwareClient } from "@/integrations/shopware/client";
import { getShopwareContext } from "@/integrations/shopware/context";

type ShopwareCart = components["schemas"]["Cart"];

function getCartMessages(errors: ShopwareCart["errors"]) {
  if (!errors) {
    return [];
  }

  const entries = Array.isArray(errors) ? errors : Object.values(errors);

  return entries.map((error) => error.message).filter(Boolean);
}

function getDeliveryLabel(
  deliveryInformation:
    components["schemas"]["CartDeliveryInformation"] | undefined,
) {
  const deliveryTime = deliveryInformation?.deliveryTime;

  if (!deliveryTime?.min || !deliveryTime.max || !deliveryTime.unit) {
    return undefined;
  }

  return `Lieferung in ${deliveryTime.min}–${deliveryTime.max} ${deliveryTime.unit}`;
}

export function mapShopwareCart(
  cart: ShopwareCart,
  currency: string,
  locale: string,
): ShopCart {
  const lineItems = cart.lineItems ?? [];

  return {
    adjustments: lineItems.flatMap((lineItem) =>
      lineItem.type !== "product" && lineItem.price
        ? [
            {
              id: lineItem.id,
              label: lineItem.label || "Preisvorteil",
              price: lineItem.price.totalPrice,
            },
          ]
        : [],
    ),
    currency,
    editable: true,
    items: lineItems.flatMap((lineItem) => {
      if (lineItem.type !== "product" || !lineItem.price) {
        return [];
      }

      const quantity = lineItem.quantity ?? lineItem.price.quantity;
      const quantityInformation = lineItem.quantityInformation;
      const referencedId = lineItem.referencedId;

      return [
        {
          deliveryLabel: getDeliveryLabel(lineItem.deliveryInformation),
          id: lineItem.id,
          image: lineItem.cover?.url
            ? {
                alt: lineItem.label || "Produktbild",
                url: lineItem.cover.url,
              }
            : undefined,
          label: lineItem.label || "Produkt",
          maxQuantity: quantityInformation?.maxPurchase ?? 100,
          minQuantity: quantityInformation?.minPurchase ?? 1,
          previousUnitPrice: lineItem.price.listPrice?.price,
          quantity,
          quantityStep: quantityInformation?.purchaseSteps ?? 1,
          removable: lineItem.removable ?? true,
          stackable: lineItem.stackable ?? false,
          totalPrice: lineItem.price.totalPrice,
          unitPrice: lineItem.price.unitPrice,
          url: referencedId ? `/produkt/${referencedId}` : undefined,
        },
      ];
    }),
    locale,
    messages: getCartMessages(cart.errors),
    shippingCosts: (cart.deliveries ?? []).reduce(
      (total, delivery) => total + (delivery.shippingCosts?.totalPrice ?? 0),
      0,
    ),
    subtotal: lineItems.reduce(
      (total, lineItem) =>
        lineItem.type === "product"
          ? total + (lineItem.price?.totalPrice ?? 0)
          : total,
      0,
    ),
    total: cart.price.totalPrice,
  };
}

export async function getShopwareCart(
  client: ShopwareClient,
): Promise<ShopCart> {
  const [context, response] = await Promise.all([
    getShopwareContext(client),
    client.invoke("readCart get /checkout/cart", {
      fetchOptions: { cache: "no-store" },
    }),
  ]);

  return mapShopwareCart(
    response.data,
    context.currency?.isoCode || "EUR",
    context.languageInfo.localeCode || "de-DE",
  );
}

export async function updateShopwareCartItem(
  client: ShopwareClient,
  id: string,
  quantity: number,
) {
  await client.invoke("updateLineItem patch /checkout/cart/line-item", {
    body: { items: [{ id, quantity }] },
    fetchOptions: { cache: "no-store" },
  });
}

export async function removeShopwareCartItem(
  client: ShopwareClient,
  id: string,
) {
  await client.invoke("removeLineItem post /checkout/cart/line-item/delete", {
    body: { ids: [id] },
    fetchOptions: { cache: "no-store" },
  });
}

export async function addShopwarePromotion(
  client: ShopwareClient,
  code: string,
) {
  await client.invoke("addLineItem post /checkout/cart/line-item", {
    body: { items: [{ referencedId: code, type: "promotion" }] },
    fetchOptions: { cache: "no-store" },
  });
}

export async function addShopwareProduct(
  client: ShopwareClient,
  productId: string,
) {
  await client.invoke("addLineItem post /checkout/cart/line-item", {
    body: {
      items: [
        {
          id: productId,
          quantity: 1,
          referencedId: productId,
          type: "product",
        },
      ],
    },
    fetchOptions: { cache: "no-store" },
  });
}
