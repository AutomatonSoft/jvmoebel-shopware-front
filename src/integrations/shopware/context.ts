import "server-only";

import type { ShopwareClient } from "@/integrations/shopware/client";

export async function getShopwareContext(client: ShopwareClient) {
  const response = await client.invoke("readContext get /context", {
    fetchOptions: {
      cache: "no-store",
    },
  });

  return response.data;
}

export type ShopwareContext = Awaited<ReturnType<typeof getShopwareContext>>;
