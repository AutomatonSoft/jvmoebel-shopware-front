import "server-only";

import { shopProductListingMock } from "@/features/catalog/fixtures/product-listing";
import { buildShopProductFilterOptions } from "@/features/catalog/model/filter-options";
import { filterAndSortShopProducts } from "@/features/catalog/model/filter-products";
import type { ShopProductListing } from "@/features/catalog/model/product-listing";
import type {
  ShopProductListingPage,
  ShopProductPageRequest,
} from "@/features/catalog/model/product-listing-page";
import { shopProductPageSize } from "@/features/catalog/model/product-listing-page";
import { paginateProducts } from "@/features/catalog/model/paginate-products";
import { shouldUseShopwareMocks } from "@/integrations/shopware/mock-mode";
import {
  getShopwareProductListing,
  getShopwareProductListingPage,
} from "@/integrations/shopware/product-listing";
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

function getMockProductListingPage(
  request: ShopProductPageRequest,
): ShopProductListingPage {
  const prices = shopProductListingMock.products.map(
    (product) => product.unitPrice,
  );
  const minimumPriceBound = Math.floor(Math.min(...prices) / 10) * 10;
  const maximumPriceBound = Math.ceil(Math.max(...prices) / 10) * 10;
  const selectedPropertyIds = new Set(request.propertyIds);
  const attributes = Object.fromEntries(
    buildShopProductFilterOptions(
      shopProductListingMock.products,
    ).attributeGroups.flatMap((group) => {
      const selectedOptions = group.options
        .filter((option) => selectedPropertyIds.has(option.value))
        .map((option) => option.value);

      return selectedOptions.length > 0 ? [[group.id, selectedOptions]] : [];
    }),
  );
  const filters = {
    attributes,
    categories: request.categoryIds,
    companies: request.companyIds,
    maximumPrice: request.maximumPrice ?? maximumPriceBound,
    minimumPrice: request.minimumPrice ?? minimumPriceBound,
  };
  const filteredProducts = filterAndSortShopProducts(
    shopProductListingMock.products,
    filters,
    request.sort,
  );
  const pagination = paginateProducts(filteredProducts, request.page);

  return {
    ...shopProductListingMock,
    filterOptions: buildShopProductFilterOptions(
      shopProductListingMock.products,
      filters,
    ),
    filters,
    pagination: {
      currentPage: pagination.currentPage,
      pageSize: shopProductPageSize,
      totalPages: pagination.totalPages,
      totalProducts: pagination.totalProducts,
    },
    priceRange: {
      maximum: maximumPriceBound,
      minimum: minimumPriceBound,
    },
    products: pagination.products,
    sort: request.sort,
  };
}

export async function getShopProductListingPage(
  request: ShopProductPageRequest,
): Promise<ShopProductListingPage> {
  if (shouldUseShopwareMocks()) {
    return getMockProductListingPage(request);
  }

  return getShopwareProductListingPage(
    getShopwareRequestSession().client,
    request,
  );
}
