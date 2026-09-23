import "server-only";

import type { ShopProductListing } from "@/features/catalog/model/product-listing";
import { defaultShopProductPageRequest } from "@/features/catalog/model/product-listing-page";
import { getShopProductListingPage } from "@/features/catalog/server/product-listing";

const cartRecommendationLimit = 8;

export async function getCartRecommendations(): Promise<ShopProductListing> {
  const listing = await getShopProductListingPage({
    ...defaultShopProductPageRequest,
    sort: "featured",
  });

  return {
    ...listing,
    products: listing.products.slice(0, cartRecommendationLimit),
  };
}
