import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import {
  shopwareCacheLife,
  shopwareCacheTtlSeconds,
} from "@/integrations/shopware/cache-policy";
import { getShopwareRequestSession } from "@/integrations/shopware/session";
import {
  getShopwareCanonicalProductPath,
  resolveShopwareStorefrontRoute,
} from "@/integrations/shopware/storefront-route";

async function getCachedShopwareStorefrontRoute(pathname: string) {
  "use cache";
  cacheLife(shopwareCacheLife(shopwareCacheTtlSeconds.seo));
  cacheTag("shopware:seo");

  return resolveShopwareStorefrontRoute(
    getShopwareRequestSession().client,
    pathname,
  );
}

async function getCachedShopwareCanonicalProductPath(productId: string) {
  "use cache";
  cacheLife(shopwareCacheLife(shopwareCacheTtlSeconds.seo));
  cacheTag("shopware:seo");

  return getShopwareCanonicalProductPath(
    getShopwareRequestSession().client,
    productId,
  );
}

export function getStorefrontRoute(pathname: string) {
  return getCachedShopwareStorefrontRoute(pathname);
}

export function getCanonicalProductPath(productId: string) {
  return getCachedShopwareCanonicalProductPath(productId);
}
