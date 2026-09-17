import "server-only";

import { unstable_cache } from "next/cache";

import { getStorefrontRoute } from "@/features/storefront-shell/server/storefront-route";
import { shopwareCacheTtlSeconds } from "@/integrations/shopware/cache-policy";
import { getShopwareCategoryPage } from "@/integrations/shopware/category-page";
import type { ShopwareCategoryRoute } from "@/integrations/shopware/category-route";
import { getShopwareRequestSession } from "@/integrations/shopware/session";

const getCachedShopwareCategoryPage = unstable_cache(
  (categoryId: string) =>
    getShopwareCategoryPage(getShopwareRequestSession().client, categoryId),
  ["shopware-category-page"],
  {
    revalidate: shopwareCacheTtlSeconds.categoryPage,
    tags: ["shopware:catalog", "shopware:cms"],
  },
);

export function getShopCategoryPage(categoryId: string) {
  return getCachedShopwareCategoryPage(categoryId);
}

export async function getCategoryPageByPath(pathname: string) {
  const storefrontRoute = await getStorefrontRoute(pathname);

  if (storefrontRoute?.kind !== "category") {
    return null;
  }

  const route = {
    canonicalPath: storefrontRoute.canonicalPath,
    categoryId: storefrontRoute.entityId,
    shouldRedirect: storefrontRoute.shouldRedirect,
  } satisfies ShopwareCategoryRoute;
  const page = await getShopCategoryPage(route.categoryId);

  return { page, route } satisfies {
    page: Awaited<ReturnType<typeof getShopwareCategoryPage>>;
    route: ShopwareCategoryRoute;
  };
}
