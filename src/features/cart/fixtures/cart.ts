import type { ShopCart, ShopCartItem } from "@/features/cart/model/cart";
import { shopProductListingMock } from "@/features/catalog/fixtures/product-listing";

export const initialShopCartMockQuantities: Readonly<Record<string, number>> = {
  [shopProductListingMock.products[0].id]: 1,
  [shopProductListingMock.products[1].id]: 1,
};

function createMockCartItem(
  product: (typeof shopProductListingMock.products)[number],
  quantity: number,
): ShopCartItem {
  return {
    deliveryLabel: "Lieferung in 2–6 Wochen",
    id: product.id,
    image: product.image,
    label: product.name,
    maxQuantity: 10,
    minQuantity: 1,
    previousUnitPrice: product.previousPrice,
    quantity,
    quantityStep: 1,
    removable: true,
    stackable: true,
    totalPrice: product.unitPrice * quantity,
    unitPrice: product.unitPrice,
    url: product.url,
  };
}

export function createShopCartMock(
  quantities: Readonly<Record<string, number>>,
  promotionCode?: string,
): ShopCart {
  const items = shopProductListingMock.products.flatMap((product) => {
    const quantity = quantities[product.id];

    return quantity ? [createMockCartItem(product, quantity)] : [];
  });
  const subtotal = items.reduce((total, item) => total + item.totalPrice, 0);
  const promotionValue = promotionCode ? -Math.min(120, subtotal) : 0;

  return {
    adjustments: promotionCode
      ? [
          {
            id: "mock-promotion",
            label: `Gutschein ${promotionCode}`,
            price: promotionValue,
          },
        ]
      : [],
    currency: shopProductListingMock.currency,
    editable: true,
    items,
    locale: shopProductListingMock.locale,
    messages: [],
    shippingCosts: 0,
    subtotal,
    total: subtotal + promotionValue,
  };
}
