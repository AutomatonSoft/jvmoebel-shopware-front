import "server-only";

import type { CmsPage } from "@/features/cms/model/page";
import type { ShopwareClient } from "@/integrations/shopware/client";
import { mapShopwareCmsPage } from "@/integrations/shopware/mappers/cms-page";

const SHOPWARE_ID_PATTERN = /^[0-9a-f]{32}$/i;

export type GetCmsPageOptions = {
  client: ShopwareClient;
  id: string;
};

export async function getShopwareCmsPage({
  client,
  id,
}: GetCmsPageOptions): Promise<CmsPage> {
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

  return mapShopwareCmsPage(response.data);
}
