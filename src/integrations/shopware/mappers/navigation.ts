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

  return `/kategorie/${category.id}`;
}

export function mapShopwareCategory(
  category: ShopwareCategory,
): StoreNavigationItem {
  const children = (category.children ?? []).map(mapShopwareCategory);

  return {
    childCount: Math.max(
      category.visibleChildCount ?? 0,
      category.childCount ?? 0,
      children.length,
    ),
    children,
    id: category.id,
    label: category.translated.name || category.name,
    href: getCategoryHref(category),
  };
}
