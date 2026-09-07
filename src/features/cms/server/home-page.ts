import "server-only";

import { homeCmsPageMock } from "@/features/cms/fixtures/home-page";
import type { CmsPage } from "@/features/cms/model/page";
import { getShopwareHomeCmsPage } from "@/integrations/shopware/home-cms";
import { shouldUseShopwareMocks } from "@/integrations/shopware/mock-mode";
import { getShopwareRequestSession } from "@/integrations/shopware/session";

export async function getHomeCmsPage(): Promise<CmsPage | null> {
  if (shouldUseShopwareMocks()) {
    return homeCmsPageMock;
  }

  return getShopwareHomeCmsPage(getShopwareRequestSession().client);
}
