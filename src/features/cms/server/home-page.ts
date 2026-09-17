import "server-only";

import { unstable_cache } from "next/cache";

import { homeCmsPageMock } from "@/features/cms/fixtures/home-page";
import type { CmsPage } from "@/features/cms/model/page";
import { shopwareCacheTtlSeconds } from "@/integrations/shopware/cache-policy";
import { getShopwareHomeCmsPage } from "@/integrations/shopware/home-cms";
import { shouldUseShopwareMocks } from "@/integrations/shopware/mock-mode";
import { getShopwareRequestSession } from "@/integrations/shopware/session";

const getCachedShopwareHomeCmsPage = unstable_cache(
  () => getShopwareHomeCmsPage(getShopwareRequestSession().client),
  ["shopware-home-cms"],
  {
    revalidate: shopwareCacheTtlSeconds.homeCmsPage,
    tags: ["shopware:cms"],
  },
);

export async function getHomeCmsPage(): Promise<CmsPage | null> {
  if (shouldUseShopwareMocks()) {
    return homeCmsPageMock;
  }

  return getCachedShopwareHomeCmsPage();
}
