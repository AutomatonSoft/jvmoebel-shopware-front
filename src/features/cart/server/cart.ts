import "server-only";

import { cache } from "react";

import { getMockShopCart } from "@/features/cart/server/mock-cart";
import { createCustomerSession } from "@/features/customer-account/server/session";
import { getShopwareCart } from "@/integrations/shopware/cart";
import { shouldUseShopwareMocks } from "@/integrations/shopware/mock-mode";

export const getShopCart = cache(async () => {
  if (shouldUseShopwareMocks()) {
    return getMockShopCart();
  }

  const session = await createCustomerSession();

  return getShopwareCart(session.client);
});
