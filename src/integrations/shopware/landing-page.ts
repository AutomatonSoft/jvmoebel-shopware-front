import "server-only";

import type { CmsLandingPage } from "@/features/cms/model/landing-page";
import type { ShopwareClient } from "@/integrations/shopware/client";
import { mapShopwareLandingPage } from "@/integrations/shopware/mappers/landing-page";

export async function getShopwareLandingPage(
  client: ShopwareClient,
  landingPageId: string,
): Promise<CmsLandingPage | null> {
  const response = await client.invoke(
    "readLandingPage post /landing-page/{landingPageId}",
    {
      body: {},
      fetchOptions: { cache: "no-store" },
      pathParams: { landingPageId },
    },
  );

  return mapShopwareLandingPage(response.data);
}
