import "server-only";

import type { ShopwareClient } from "@/lib/shopware/client";

const SHOPWARE_ID_PATTERN = /^[0-9a-f]{32}$/i;

export type GetCmsPageOptions = {
  client: ShopwareClient;
  id: string;
};

export async function getCmsPage({ client, id }: GetCmsPageOptions) {
  if (!SHOPWARE_ID_PATTERN.test(id)) {
    throw new Error(
      "Shopware CMS page id must be a 32-character hexadecimal identifier.",
    );
  }

  const response = await client.invoke("readCms post /cms/{id}", {
    pathParams: { id },
    body: {},
    fetchOptions: {
      cache: "no-store",
    },
  });

  return response.data;
}

export type CmsPage = Awaited<ReturnType<typeof getCmsPage>>;
