import type { ShopCart } from "@/features/cart/model/cart";

export type CheckoutAddress = Readonly<{
  additionalAddressLine1?: string;
  city: string;
  countryId: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  street: string;
  zipcode: string;
}>;

export type GuestCheckoutRegistration = Readonly<{
  acceptedDataProtection: true;
  billingAddress: CheckoutAddress;
  email: string;
  shippingAddress?: CheckoutAddress;
}>;

export type CheckoutCustomer = Readonly<{
  addressComplete: boolean;
  countryId?: string;
  email: string;
  firstName: string;
  guest: boolean;
  lastName: string;
}>;

export type CheckoutOption = Readonly<{
  description?: string;
  id: string;
  label: string;
}>;

export type CheckoutOptions = Readonly<{
  countries: readonly CheckoutOption[];
  paymentMethods: readonly CheckoutOption[];
  selectedPaymentMethodId?: string;
  selectedShippingMethodId?: string;
  shippingMethods: readonly CheckoutOption[];
}>;

export type CheckoutPageData = Readonly<{
  cart: ShopCart;
  customer: CheckoutCustomer | null;
  options: CheckoutOptions;
}>;

export type CheckoutActionState = Readonly<{
  message?: string;
  status: "idle" | "invalid" | "error";
}>;

export type CheckoutMethodSelection = Readonly<{
  acceptedTerms: true;
  customerComment?: string;
  paymentMethodId: string;
  shippingMethodId: string;
}>;

export type CheckoutReceipt = Readonly<{
  currency: string;
  guest: boolean;
  orderNumber: string;
  total: number;
}>;
