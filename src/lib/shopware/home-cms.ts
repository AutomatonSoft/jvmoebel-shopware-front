import "server-only";

import { getCmsPage } from "@/lib/shopware/cms";
import { createShopwareClient } from "@/lib/shopware/client";
import { getShopwareContext } from "@/lib/shopware/context";

export type GetHomeCmsPageOptions = {
  contextToken?: string;
};

export async function getHomeCmsPage(options: GetHomeCmsPageOptions = {}) {
  const context = await getShopwareContext(options);
  const navigationCategoryId = context.salesChannel.navigationCategoryId;
  const client = createShopwareClient(options);

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

  if (!category.cmsPageId) {
    throw new Error(
      `Shopware navigation category ${navigationCategoryId} has no CMS page assigned.`,
    );
  }

  return getCmsPage({
    id: category.cmsPageId,
    contextToken: options.contextToken,
  });
}

export type HomeCmsPage = Awaited<ReturnType<typeof getHomeCmsPage>>;
