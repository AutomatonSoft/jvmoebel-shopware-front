import "server-only";

import { cache } from "react";

import {
  getShopwareCustomerAccount,
  getShopwareRegistrationOptions,
} from "@/integrations/shopware/customer-account";
import { createCustomerSession } from "@/features/customer-account/server/session";

export const getCustomerAccount = cache(async () => {
  const session = await createCustomerSession();

  return getShopwareCustomerAccount(session.client);
});

export async function getRegistrationOptions() {
  const session = await createCustomerSession();

  return getShopwareRegistrationOptions(session.client);
}
