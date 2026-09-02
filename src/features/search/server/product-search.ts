import "server-only";

import { shopProductListingMock } from "@/features/catalog/fixtures/product-listing";
import type { ShopProduct } from "@/features/catalog/model/product-listing";
import type {
  ProductSearchResponse,
  ProductSearchResult,
} from "@/features/search/model/product-search";
import { getShopwareProductSearch } from "@/integrations/shopware/product-search";
import { shouldUseShopwareMocks } from "@/integrations/shopware/mock-mode";
import { getShopwareRequestSession } from "@/integrations/shopware/session";

const MAX_SEARCH_RESULTS = 5;

function toProductSearchResult(product: ShopProduct): ProductSearchResult {
  return {
    categoryLabel: product.categoryLabel,
    description: product.description,
    id: product.id,
    image: product.image,
    name: product.name,
    unitPrice: product.unitPrice,
    url: product.url,
  };
}

function searchMockProducts(query: string): ProductSearchResponse {
  const normalizedQuery = query.toLocaleLowerCase();
  const results = shopProductListingMock.products
    .filter((product) =>
      [
        product.name,
        product.description,
        product.categoryLabel,
        product.company,
        product.material,
        ...product.colors.map((color) => color.label),
      ].some((value) => value.toLocaleLowerCase().includes(normalizedQuery)),
    )
    .slice(0, MAX_SEARCH_RESULTS)
    .map(toProductSearchResult);

  return {
    currency: shopProductListingMock.currency,
    locale: shopProductListingMock.locale,
    results,
  };
}

export async function searchProducts(query: string) {
  const normalizedQuery = query.trim().slice(0, 100);

  if (!normalizedQuery) {
    throw new Error("A search query is required.");
  }

  if (shouldUseShopwareMocks()) {
    return searchMockProducts(normalizedQuery);
  }

  return getShopwareProductSearch(
    getShopwareRequestSession().client,
    normalizedQuery,
    MAX_SEARCH_RESULTS,
  );
}
