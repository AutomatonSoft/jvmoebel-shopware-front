import "server-only";

import { cache } from "react";

import type { ShopwareClient } from "@/integrations/shopware/client";

export const getShopwareContext = cache(async (client: ShopwareClient) => {
  const response = await client.invoke("readContext get /context", {
    fetchOptions: {
      cache: "no-store",
    },
  });

  return response.data;
});

export type ShopwareContext = Awaited<ReturnType<typeof getShopwareContext>>;
