import "server-only";

import { unstable_rethrow } from "next/navigation";

import { getShopCartItemCount } from "@/features/cart/model/cart";
import { getShopCart } from "@/features/cart/server/cart";
import { getCustomerAccount } from "@/features/customer-account/server/account";
import { hasCustomerContextCookie } from "@/features/customer-account/server/session";
import { shouldUseShopwareMocks } from "@/integrations/shopware/mock-mode";

export async function getHeaderSession() {
  if (!shouldUseShopwareMocks() && !(await hasCustomerContextCookie())) {
    return { cartItemCount: 0, customer: null };
  }

  const [customer, cart] = await Promise.all([
    getCustomerAccount().catch((error: unknown) => {
      unstable_rethrow(error);
      console.error("Header customer account lookup failed.", error);
      return null;
    }),
    getShopCart().catch((error: unknown) => {
      unstable_rethrow(error);
      console.error("Header cart lookup failed.", error);
      return null;
    }),
  ]);

  return {
    cartItemCount: cart ? getShopCartItemCount(cart) : 0,
    customer,
  };
}
