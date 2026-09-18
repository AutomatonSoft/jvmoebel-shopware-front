import "server-only";

import { unstable_cache } from "next/cache";
import { cache } from "react";

import { shopProductDetailsMock } from "@/features/catalog/fixtures/product-detail";
import { shopProductListingMock } from "@/features/catalog/fixtures/product-listing";
import type { ShopProductPageData } from "@/features/catalog/model/product-detail";
import { shopwareCacheTtlSeconds } from "@/integrations/shopware/cache-policy";
import { shouldUseShopwareMocks } from "@/integrations/shopware/mock-mode";
import { getShopwareProductDetail } from "@/integrations/shopware/product-detail";
import { getShopwareRequestSession } from "@/integrations/shopware/session";

const getCachedShopwareProductPageData = unstable_cache(
  (productId: string) =>
    getShopwareProductDetail(getShopwareRequestSession().client, productId),
  ["shopware-product-detail"],
  {
    revalidate: shopwareCacheTtlSeconds.productDetail,
    tags: ["shopware:catalog"],
  },
);

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
