import "server-only";

import { createShopwareClient } from "@/lib/shopware/client";

const SHOPWARE_ID_PATTERN = /^[0-9a-f]{32}$/i;

export type GetCmsPageOptions = {
  id: string;
  contextToken?: string;
};

export async function getCmsPage({ id, contextToken }: GetCmsPageOptions) {
  if (!SHOPWARE_ID_PATTERN.test(id)) {
    throw new Error(
      "Shopware CMS page id must be a 32-character hexadecimal identifier.",
    );
  }

  const client = createShopwareClient({ contextToken });

  return client.invoke("readCms post /cms/{id}", {
    pathParams: { id },
    body: {},
    fetchOptions: {
      cache: "no-store",
    },
  });
}

export type CmsPage = Awaited<ReturnType<typeof getCmsPage>>;
