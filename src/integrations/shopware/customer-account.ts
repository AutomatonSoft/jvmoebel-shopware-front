import "server-only";

import type { components } from "@shopware/api-client/store-api-types";

import type {
  CustomerAccountSummary,
  CustomerLogin,
  CustomerRegistration,
  RegistrationOptions,
} from "@/features/customer-account/model/account";
import type { ShopwareClient } from "@/integrations/shopware/client";
import { getShopwareContext } from "@/integrations/shopware/context";

export async function getShopwareRegistrationOptions(
  client: ShopwareClient,
): Promise<RegistrationOptions> {
  const countryResponse = await client.invoke("readCountry post /country", {
    body: {
      filter: [{ field: "active", type: "equals", value: true }],
      limit: 100,
      sort: [{ field: "position", order: "ASC" }],
    },
    fetchOptions: { cache: "no-store" },
  });

  return {
    countries: (countryResponse.data.elements ?? []).map((country) => ({
      id: country.id,
      label: country.translated.name,
    })),
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
    city: registration.city,
    countryId: registration.countryId,
    firstName: registration.firstName,
    lastName: registration.lastName,
    street: registration.street,
    zipcode: registration.zipcode,
  } as components["schemas"]["CustomerAddress"];

  await client.invoke("register post /account/register", {
    body: {
      acceptedDataProtection: registration.acceptedDataProtection,
      accountType: "private",
      billingAddress,
      email: registration.email,
      firstName: registration.firstName,
      lastName: registration.lastName,
      password: registration.password,
      storefrontUrl,
    },
    fetchOptions: { cache: "no-store" },
  });
}

export async function getShopwareCustomerAccount(
  client: ShopwareClient,
): Promise<CustomerAccountSummary | null> {
  const context = await getShopwareContext(client);
  const customer = context.customer;

  return customer
    ? {
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
      }
    : null;
}

export async function logoutShopwareCustomer(client: ShopwareClient) {
  await client.invoke("logoutCustomer post /account/logout", {
    fetchOptions: { cache: "no-store" },
  });
}
