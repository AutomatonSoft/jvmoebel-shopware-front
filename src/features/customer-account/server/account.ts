import "server-only";

import { cache } from "react";

import {
  getShopwareCustomerAccount,
  getShopwareCustomerOrders,
  getShopwareCustomerOrderDetail,
  getShopwareRegistrationOptions,
} from "@/integrations/shopware/customer-account";
import { createCustomerSession } from "@/features/customer-account/server/session";
import { getShopwareCheckoutOptions } from "@/integrations/shopware/checkout";
import { getShopwareRequestSession } from "@/integrations/shopware/session";

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

export const getCustomerOrderDetail = cache(async (number: string) => {
  const session = await createCustomerSession();
  return getShopwareCustomerOrderDetail(session.client, number);
});

export const getCustomerAddressOptions = cache(async () => {
  const session = await createCustomerSession();
  const options = await getShopwareCheckoutOptions(session.client);

  return options.countries;
});

export async function getRegistrationOptions() {
  const session = getShopwareRequestSession();

  return getShopwareRegistrationOptions(session.client);
}
