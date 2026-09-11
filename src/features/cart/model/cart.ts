export type ShopCartItem = Readonly<{
  deliveryLabel?: string;
  id: string;
  image?: Readonly<{
    alt: string;
    url: string;
  }>;
  label: string;
  maxQuantity: number;
  minQuantity: number;
  previousUnitPrice?: number;
  quantity: number;
  quantityStep: number;
  removable: boolean;
  stackable: boolean;
  totalPrice: number;
  unitPrice: number;
  url?: string;
}>;

export type ShopCartAdjustment = Readonly<{
  id: string;
  label: string;
  price: number;
}>;

export type ShopCart = Readonly<{
  adjustments: readonly ShopCartAdjustment[];
  currency: string;
  editable: boolean;
  items: readonly ShopCartItem[];
  locale: string;
  messages: readonly string[];
  shippingCosts: number;
  subtotal: number;
  total: number;
}>;
