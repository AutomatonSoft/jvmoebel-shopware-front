import "server-only";

import type { StorefrontConfigResult } from "@/features/storefront-shell/model/storefront-config";
import type { ShopwareClient } from "@/integrations/shopware/client";
import { parseShopwareStorefrontConfig } from "@/integrations/shopware/mappers/storefront-config";

export async function getShopwareStorefrontConfig(
  client: ShopwareClient,
): Promise<StorefrontConfigResult> {
  const response = await client.invoke(
    "readStorefrontConfig get /storefront-config",
    {
      fetchOptions: {
        cache: "no-store",
      },
    },
  );

  return parseShopwareStorefrontConfig(response.data);
}
