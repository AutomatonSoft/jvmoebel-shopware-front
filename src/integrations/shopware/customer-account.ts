import "server-only";

import type { components } from "@shopware/api-client/store-api-types";

import type {
  CustomerAccountSummary,
  CustomerLogin,
  CustomerOrderDetail,
  CustomerOrderSummary,
  CustomerRegistration,
  RegistrationOptions,
} from "@/features/customer-account/model/account";
import type { ShopwareClient } from "@/integrations/shopware/client";
import { getShopwareContext } from "@/integrations/shopware/context";
import { pendingCustomerAddressValues } from "@/integrations/shopware/customer-address";
import { mapShopwareCustomerAccount } from "@/integrations/shopware/mappers/customer-account";
import { mapShopwareCustomerOrders } from "@/integrations/shopware/mappers/customer-orders";

export async function getShopwareRegistrationOptions(
  client: ShopwareClient,
): Promise<RegistrationOptions> {
  const [context, salutationResponse] = await Promise.all([
    getShopwareContext(client),
    client.invoke("readSalutation post /salutation", {
      body: {
        limit: 100,
        sort: [{ field: "position", order: "ASC" }],
      },
      fetchOptions: { cache: "no-store" },
    }),
  ]);

  const salutationOrder = new Map([
    ["mrs", 0],
    ["mr", 1],
    ["not_specified", 2],
  ]);

  return {
    defaultCountryId: context.salesChannel.countryId,
    salutations: (salutationResponse.data.elements ?? [])
      .map((salutation) => ({
        id: salutation.id,
        key: salutation.salutationKey,
        label:
          salutation.salutationKey === "not_specified"
            ? "Neutrale Anrede"
            : salutation.translated.displayName || salutation.displayName,
      }))
      .sort(
        (left, right) =>
          (salutationOrder.get(left.key) ?? 99) -
          (salutationOrder.get(right.key) ?? 99),
      )
      .map(({ id, label }) => ({ id, label })),
  };
}

export async function loginShopwareCustomer(
  client: ShopwareClient,
  login: CustomerLogin,
) {
  await client.invoke("loginCustomer post /account/login", {
    body: {
      password: login.password,
      username: login.email,
    },
    fetchOptions: { cache: "no-store" },
  });
}

export async function registerShopwareCustomer(
  client: ShopwareClient,
  registration: CustomerRegistration,
) {
  const context = await getShopwareContext(client);
  const storefrontUrl =
    context.salesChannel.hreflangDefaultDomain?.url ??
    context.salesChannel.domains?.[0]?.url;

  if (!storefrontUrl) {
    throw new Error("The Shopware sales channel has no storefront domain.");
  }

  const billingAddress = {
    city: pendingCustomerAddressValues.city,
    company: registration.company,
    countryId: registration.countryId,
    firstName: registration.firstName,
    lastName: registration.lastName,
    salutationId: registration.salutationId,
    street: pendingCustomerAddressValues.street,
    zipcode: pendingCustomerAddressValues.zipcode,
  } as components["schemas"]["CustomerAddress"];

  const commonBody = {
    acceptedDataProtection: registration.acceptedDataProtection,
    billingAddress,
    email: registration.email,
    firstName: registration.firstName,
    lastName: registration.lastName,
    password: registration.password,
    salutationId: registration.salutationId,
    storefrontUrl,
  };

  await client.invoke("register post /account/register", {
    body:
      registration.accountType === "business"
        ? {
            ...commonBody,
            accountType: "business",
            company: registration.company!,
            vatIds: [registration.vatId!],
          }
        : {
            ...commonBody,
            accountType: "private",
          },
    fetchOptions: { cache: "no-store" },
  });
}

export async function getShopwareCustomerAccount(
  client: ShopwareClient,
): Promise<CustomerAccountSummary | null> {
  const context = await getShopwareContext(client);

  return mapShopwareCustomerAccount(context.customer);
}

export async function getShopwareCustomerOrders(
  client: ShopwareClient,
  limit = 3,
): Promise<CustomerOrderSummary[]> {
  const response = await client.invoke("readOrder post /order", {
    body: {
      associations: { stateMachineState: {} },
      limit,
      sort: [{ field: "orderDateTime", order: "DESC" }],
    },
    fetchOptions: { cache: "no-store" },
  });

  return mapShopwareCustomerOrders(response.data.orders.elements);
}

export async function getShopwareCustomerOrderDetail(
  client: ShopwareClient,
  number: string,
): Promise<CustomerOrderDetail | null> {
  const response = await client.invoke("readOrder post /order", {
    body: {
      associations: { lineItems: {}, stateMachineState: {} },
      limit: 100,
      sort: [{ field: "orderDateTime", order: "DESC" }],
    },
    fetchOptions: { cache: "no-store" },
  });
  const order = response.data.orders.elements.find(
    (item) => (item.orderNumber || item.id) === number,
  );
  if (!order) return null;
  const [summary] = mapShopwareCustomerOrders([order]);
  return {
    ...summary,
    items: (order.lineItems ?? []).map((item) => ({
      label: item.label || "Artikel",
      quantity: item.quantity,
      total: (item.priceDefinition?.price ?? 0) * item.quantity,
    })),
  };
}

export async function logoutShopwareCustomer(client: ShopwareClient) {
  await client.invoke("logoutCustomer post /account/logout", {
    fetchOptions: { cache: "no-store" },
  });
}
