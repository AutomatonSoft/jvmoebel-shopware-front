import "server-only";

import type { ShopwareClient } from "@/integrations/shopware/client";
import { resolveShopwareStorefrontRoute } from "@/integrations/shopware/storefront-route";

export type ShopwareCategoryRoute = {
  canonicalPath: string;
  categoryId: string;
  shouldRedirect: boolean;
};

export async function resolveShopwareCategoryRoute(
  client: ShopwareClient,
  pathname: string,
): Promise<ShopwareCategoryRoute | null> {
  const route = await resolveShopwareStorefrontRoute(client, pathname);

  return route?.kind === "category"
    ? {
        canonicalPath: route.canonicalPath,
        categoryId: route.entityId,
        shouldRedirect: route.shouldRedirect,
      }
    : null;
}
