import "server-only";

import { cookies } from "next/headers";

import type {
  CheckoutCustomer,
  CheckoutMethodSelection,
  CheckoutOptions,
  CheckoutReceipt,
  CheckoutSelectableAddress,
  GuestCheckoutRegistration,
} from "@/features/checkout/model/checkout";

const mockCheckoutCustomerCookie = "jv-mock-checkout-customer";

type MockCheckoutCustomer = CheckoutCustomer &
  Readonly<{ registration: GuestCheckoutRegistration }>;

function createMockSelectableAddress(
  address: GuestCheckoutRegistration["billingAddress"],
  id: string,
): CheckoutSelectableAddress {
  return { ...address, id };
}

export const mockCheckoutOptions: CheckoutOptions = {
  countries: [{ id: "mock-country-de", label: "Deutschland" }],
  paymentMethods: [
    {
      description: "Sie bezahlen bequem bei der Lieferung.",
      id: "mock-payment-cash",
      label: "Nachnahme",
    },
  ],
  selectedPaymentMethodId: "mock-payment-cash",
  selectedShippingMethodId: "mock-shipping-standard",
  shippingMethods: [
    {
      description: "Lieferung bis zum vereinbarten Ablageort.",
      id: "mock-shipping-standard",
      label: "Standardlieferung",
    },
  ],
};

function parseMockCustomer(value?: string): MockCheckoutCustomer | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as MockCheckoutCustomer;

    return parsed.email && parsed.firstName && parsed.lastName
      ? { ...parsed, addressComplete: parsed.addressComplete ?? true }
      : null;
  } catch {
    return null;
  }
}

async function persistMockCustomer(customer: MockCheckoutCustomer) {
  const cookieStore = await cookies();

  cookieStore.set(mockCheckoutCustomerCookie, JSON.stringify(customer), {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "lax",
  });
}

export async function getMockCheckoutCustomer() {
  const cookieStore = await cookies();
  const customer = parseMockCustomer(
    cookieStore.get(mockCheckoutCustomerCookie)?.value,
  );

  return customer
    ? {
        ...customer,
        billingAddress:
          customer.billingAddress ?? customer.registration.billingAddress,
        shippingAddress:
          customer.shippingAddress ??
          customer.registration.shippingAddress ??
          customer.registration.billingAddress,
        shippingAddresses:
          customer.shippingAddresses?.length > 0
            ? customer.shippingAddresses
            : [
                createMockSelectableAddress(
                  customer.shippingAddress ??
                    customer.registration.shippingAddress ??
                    customer.registration.billingAddress,
                  "mock-shipping-address",
                ),
              ],
      }
    : null;
}

export async function registerMockCheckoutGuest(
  registration: GuestCheckoutRegistration,
) {
  await persistMockCustomer({
    addressComplete: true,
    billingAddress: registration.billingAddress,
    email: registration.email,
    firstName: registration.billingAddress.firstName,
    guest: true,
    lastName: registration.billingAddress.lastName,
    registration,
    shippingAddress:
      registration.shippingAddress ?? registration.billingAddress,
    shippingAddresses: [
      createMockSelectableAddress(
        registration.shippingAddress ?? registration.billingAddress,
        "mock-shipping-address",
      ),
    ],
  });
}

export async function addMockCheckoutDeliveryAddress(
  address: GuestCheckoutRegistration["billingAddress"],
) {
  const customer = await getMockCheckoutCustomer();

  if (!customer || customer.guest) {
    throw new Error("The customer has no editable delivery address.");
  }

  const newAddress = createMockSelectableAddress(
    address,
    `mock-shipping-address-${crypto.randomUUID()}`,
  );

  await persistMockCustomer({
    ...customer,
    shippingAddress: newAddress,
    shippingAddresses: [newAddress, ...customer.shippingAddresses],
  });
}

export async function selectMockCheckoutDeliveryAddress(addressId: string) {
  const customer = await getMockCheckoutCustomer();
  const address = customer?.shippingAddresses.find(
    (candidate) => candidate.id === addressId,
  );

  if (!customer || customer.guest || !address) {
    throw new Error("The delivery address is not available to this customer.");
  }

  await persistMockCustomer({ ...customer, shippingAddress: address });
}

export function createMockCheckoutReceipt(
  selection: CheckoutMethodSelection,
  total: number,
  currency: string,
): CheckoutReceipt {
  if (
    !mockCheckoutOptions.paymentMethods.some(
      (method) => method.id === selection.paymentMethodId,
    ) ||
    !mockCheckoutOptions.shippingMethods.some(
      (method) => method.id === selection.shippingMethodId,
    )
  ) {
    throw new Error("Unknown mock checkout method.");
  }

  return {
    currency,
    guest: true,
    orderNumber: `JV-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
    total,
  };
}

export async function convertMockCheckoutGuest() {
  const customer = await getMockCheckoutCustomer();

  if (!customer) {
    throw new Error("Mock checkout customer is missing.");
  }

  await persistMockCustomer({ ...customer, guest: false });
}
