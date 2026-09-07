import "server-only";

import {
  defaultStorefrontBranding,
  type StorefrontBranding,
} from "@/features/storefront-shell/model/branding";
import { reportStorefrontBrandingIssues } from "@/features/storefront-shell/server/report-branding-issues";
import { shouldUseShopwareMocks } from "@/integrations/shopware/mock-mode";
import { getShopwareRequestSession } from "@/integrations/shopware/session";
import { getShopwareStorefrontBranding } from "@/integrations/shopware/storefront-branding";

export async function getStorefrontBranding(): Promise<StorefrontBranding> {
  if (shouldUseShopwareMocks()) {
    return defaultStorefrontBranding;
  }

  const result = await getShopwareStorefrontBranding(
    getShopwareRequestSession().client,
  );

  reportStorefrontBrandingIssues(result.issues);

  return result.data;
}
