import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { connection } from "next/server";

import { homeCmsPageMock } from "@/features/cms/fixtures/home-page";
import type { CmsPage } from "@/features/cms/model/page";
import { getShopwareHomeCmsPage } from "@/integrations/shopware/home-cms";
import {
  shopwareCacheLife,
  shopwareCacheTtlSeconds,
} from "@/integrations/shopware/cache-policy";
import { shouldUseShopwareMocks } from "@/integrations/shopware/mock-mode";
import { getShopwareRequestSession } from "@/integrations/shopware/session";

async function getCachedHomeCmsPage(): Promise<CmsPage | null> {
  "use cache";
  cacheLife(shopwareCacheLife(shopwareCacheTtlSeconds.homeCmsPage));
  cacheTag("shopware:cms");

  if (shouldUseShopwareMocks()) {
    return homeCmsPageMock;
  }

  return getShopwareHomeCmsPage(getShopwareRequestSession().client);
}

export async function getHomeCmsPage(): Promise<CmsPage | null> {
  if (
    !shouldUseShopwareMocks() &&
    (!process.env.SHOPWARE_ENDPOINT || !process.env.SHOPWARE_ACCESS_TOKEN)
  ) {
    await connection();
  }

  return getCachedHomeCmsPage();
}
