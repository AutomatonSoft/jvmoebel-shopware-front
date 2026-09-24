import "server-only";

import { connection } from "next/server";

import type { CmsProductGridData } from "@/features/cms/contracts/product-grid";
import { shouldUseShopwareMocks } from "@/integrations/shopware/mock-mode";
import { getShopwareProductCardData } from "@/integrations/shopware/product-detail";
import { getShopwareRequestSession } from "@/integrations/shopware/session";

export async function getLiveCmsProductGrid(
  data: CmsProductGridData,
): Promise<CmsProductGridData> {
  if (shouldUseShopwareMocks()) {
    return data;
  }

  await connection();
  const client = getShopwareRequestSession().client;
  const results = await Promise.allSettled(
    data.products.map((product) =>
      getShopwareProductCardData(client, product.id),
    ),
  );
  const products = results.flatMap((result, index) => {
    const source = data.products[index];

    if (result.status === "rejected" || !result.value) {
      console.error("Could not load live CMS product.", {
        productId: source.id,
        cause:
          result.status === "rejected" && result.reason instanceof Error
            ? result.reason.message
            : "Product unavailable",
      });

      return [];
    }

    const { product } = result.value;

    return [
      {
        ...source,
        badge: product.badge,
        image: product.image,
        name: product.name,
        previousPrice: product.previousPrice,
        rating: product.rating,
        reviewCount: product.reviewCount,
        unitPrice: product.unitPrice,
        url: product.url,
      },
    ];
  });
  const firstLoadedPage = results.find(
    (result) => result.status === "fulfilled" && result.value,
  );

  return {
    ...data,
    currency:
      firstLoadedPage?.status === "fulfilled" && firstLoadedPage.value
        ? firstLoadedPage.value.currency
        : data.currency,
    locale:
      firstLoadedPage?.status === "fulfilled" && firstLoadedPage.value
        ? firstLoadedPage.value.locale
        : data.locale,
    products,
  };
}
