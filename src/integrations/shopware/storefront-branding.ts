import "server-only";

import {
  defaultStorefrontBranding,
  type StorefrontBranding,
} from "@/features/storefront-shell/model/branding";
import { parseStorefrontBranding } from "@/integrations/shopware/mappers/storefront-branding";
import type { ShopwareClient } from "@/lib/shopware/client";
import { getShopwareContext } from "@/lib/shopware/context";
import { shouldUseShopwareMocks } from "@/lib/shopware/mocks/config";

export async function getStorefrontBranding(
  client: ShopwareClient,
): Promise<StorefrontBranding> {
  if (shouldUseShopwareMocks()) {
    return defaultStorefrontBranding;
  }

  const context = await getShopwareContext(client);

  return parseStorefrontBranding(
    context.salesChannel.configuration,
    context.salesChannel.name,
  );
}
