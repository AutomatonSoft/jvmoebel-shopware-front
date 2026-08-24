import "server-only";

import type { components } from "@shopware/api-client/store-api-types";

import type { ShopwareClient } from "@/lib/shopware/client";
import { shouldUseShopwareMocks } from "@/lib/shopware/mocks/config";
import { mainNavigationMock } from "@/lib/shopware/mocks/navigation";

type ShopwareCategory = components["schemas"]["Category"];

export type StoreNavigationItem = {
  children: StoreNavigationItem[];
  href: string;
  id: string;
  label: string;
};

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
    children: category.children.map(mapCategory),
  };
}

export async function getMainNavigation(client: ShopwareClient) {
  if (shouldUseShopwareMocks()) {
    return mainNavigationMock;
  }

  const response = await client.invoke(
    "readNavigation post /navigation/{activeId}/{rootId}",
    {
      headers: {
        "sw-include-seo-urls": true,
      },
      pathParams: {
        activeId: "main-navigation",
        rootId: "main-navigation",
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

export type MainNavigation = Awaited<ReturnType<typeof getMainNavigation>>;
