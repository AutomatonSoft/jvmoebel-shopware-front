import "server-only";

import { defaultStorefrontFooterContent } from "@/features/storefront-shell/fixtures/footer";
import {
  mainNavigationMock,
  serviceNavigationMock,
} from "@/features/storefront-shell/fixtures/navigation";
import { defaultStorefrontBranding } from "@/features/storefront-shell/model/branding";
import type { StorefrontShellData } from "@/features/storefront-shell/model/storefront-config";
import { reportStorefrontConfigIssues } from "@/features/storefront-shell/server/report-storefront-config-issues";
import { shouldUseShopwareMocks } from "@/integrations/shopware/mock-mode";
import { getShopwareRequestSession } from "@/integrations/shopware/session";
import { getShopwareStorefrontConfig } from "@/integrations/shopware/storefront-config";

const storefrontShellMock: StorefrontShellData = {
  branding: defaultStorefrontBranding,
  footerContent: defaultStorefrontFooterContent,
  footerNavigation: mainNavigationMock,
  navigation: mainNavigationMock,
  serviceNavigation: serviceNavigationMock,
};

export async function getStorefrontShellData(): Promise<StorefrontShellData> {
  if (shouldUseShopwareMocks()) {
    return storefrontShellMock;
  }

  const result = await getShopwareStorefrontConfig(
    getShopwareRequestSession().client,
  );

  reportStorefrontConfigIssues(result.issues);

  return result.data;
}
