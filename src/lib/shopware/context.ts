import "server-only";

import { createShopwareClient } from "@/lib/shopware/client";

export type GetShopwareContextOptions = {
  contextToken?: string;
};

export async function getShopwareContext(
  options: GetShopwareContextOptions = {},
) {
  const client = createShopwareClient({
    contextToken: options.contextToken,
  });

  return client.invoke("readContext get /context", {
    fetchOptions: {
      cache: "no-store",
    },
  });
}

export type ShopwareContext = Awaited<ReturnType<typeof getShopwareContext>>;
