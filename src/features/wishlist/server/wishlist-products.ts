import "server-only";

import { shopProductListingMock } from "@/features/catalog/fixtures/product-listing";
import type { ShopProductListing } from "@/features/catalog/model/product-listing";
import { shouldUseShopwareMocks } from "@/integrations/shopware/mock-mode";
import { getShopwareRequestSession } from "@/integrations/shopware/session";
import { getShopwareWishlistProducts } from "@/integrations/shopware/wishlist";

const maximumWishlistProducts = 50;

export function normalizeWishlistProductIds(productIds: unknown): string[] {
  if (!Array.isArray(productIds)) return [];

  return Array.from(
    new Set(
      productIds.filter(
        (productId): productId is string =>
          typeof productId === "string" && productId.trim().length > 0,
      ),
    ),
  ).slice(0, maximumWishlistProducts);
}

export async function getWishlistProducts(
  productIds: unknown,
): Promise<ShopProductListing> {
  const normalizedProductIds = normalizeWishlistProductIds(productIds);

  if (shouldUseShopwareMocks()) {
    return {
      ...shopProductListingMock,
      products: normalizedProductIds.flatMap((productId) => {
        const product = shopProductListingMock.products.find(
          (candidate) => candidate.id === productId,
        );

        return product ? [product] : [];
      }),
    };
  }

  if (normalizedProductIds.length === 0) {
    return { ...shopProductListingMock, products: [] };
  }

  return getShopwareWishlistProducts(
    getShopwareRequestSession().client,
    normalizedProductIds,
  );
}
