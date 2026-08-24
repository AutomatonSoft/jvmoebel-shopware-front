import "server-only";

import type { ShopwareClient } from "@/lib/shopware/client";
import { getShopwareContext } from "@/lib/shopware/context";

export type GetHomeCmsPageOptions = {
  client: ShopwareClient;
};

export async function getHomeCmsPage({ client }: GetHomeCmsPageOptions) {
  const context = await getShopwareContext(client);
  const navigationCategoryId = context.salesChannel.navigationCategoryId;

  const categoryResponse = await client.invoke(
    "readCategory post /category/{navigationId}",
    {
      pathParams: { navigationId: navigationCategoryId },
      body: {},
      fetchOptions: {
        cache: "no-store",
      },
    },
  );
  const category = categoryResponse.data;

  if (!category.cmsPage) {
    throw new Error(
      `Shopware navigation category ${navigationCategoryId} has no CMS page assigned.`,
    );
  }

  return category.cmsPage;
}

export type HomeCmsPage = Awaited<ReturnType<typeof getHomeCmsPage>>;
