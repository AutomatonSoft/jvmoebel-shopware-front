import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { connection } from "next/server";

import { defaultStorefrontFooterContent } from "@/features/storefront-shell/fixtures/footer";
import {
  mainNavigationMock,
  serviceNavigationMock,
} from "@/features/storefront-shell/fixtures/navigation";
import { defaultStorefrontBranding } from "@/features/storefront-shell/model/branding";
import type { StorefrontShellData } from "@/features/storefront-shell/model/storefront-config";
import { reportStorefrontConfigIssues } from "@/features/storefront-shell/server/report-storefront-config-issues";
import {
  shopwareCacheLife,
  shopwareCacheTtlSeconds,
} from "@/integrations/shopware/cache-policy";
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

async function getCachedShopwareStorefrontShellData(): Promise<StorefrontShellData> {
  "use cache";
  cacheLife(shopwareCacheLife(shopwareCacheTtlSeconds.storefrontShell));
  cacheTag("shopware:categories", "shopware:storefront-shell");

  const result = await getShopwareStorefrontConfig(
    getShopwareRequestSession().client,
  );

  reportStorefrontConfigIssues(result.issues);

  return result.data;
}

export async function getStorefrontShellData(): Promise<StorefrontShellData> {
  if (shouldUseShopwareMocks()) {
    return storefrontShellMock;
  }

  if (!process.env.SHOPWARE_ENDPOINT || !process.env.SHOPWARE_ACCESS_TOKEN) {
    await connection();
  }

  return getCachedShopwareStorefrontShellData();
}
