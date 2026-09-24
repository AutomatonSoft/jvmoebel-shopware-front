import "server-only";

import { unstable_rethrow } from "next/navigation";

import { getShopCartItemCount } from "@/features/cart/model/cart";
import { getShopCart } from "@/features/cart/server/cart";
import { getCustomerAccount } from "@/features/customer-account/server/account";
import { hasCustomerContextCookie } from "@/features/customer-account/server/session";
import { shouldUseShopwareMocks } from "@/integrations/shopware/mock-mode";

async function hasHeaderSession() {
  return shouldUseShopwareMocks() || (await hasCustomerContextCookie());
}

export async function getHeaderCustomer() {
  if (!(await hasHeaderSession())) {
    return null;
  }

  return getCustomerAccount().catch((error: unknown) => {
    unstable_rethrow(error);
    console.error("Header customer account lookup failed.", error);
    return null;
  });
}

export async function getHeaderCartItemCount() {
  if (!(await hasHeaderSession())) {
    return 0;
  }

  const cart = await getShopCart().catch((error: unknown) => {
    unstable_rethrow(error);
    console.error("Header cart lookup failed.", error);
    return null;
  });

  return cart ? getShopCartItemCount(cart) : 0;
}
