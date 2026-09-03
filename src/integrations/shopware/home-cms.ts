import "server-only";

import type { CmsPage } from "@/features/cms/model/page";
import type { ShopwareClient } from "@/integrations/shopware/client";
import { mapShopwareCmsPage } from "@/integrations/shopware/mappers/cms-page";

export async function getShopwareHomeCmsPage(
  client: ShopwareClient,
): Promise<CmsPage | null> {
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
    return null;
  }

  return mapShopwareCmsPage(category.cmsPage);
}
