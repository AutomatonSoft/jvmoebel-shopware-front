import "server-only";

import { unstable_cache } from "next/cache";
import { cache } from "react";

import {
  getShopwareCustomerAccount,
  getShopwareCustomerOrders,
  getShopwareRegistrationOptions,
} from "@/integrations/shopware/customer-account";
import { createCustomerSession } from "@/features/customer-account/server/session";
import { getShopwareCheckoutOptions } from "@/integrations/shopware/checkout";
import { shopwareCacheTtlSeconds } from "@/integrations/shopware/cache-policy";
import { getShopwareRequestSession } from "@/integrations/shopware/session";

const getCachedShopwareRegistrationOptions = unstable_cache(
  () => getShopwareRegistrationOptions(getShopwareRequestSession().client),
  ["shopware-registration-options-v2"],
  {
    revalidate: shopwareCacheTtlSeconds.registrationOptions,
    tags: ["shopware:registration-options"],
  },
);

export const getCustomerAccount = cache(async () => {
  const session = await createCustomerSession();

  return getShopwareCustomerAccount(session.client);
});

export const getCustomerAccountOrders = cache(async () => {
  const session = await createCustomerSession();

  return getShopwareCustomerOrders(session.client);
});

export const getCustomerAccountOrderHistory = cache(async () => {
  const session = await createCustomerSession();

  return getShopwareCustomerOrders(session.client, 100);
});

export const getCustomerAddressOptions = cache(async () => {
  const session = await createCustomerSession();
  const options = await getShopwareCheckoutOptions(session.client);

  return options.countries;
});

export async function getRegistrationOptions() {
  return getCachedShopwareRegistrationOptions();
}
