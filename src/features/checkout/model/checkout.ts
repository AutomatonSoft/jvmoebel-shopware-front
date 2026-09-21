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

export type CheckoutDisplayAddress = CheckoutAddress &
  Readonly<{ country?: string }>;

export type CheckoutSelectableAddress = CheckoutDisplayAddress &
  Readonly<{ id: string }>;

export type GuestCheckoutRegistration = Readonly<{
  acceptedDataProtection: true;
  billingAddress: CheckoutAddress;
  email: string;
  shippingAddress?: CheckoutAddress;
}>;

export type CheckoutCustomer = Readonly<{
  activeShippingAddressId?: string;
  addressComplete: boolean;
  billingAddress?: CheckoutAddress;
  countryId?: string;
  email: string;
  firstName: string;
  guest: boolean;
  lastName: string;
  shippingAddress?: CheckoutDisplayAddress;
  shippingAddresses: readonly CheckoutSelectableAddress[];
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
  selection: CheckoutMethodSelection | null;
}>;

export type CheckoutActionState = Readonly<{
  fieldErrors?: Readonly<Partial<Record<string, string>>>;
  message?: string;
  status: "idle" | "invalid" | "error";
}>;

export type CheckoutMethodSelection = Readonly<{
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
