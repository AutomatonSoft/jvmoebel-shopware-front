import "server-only";

import {
  defaultStorefrontBranding,
  type StorefrontBranding,
} from "@/features/storefront-shell/model/branding";
import { getShopwareStorefrontBranding } from "@/integrations/shopware/storefront-branding";
import type { ShopwareClient } from "@/lib/shopware/client";
import { shouldUseShopwareMocks } from "@/lib/shopware/mocks/config";

export async function getStorefrontBranding(
  client: ShopwareClient,
): Promise<StorefrontBranding> {
  if (shouldUseShopwareMocks()) {
    return defaultStorefrontBranding;
  }

  return getShopwareStorefrontBranding(client);
}
