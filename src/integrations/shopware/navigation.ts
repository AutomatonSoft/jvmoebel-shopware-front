import "server-only";

import type { ShopwareClient } from "@/integrations/shopware/client";
import { mapShopwareCategory } from "@/integrations/shopware/mappers/navigation";

async function getNavigation(
  client: ShopwareClient,
  rootId: string,
  depth = 2,
) {
  const response = await client.invoke(
    "readNavigation post /navigation/{activeId}/{rootId}",
    {
      headers: {
        "sw-include-seo-urls": true,
      },
      pathParams: {
        activeId: rootId,
        rootId,
      },
      body: {
        depth,
      },
      fetchOptions: {
        cache: "no-store",
      },
    },
  );

  return (response.data ?? []).map(mapShopwareCategory);
}

export function getShopwareMainNavigation(client: ShopwareClient) {
  return getNavigation(client, "main-navigation", 1);
}

export function getShopwareFooterNavigation(client: ShopwareClient) {
  return getNavigation(client, "footer-navigation");
}

export function getShopwareServiceNavigation(client: ShopwareClient) {
  return getNavigation(client, "service-navigation");
}

export function getShopwareCategoryChildren(
  client: ShopwareClient,
  categoryId: string,
) {
  return getNavigation(client, categoryId, 0);
}
