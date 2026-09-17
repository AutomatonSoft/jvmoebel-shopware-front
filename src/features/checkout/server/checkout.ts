import "server-only";

import { cache } from "react";

import type { CheckoutPageData } from "@/features/checkout/model/checkout";
import {
  getMockCheckoutCustomer,
  mockCheckoutOptions,
} from "@/features/checkout/server/mock-checkout";
import { getShopCart } from "@/features/cart/server/cart";
import { createCustomerSession } from "@/features/customer-account/server/session";
import {
  getShopwareCheckoutCustomer,
  getShopwareCheckoutOptions,
} from "@/integrations/shopware/checkout";
import { shouldUseShopwareMocks } from "@/integrations/shopware/mock-mode";

export const getCheckoutPageData = cache(
  async (): Promise<CheckoutPageData> => {
    const cart = await getShopCart();

    if (shouldUseShopwareMocks()) {
      return {
        cart,
        customer: await getMockCheckoutCustomer(),
        options: mockCheckoutOptions,
      };
    }

    const session = await createCustomerSession();
    const [customer, options] = await Promise.all([
      getShopwareCheckoutCustomer(session.client),
      getShopwareCheckoutOptions(session.client),
    ]);

    return { cart, customer, options };
  },
);
