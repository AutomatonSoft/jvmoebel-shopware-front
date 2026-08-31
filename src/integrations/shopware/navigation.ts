import "server-only";

import type { components } from "@shopware/api-client/store-api-types";

import {
  footerNavigationMock,
  mainNavigationMock,
  serviceNavigationMock,
} from "@/features/storefront-shell/fixtures/navigation";
import type { StoreNavigationItem } from "@/features/storefront-shell/model/navigation";
import type { ShopwareClient } from "@/lib/shopware/client";
import { shouldUseShopwareMocks } from "@/lib/shopware/mocks/config";

type ShopwareCategory = components["schemas"]["Category"];
type NavigationType = components["schemas"]["NavigationType"];

function getCategoryHref(category: ShopwareCategory) {
  const externalLink =
    category.translated.externalLink || category.externalLink;

  if (externalLink) {
    return externalLink;
  }

  const seoPath =
    category.seoUrl ||
    category.seoUrls?.find((seoUrl) => seoUrl.isCanonical && !seoUrl.isDeleted)
      ?.seoPathInfo;

  if (seoPath) {
    return seoPath.startsWith("/") ? seoPath : `/${seoPath}`;
  }

  return `/navigation/${category.id}`;
}

function mapCategory(category: ShopwareCategory): StoreNavigationItem {
  return {
    id: category.id,
    label: category.translated.name || category.name,
    href: getCategoryHref(category),
    children: (category.children ?? []).map(mapCategory),
  };
}

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

  return response.data.map(mapCategory);
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
