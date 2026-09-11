import "server-only";

import { cookies } from "next/headers";

import { createShopwareSession } from "@/integrations/shopware/session";

const customerContextCookie = "sw-context-token";

export async function createCustomerSession() {
  const cookieStore = await cookies();

  return createShopwareSession({
    contextToken: cookieStore.get(customerContextCookie)?.value,
  });
}

export async function persistCustomerContext(contextToken?: string) {
  if (!contextToken) {
    throw new Error("Shopware did not return a customer context token.");
  }

  const cookieStore = await cookies();

  cookieStore.set(customerContextCookie, contextToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearCustomerContext() {
  const cookieStore = await cookies();

  cookieStore.delete(customerContextCookie);
}
