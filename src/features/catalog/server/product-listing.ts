import "server-only";

import { shopProductListingMock } from "@/features/catalog/fixtures/product-listing";
import type { ShopProductListing } from "@/features/catalog/model/product-listing";
import { shouldUseShopwareMocks } from "@/integrations/shopware/mock-mode";
import { getShopwareProductListing } from "@/integrations/shopware/product-listing";
import { getShopwareRequestSession } from "@/integrations/shopware/session";

export async function getShopProductListing(
  categoryId?: string,
): Promise<ShopProductListing | null> {
  if (shouldUseShopwareMocks()) {
    return shopProductListingMock;
  }

  return getShopwareProductListing(
    getShopwareRequestSession().client,
    categoryId,
  );
}
