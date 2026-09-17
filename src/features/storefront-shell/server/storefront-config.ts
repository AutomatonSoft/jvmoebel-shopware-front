import "server-only";

import { unstable_cache } from "next/cache";

import { defaultStorefrontFooterContent } from "@/features/storefront-shell/fixtures/footer";
import {
  mainNavigationMock,
  serviceNavigationMock,
} from "@/features/storefront-shell/fixtures/navigation";
import { defaultStorefrontBranding } from "@/features/storefront-shell/model/branding";
import type { StorefrontShellData } from "@/features/storefront-shell/model/storefront-config";
import { reportStorefrontConfigIssues } from "@/features/storefront-shell/server/report-storefront-config-issues";
import { shopwareCacheTtlSeconds } from "@/integrations/shopware/cache-policy";
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

const getCachedShopwareStorefrontShellData = unstable_cache(
  async (): Promise<StorefrontShellData> => {
    const result = await getShopwareStorefrontConfig(
      getShopwareRequestSession().client,
    );

    reportStorefrontConfigIssues(result.issues);

    return result.data;
  },
  ["shopware-storefront-shell"],
  {
    revalidate: shopwareCacheTtlSeconds.storefrontShell,
    tags: ["shopware:storefront-shell"],
  },
);

export async function getStorefrontShellData(): Promise<StorefrontShellData> {
  if (shouldUseShopwareMocks()) {
    return storefrontShellMock;
  }

  return getCachedShopwareStorefrontShellData();
}
