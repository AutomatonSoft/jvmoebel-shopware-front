import "server-only";

import {
  getShopwareCustomerAccount,
  getShopwareRegistrationOptions,
} from "@/integrations/shopware/customer-account";
import { createCustomerSession } from "@/features/customer-account/server/session";

export async function getCustomerAccount() {
  const session = await createCustomerSession();

  return getShopwareCustomerAccount(session.client);
}

export async function getRegistrationOptions() {
  const session = await createCustomerSession();

  return getShopwareRegistrationOptions(session.client);
}
