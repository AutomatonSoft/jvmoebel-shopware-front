import "server-only";

import { unstable_cache } from "next/cache";

import { shopwareCacheTtlSeconds } from "@/integrations/shopware/cache-policy";
import { getShopwareRequestSession } from "@/integrations/shopware/session";
import {
  getShopwareCanonicalProductPath,
  resolveShopwareStorefrontRoute,
} from "@/integrations/shopware/storefront-route";

const getCachedShopwareStorefrontRoute = unstable_cache(
  (pathname: string) =>
    resolveShopwareStorefrontRoute(
      getShopwareRequestSession().client,
      pathname,
    ),
  ["shopware-storefront-route"],
  { revalidate: shopwareCacheTtlSeconds.seo, tags: ["shopware:seo"] },
);

const getCachedShopwareCanonicalProductPath = unstable_cache(
  (productId: string) =>
    getShopwareCanonicalProductPath(
      getShopwareRequestSession().client,
      productId,
    ),
  ["shopware-canonical-product-path"],
  { revalidate: shopwareCacheTtlSeconds.seo, tags: ["shopware:seo"] },
);

export function getStorefrontRoute(pathname: string) {
  return getCachedShopwareStorefrontRoute(pathname);
}

export function getCanonicalProductPath(productId: string) {
  return getCachedShopwareCanonicalProductPath(productId);
}
