import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import {
  defaultShopProductPageRequest,
  type ShopProductPageRequest,
} from "@/features/catalog/model/product-listing-page";
import { getShopProductListingPage } from "@/features/catalog/server/product-listing";
import { getStorefrontShellData } from "@/features/storefront-shell/server/storefront-config";
import { getStorefrontRoute } from "@/features/storefront-shell/server/storefront-route";
import {
  shopwareCacheLife,
  shopwareCacheTtlSeconds,
} from "@/integrations/shopware/cache-policy";
import { getShopwareCategoryPageContent } from "@/integrations/shopware/category-page";
import type { ShopwareCategoryRoute } from "@/integrations/shopware/category-route";
import { getShopwareRequestSession } from "@/integrations/shopware/session";

async function getCachedShopwareCategoryPageContent(categoryId: string) {
  "use cache";
  cacheLife(shopwareCacheLife(shopwareCacheTtlSeconds.categoryPage));
  cacheTag("shopware:categories", "shopware:cms");

  const navigation = getStorefrontShellData().then(
    (storefront) => storefront.navigation,
  );

  return getShopwareCategoryPageContent(
    getShopwareRequestSession().client,
    categoryId,
    navigation,
  );
}

export async function getShopCategoryPage(
  categoryId: string,
  productRequest: ShopProductPageRequest = defaultShopProductPageRequest,
) {
  const content = await getCachedShopwareCategoryPageContent(categoryId);
  const { hasProductListing, ...page } = content;

  return {
    ...page,
    listing: hasProductListing
      ? await getShopProductListingPage(productRequest, categoryId)
      : null,
  };
}

export async function getCategoryPageByPath(
  pathname: string,
  productRequest: ShopProductPageRequest = defaultShopProductPageRequest,
) {
  const storefrontRoute = await getStorefrontRoute(pathname);

  if (storefrontRoute?.kind !== "category") {
    return null;
  }

  const route = {
    canonicalPath: storefrontRoute.canonicalPath,
    categoryId: storefrontRoute.entityId,
    shouldRedirect: storefrontRoute.shouldRedirect,
  } satisfies ShopwareCategoryRoute;
  const page = await getShopCategoryPage(route.categoryId, productRequest);

  return { page, route } satisfies {
    page: Awaited<ReturnType<typeof getShopCategoryPage>>;
    route: ShopwareCategoryRoute;
  };
}
