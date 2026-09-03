import type { components } from "@shopware/api-client/store-api-types";

import type { StoreNavigationItem } from "@/features/storefront-shell/model/navigation";

type ShopwareCategory = components["schemas"]["Category"];

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

export function mapShopwareCategory(
  category: ShopwareCategory,
): StoreNavigationItem {
  return {
    id: category.id,
    label: category.translated.name || category.name,
    href: getCategoryHref(category),
    children: (category.children ?? []).map(mapShopwareCategory),
  };
}
