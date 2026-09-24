import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";

import { shopProductDetailsMock } from "@/features/catalog/fixtures/product-detail";
import { shopProductListingMock } from "@/features/catalog/fixtures/product-listing";
import type { ShopProductPageData } from "@/features/catalog/model/product-detail";
import {
  shopwareCacheLife,
  shopwareCacheTtlSeconds,
} from "@/integrations/shopware/cache-policy";
import { shouldUseShopwareMocks } from "@/integrations/shopware/mock-mode";
import { getShopwareProductDetail } from "@/integrations/shopware/product-detail";
import { getShopwareRequestSession } from "@/integrations/shopware/session";

async function getCachedShopwareProductPageData(productId: string) {
  "use cache";
  cacheLife(shopwareCacheLife(shopwareCacheTtlSeconds.productDetail));
  cacheTag("shopware:catalog");

  return getShopwareProductDetail(
    getShopwareRequestSession().client,
    productId,
  );
}

export const getShopProductPageData = cache(
  async (productId: string): Promise<ShopProductPageData | null> => {
    if (!shouldUseShopwareMocks()) {
      return getCachedShopwareProductPageData(productId);
    }

    const product = shopProductDetailsMock.find(
      (candidate) => candidate.id === productId,
    );

    if (!product) {
      return null;
    }

    const relatedProducts = shopProductListingMock.products
      .filter((candidate) => candidate.id !== product.id)
      .toSorted((first, second) => {
        const firstMatchesCategory = first.category === product.category;
        const secondMatchesCategory = second.category === product.category;

        if (firstMatchesCategory !== secondMatchesCategory) {
          return firstMatchesCategory ? -1 : 1;
        }

        return first.featuredRank - second.featuredRank;
      })
      .slice(0, 5);

    return {
      currency: shopProductListingMock.currency,
      locale: shopProductListingMock.locale,
      product,
      relatedProducts,
    };
  },
);
