import "server-only";

import type { CmsPage } from "@/features/cms/model/page";
import type { ShopwareClient } from "@/integrations/shopware/client";
import { mapShopwareCmsPage } from "@/integrations/shopware/mappers/cms-page";

export async function getShopwareHomeCmsPage(
  client: ShopwareClient,
): Promise<CmsPage> {
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

  return mapShopwareCmsPage(category.cmsPage);
}
