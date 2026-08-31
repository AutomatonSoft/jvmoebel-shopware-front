import "server-only";

import type { components } from "@shopware/api-client/store-api-types";

import { mapShopwareCategory } from "@/integrations/shopware/mappers/navigation";
import type { ShopwareClient } from "@/lib/shopware/client";

type NavigationType = components["schemas"]["NavigationType"];

async function getNavigation(
  client: ShopwareClient,
  navigationType: NavigationType,
) {
  const response = await client.invoke(
    "readNavigation post /navigation/{activeId}/{rootId}",
    {
      headers: {
        "sw-include-seo-urls": true,
      },
      pathParams: {
        activeId: navigationType,
        rootId: navigationType,
      },
      body: {
        depth: 2,
      },
      fetchOptions: {
        cache: "no-store",
      },
    },
  );

  return response.data.map(mapShopwareCategory);
}

export function getShopwareMainNavigation(client: ShopwareClient) {
  return getNavigation(client, "main-navigation");
}

export function getShopwareFooterNavigation(client: ShopwareClient) {
  return getNavigation(client, "footer-navigation");
}

export function getShopwareServiceNavigation(client: ShopwareClient) {
  return getNavigation(client, "service-navigation");
}
