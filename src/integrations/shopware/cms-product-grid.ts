import "server-only";

import type { ShopProductListing } from "@/features/catalog/model/product-listing";
import type { ShopwareClient } from "@/integrations/shopware/client";
import { getShopwareWishlistProducts } from "@/integrations/shopware/wishlist";

const productBatchSize = 50;

export async function getShopwareCmsGridProducts(
  client: ShopwareClient,
  productIds: readonly string[],
): Promise<ShopProductListing> {
  const batches: ShopProductListing[] = [];

  for (let start = 0; start < productIds.length; start += productBatchSize) {
    batches.push(
      await getShopwareWishlistProducts(
        client,
        productIds.slice(start, start + productBatchSize),
      ),
    );
  }

  const firstBatch = batches[0];
  if (!firstBatch) {
    throw new Error("CMS product grid requires at least one product ID.");
  }

  return {
    ...firstBatch,
    products: batches.flatMap((batch) => batch.products),
  };
}
