import "server-only";

import type { components } from "@shopware/api-client/store-api-types";

import {
  footerNavigationMock,
  mainNavigationMock,
  serviceNavigationMock,
} from "@/features/storefront-shell/fixtures/navigation";
import type { StoreNavigationItem } from "@/features/storefront-shell/model/navigation";
import { mapShopwareCategory } from "@/integrations/shopware/mappers/navigation";
import type { ShopwareClient } from "@/lib/shopware/client";
import { shouldUseShopwareMocks } from "@/lib/shopware/mocks/config";

type NavigationType = components["schemas"]["NavigationType"];

async function getNavigation(
  client: ShopwareClient,
  navigationType: NavigationType,
  mock: StoreNavigationItem[],
) {
  if (shouldUseShopwareMocks()) {
    return mock;
  }

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

export function getMainNavigation(client: ShopwareClient) {
  return getNavigation(client, "main-navigation", mainNavigationMock);
}

export function getFooterNavigation(client: ShopwareClient) {
  return getNavigation(client, "footer-navigation", footerNavigationMock);
}

export function getServiceNavigation(client: ShopwareClient) {
  return getNavigation(client, "service-navigation", serviceNavigationMock);
}
