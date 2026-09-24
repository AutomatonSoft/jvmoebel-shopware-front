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
import {
  getShopwareCategoryPageContentFromCore,
  getShopwareCategoryPageCore,
  type ShopwareCategoryPageCore,
} from "@/integrations/shopware/category-page";
import type { ShopwareCategoryRoute } from "@/integrations/shopware/category-route";
import { getShopwareRequestSession } from "@/integrations/shopware/session";

async function getCachedShopwareCategoryPageCore(categoryId: string) {
  "use cache";
  cacheLife(shopwareCacheLife(shopwareCacheTtlSeconds.categoryPage));
  cacheTag("shopware:categories", "shopware:cms");

  return getShopwareCategoryPageCore(
    getShopwareRequestSession().client,
    categoryId,
  );
}

async function getCachedShopwareCategoryPageContent(
  categoryId: string,
  core: ShopwareCategoryPageCore,
) {
  "use cache";
  cacheLife(shopwareCacheLife(shopwareCacheTtlSeconds.categoryPage));
  cacheTag("shopware:categories", "shopware:cms");

  const navigation = getStorefrontShellData().then(
    (storefront) => storefront.navigation,
  );

  return getShopwareCategoryPageContentFromCore(
    getShopwareRequestSession().client,
    categoryId,
    core,
    navigation,
  );
}

export async function getShopCategoryPage(
  categoryId: string,
  productRequest: ShopProductPageRequest = defaultShopProductPageRequest,
) {
  const core = await getCachedShopwareCategoryPageCore(categoryId);
  const contentPromise = getCachedShopwareCategoryPageContent(categoryId, core);
  const listingPromise = core.hasProductListing
    ? getShopProductListingPage(productRequest, categoryId)
    : Promise.resolve(null);
  const [content, listing] = await Promise.all([
    contentPromise,
    listingPromise,
  ]);

  return {
    breadcrumbs: content.breadcrumbs,
    category: content.category,
    children: content.children,
    cmsPage: content.cmsPage,
    listing,
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
