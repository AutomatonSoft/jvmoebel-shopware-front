import "server-only";

import type { ShopwareClient } from "@/lib/shopware/client";

export type GetHomeCmsPageOptions = {
  client: ShopwareClient;
};

export async function getHomeCmsPage({ client }: GetHomeCmsPageOptions) {
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

export type HomeCmsPage = Awaited<ReturnType<typeof getHomeCmsPage>>;
