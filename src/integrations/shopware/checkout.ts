import "server-only";

import type { components } from "@shopware/api-client/store-api-types";

import type {
  CheckoutCustomer,
  CheckoutDisplayAddress,
  CheckoutMethodSelection,
  CheckoutOptions,
  CheckoutReceipt,
  GuestCheckoutRegistration,
} from "@/features/checkout/model/checkout";
import type { ShopwareClient } from "@/integrations/shopware/client";
import { getShopwareContext } from "@/integrations/shopware/context";
import { isPendingCustomerAddress } from "@/integrations/shopware/customer-address";

type ShopwareAddress = components["schemas"]["CustomerAddress"];

function mapCheckoutAddress(
  address: ShopwareAddress | null | undefined,
): CheckoutDisplayAddress | undefined {
  if (!address || isPendingCustomerAddress(address)) {
    return undefined;
  }

  return {
    additionalAddressLine1: address.additionalAddressLine1 || undefined,
    city: address.city,
    country:
      address.country?.translated.name || address.country?.name || undefined,
    countryId: address.countryId,
    firstName: address.firstName,
    lastName: address.lastName,
    phoneNumber: address.phoneNumber || undefined,
    street: address.street,
    zipcode: address.zipcode || "",
  };
}

function mapAddress(
  address: GuestCheckoutRegistration["billingAddress"],
): ShopwareAddress {
  return {
    additionalAddressLine1: address.additionalAddressLine1,
    city: address.city,
    countryId: address.countryId,
    firstName: address.firstName,
    lastName: address.lastName,
    phoneNumber: address.phoneNumber,
    street: address.street,
    zipcode: address.zipcode,
  } as ShopwareAddress;
}

function getStorefrontUrl(
  context: Awaited<ReturnType<typeof getShopwareContext>>,
) {
  const storefrontUrl =
    context.salesChannel.hreflangDefaultDomain?.url ??
    context.salesChannel.domains?.[0]?.url;

  if (!storefrontUrl) {
    throw new Error("The Shopware sales channel has no storefront domain.");
  }

  return storefrontUrl;
}

export async function getShopwareCheckoutCustomer(
  client: ShopwareClient,
): Promise<CheckoutCustomer | null> {
  const customer = (await getShopwareContext(client)).customer;
  const billingAddress = mapCheckoutAddress(
    customer?.defaultBillingAddress ?? customer?.activeBillingAddress,
  );
  const shippingAddress = mapCheckoutAddress(
    customer?.activeShippingAddress ??
      customer?.defaultShippingAddress ??
      customer?.defaultBillingAddress ??
      customer?.activeBillingAddress,
  );

  return customer
    ? {
        addressComplete: Boolean(billingAddress),
        billingAddress,
        countryId: billingAddress?.countryId,
        email: customer.email,
        firstName: customer.firstName,
        guest: customer.guest ?? false,
        lastName: customer.lastName,
        shippingAddress,
      }
    : null;
}

export async function updateShopwareCustomerAddress(
  client: ShopwareClient,
  address: GuestCheckoutRegistration["billingAddress"],
) {
  const customer = (await getShopwareContext(client)).customer;
  const currentAddress =
    customer?.defaultBillingAddress ?? customer?.activeBillingAddress;
  const currentShippingAddress =
    customer?.activeShippingAddress ?? customer?.defaultShippingAddress;

  if (
    !customer ||
    customer.guest ||
    !currentAddress?.id ||
    !currentShippingAddress?.id
  ) {
    throw new Error("The customer has no editable billing address.");
  }

  const body = {
    ...mapAddress(address),
    company: currentAddress.company,
    salutationId: currentAddress.salutationId,
  };

  await client.invoke(
    "updateCustomerAddress patch /account/address/{addressId}",
    {
      body,
      fetchOptions: { cache: "no-store" },
      pathParams: { addressId: currentAddress.id },
    },
  );

  if (currentShippingAddress.id !== currentAddress.id) {
    await client.invoke(
      "updateCustomerAddress patch /account/address/{addressId}",
      {
        body: {
          ...body,
          company: currentShippingAddress.company,
          salutationId: currentShippingAddress.salutationId,
        },
        fetchOptions: { cache: "no-store" },
        pathParams: { addressId: currentShippingAddress.id },
      },
    );
  }
}

export async function createShopwareCheckoutDeliveryAddress(
  client: ShopwareClient,
  address: GuestCheckoutRegistration["billingAddress"],
) {
  const customer = (await getShopwareContext(client)).customer;
  const billingAddress =
    customer?.defaultBillingAddress ?? customer?.activeBillingAddress;

  if (!customer || customer.guest) {
    throw new Error("The customer has no editable delivery address.");
  }

  const response = await client.invoke(
    "createCustomerAddress post /account/address",
    {
      body: {
        ...mapAddress(address),
        company: billingAddress?.company,
        salutationId: billingAddress?.salutationId,
      },
      fetchOptions: { cache: "no-store" },
    },
  );

  if (!response.data.id) {
    throw new Error("Shopware did not return the new delivery address.");
  }

  await client.invoke(
    "defaultShippingAddress patch /account/address/default-shipping/{addressId}",
    {
      fetchOptions: { cache: "no-store" },
      pathParams: { addressId: response.data.id },
    },
  );
}

export async function getShopwareCheckoutOptions(
  client: ShopwareClient,
): Promise<CheckoutOptions> {
  const [context, countryResponse, paymentResponse, shippingResponse] =
    await Promise.all([
      getShopwareContext(client),
      client.invoke("readCountry post /country", {
        body: {
          filter: [{ field: "active", type: "equals", value: true }],
          limit: 100,
          sort: [{ field: "position", order: "ASC" }],
        },
        fetchOptions: { cache: "no-store" },
      }),
      client.invoke("readPaymentMethod post /payment-method", {
        body: { onlyAvailable: true },
        fetchOptions: { cache: "no-store" },
      }),
      client.invoke("readShippingMethod post /shipping-method", {
        body: {},
        fetchOptions: { cache: "no-store" },
        query: { onlyAvailable: true },
      }),
    ]);

  return {
    countries: (countryResponse.data.elements ?? []).map((country) => ({
      id: country.id,
      label: country.translated.name || country.name,
    })),
    paymentMethods: (paymentResponse.data.elements ?? []).map((method) => ({
      description: method.translated.description || method.description,
      id: method.id,
      label: method.translated.name || method.name,
    })),
    selectedPaymentMethodId: context.paymentMethod?.id,
    selectedShippingMethodId: context.shippingMethod?.id,
    shippingMethods: shippingResponse.data.elements.map((method) => ({
      description: method.translated.description || method.description,
      id: method.id,
      label: method.translated.name || method.name,
    })),
  };
}

export async function registerShopwareGuest(
  client: ShopwareClient,
  registration: GuestCheckoutRegistration,
) {
  const context = await getShopwareContext(client);

  await client.invoke("register post /account/register", {
    body: {
      acceptedDataProtection: registration.acceptedDataProtection,
      accountType: "private",
      billingAddress: mapAddress(registration.billingAddress),
      email: registration.email,
      firstName: registration.billingAddress.firstName,
      guest: true,
      lastName: registration.billingAddress.lastName,
      password: "",
      shippingAddress: registration.shippingAddress
        ? mapAddress(registration.shippingAddress)
        : undefined,
      storefrontUrl: getStorefrontUrl(context),
    },
    fetchOptions: { cache: "no-store" },
  });
}

export async function createShopwareCheckoutOrder(
  client: ShopwareClient,
  selection: CheckoutMethodSelection,
  paymentUrls: Readonly<{ errorUrl: string; finishUrl: string }>,
): Promise<
  Readonly<{
    paymentPending: boolean;
    receipt: CheckoutReceipt;
    redirectUrl?: string;
  }>
> {
  await client.invoke("updateContext patch /context", {
    body: {
      paymentMethodId: selection.paymentMethodId,
      shippingMethodId: selection.shippingMethodId,
    },
    fetchOptions: { cache: "no-store" },
  });

  const orderResponse = await client.invoke(
    "createOrder post /checkout/order",
    {
      body: { customerComment: selection.customerComment },
      fetchOptions: { cache: "no-store" },
    },
  );
  const order = orderResponse.data;
  const context = await getShopwareContext(client);
  let paymentPending = false;
  let redirectUrl: string | undefined;

  try {
    const paymentResponse = await client.invoke(
      "handlePaymentMethod post /handle-payment",
      {
        body: {
          errorUrl: paymentUrls.errorUrl,
          finishUrl: paymentUrls.finishUrl,
          orderId: order.id,
        },
        fetchOptions: { cache: "no-store" },
      },
    );

    redirectUrl = paymentResponse.data.redirectUrl || undefined;
  } catch (error) {
    paymentPending = true;
    console.error("Payment handler could not be started for the order.", error);
  }

  return {
    receipt: {
      currency: context.currency?.isoCode || "EUR",
      guest: context.customer?.guest ?? false,
      orderNumber: order.orderNumber || order.id,
      total: order.amountTotal ?? order.price.totalPrice,
    },
    paymentPending,
    redirectUrl,
  };
}

export async function convertShopwareGuest(
  client: ShopwareClient,
  password: string,
) {
  await client.invoke("convertGuest post /account/convert-guest", {
    body: { password },
    fetchOptions: { cache: "no-store" },
  });
}
