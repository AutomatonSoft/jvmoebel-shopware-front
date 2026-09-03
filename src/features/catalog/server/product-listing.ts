import "server-only";

import { shopProductListingMock } from "@/features/catalog/fixtures/product-listing";
import type { ShopProductListing } from "@/features/catalog/model/product-listing";
import { shouldUseShopwareMocks } from "@/integrations/shopware/mock-mode";

export async function getShopProductListing(): Promise<ShopProductListing | null> {
  if (shouldUseShopwareMocks()) {
    return shopProductListingMock;
  }

  return null;
}
