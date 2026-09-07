import "server-only";

import type { components } from "@shopware/api-client/store-api-types";

import type { ProductSearchResponse } from "@/features/search/model/product-search";
import type { ShopwareClient } from "@/integrations/shopware/client";
import { getShopwareContext } from "@/integrations/shopware/context";
import { mapShopwareProductSearchResult } from "@/integrations/shopware/mappers/product-search";

const productSearchAssociations = {
  categories: {},
  cover: { associations: { media: {} } },
} satisfies components["schemas"]["Associations"];

export async function getShopwareProductSearch(
  client: ShopwareClient,
  query: string,
  limit: number,
): Promise<ProductSearchResponse> {
  const [context, response] = await Promise.all([
    getShopwareContext(client),
    client.invoke("searchSuggest post /search-suggest", {
      body: {
        associations: productSearchAssociations,
        limit,
        search: query,
      },
      fetchOptions: { cache: "no-store" },
    }),
  ]);

  return {
    currency: context.currency?.isoCode || "EUR",
    locale: context.languageInfo.localeCode || "en-US",
    results: response.data.elements
      .slice(0, limit)
      .map(mapShopwareProductSearchResult),
  };
}
