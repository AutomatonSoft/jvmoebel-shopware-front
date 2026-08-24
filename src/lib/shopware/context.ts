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

  const response = await client.invoke("readContext get /context", {
    fetchOptions: {
      cache: "no-store",
    },
  });

  return response.data;
}

export type ShopwareContext = Awaited<ReturnType<typeof getShopwareContext>>;
