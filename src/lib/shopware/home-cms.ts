import "server-only";

import type { ShopwareClient } from "@/integrations/shopware/client";
import type { CmsPage } from "@/lib/shopware/cms";
import { shouldUseShopwareMocks } from "@/lib/shopware/mocks/config";
import { homeCmsPageMock } from "@/lib/shopware/mocks/home-cms";

export type GetHomeCmsPageOptions = {
  client: ShopwareClient;
};

export async function getHomeCmsPage({
  client,
}: GetHomeCmsPageOptions): Promise<CmsPage> {
  if (shouldUseShopwareMocks()) {
    return homeCmsPageMock;
  }

  const categoryResponse = await client.invoke(
    "readCategory post /category/{navigationId}",
    {
      pathParams: { navigationId: "home" },
      body: {},
      fetchOptions: {
        cache: "no-store",
      },
    },
  );
  const category = categoryResponse.data;

  if (!category.cmsPage) {
    throw new Error("Shopware home category has no CMS page assigned.");
  }

  return category.cmsPage;
}

export type HomeCmsPage = CmsPage;
