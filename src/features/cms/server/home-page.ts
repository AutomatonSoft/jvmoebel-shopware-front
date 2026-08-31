import "server-only";

import { homeCmsPageMock } from "@/features/cms/fixtures/home-page";
import type { CmsPage } from "@/features/cms/model/page";
import type { ShopwareClient } from "@/integrations/shopware/client";
import { getShopwareHomeCmsPage } from "@/integrations/shopware/home-cms";
import { shouldUseShopwareMocks } from "@/integrations/shopware/mock-mode";

export type GetHomeCmsPageOptions = {
  client: ShopwareClient;
};

export async function getHomeCmsPage({
  client,
}: GetHomeCmsPageOptions): Promise<CmsPage> {
  if (shouldUseShopwareMocks()) {
    return homeCmsPageMock;
  }

  return getShopwareHomeCmsPage(client);
}
