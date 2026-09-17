import "server-only";

import { unstable_cache } from "next/cache";
import { cache } from "react";

import {
  getShopwareCustomerAccount,
  getShopwareRegistrationOptions,
} from "@/integrations/shopware/customer-account";
import { createCustomerSession } from "@/features/customer-account/server/session";
import { shopwareCacheTtlSeconds } from "@/integrations/shopware/cache-policy";
import { getShopwareRequestSession } from "@/integrations/shopware/session";

const getCachedShopwareRegistrationOptions = unstable_cache(
  () => getShopwareRegistrationOptions(getShopwareRequestSession().client),
  ["shopware-registration-options"],
  {
    revalidate: shopwareCacheTtlSeconds.registrationOptions,
    tags: ["shopware:registration-options"],
  },
);

export const getCustomerAccount = cache(async () => {
  const session = await createCustomerSession();

  return getShopwareCustomerAccount(session.client);
});

export async function getRegistrationOptions() {
  return getCachedShopwareRegistrationOptions();
}
