import "server-only";

import {
  defaultStorefrontBranding,
  type StorefrontBranding,
} from "@/features/storefront-shell/model/branding";
import { reportStorefrontBrandingIssues } from "@/features/storefront-shell/server/report-branding-issues";
import type { ShopwareClient } from "@/integrations/shopware/client";
import { shouldUseShopwareMocks } from "@/integrations/shopware/mock-mode";
import { getShopwareStorefrontBranding } from "@/integrations/shopware/storefront-branding";

export async function getStorefrontBranding(
  client: ShopwareClient,
): Promise<StorefrontBranding> {
  if (shouldUseShopwareMocks()) {
    return defaultStorefrontBranding;
  }

  const result = await getShopwareStorefrontBranding(client);

  reportStorefrontBrandingIssues(result.issues);

  return result.data;
}
