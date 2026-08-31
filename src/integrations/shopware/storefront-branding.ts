import "server-only";

import type { StorefrontBranding } from "@/features/storefront-shell/model/branding";
import { parseStorefrontBranding } from "@/integrations/shopware/mappers/storefront-branding";
import type { ShopwareClient } from "@/lib/shopware/client";
import { getShopwareContext } from "@/lib/shopware/context";

export async function getShopwareStorefrontBranding(
  client: ShopwareClient,
): Promise<StorefrontBranding> {
  const context = await getShopwareContext(client);

  return parseStorefrontBranding(
    context.salesChannel.configuration,
    context.salesChannel.name,
  );
}
