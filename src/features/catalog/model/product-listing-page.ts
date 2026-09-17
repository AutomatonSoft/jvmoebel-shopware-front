import type { ShopProductFilterOptions } from "@/features/catalog/model/filter-options";
import type {
  ShopProductFilters,
  ShopProductSort,
} from "@/features/catalog/model/filter-products";
import { productsPerPage } from "@/features/catalog/model/paginate-products";
import type { ShopProductListing } from "@/features/catalog/model/product-listing";

export const shopProductPageSize = productsPerPage;

export type ShopProductPageRequest = Readonly<{
  categoryIds: readonly string[];
  companyIds: readonly string[];
  maximumPrice?: number;
  minimumPrice?: number;
  page: number;
  propertyGroups: Readonly<Record<string, readonly string[]>>;
  propertyIds: readonly string[];
  sort: ShopProductSort;
}>;

export const defaultShopProductPageRequest = {
  categoryIds: [],
  companyIds: [],
  page: 1,
  propertyGroups: {},
  propertyIds: [],
  sort: "featured",
} satisfies ShopProductPageRequest;

export type ShopProductListingPage = ShopProductListing &
  Readonly<{
    filterOptions: ShopProductFilterOptions;
    filters: ShopProductFilters;
    pagination: Readonly<{
      currentPage: number;
      pageSize: number;
      totalPages: number;
      totalProducts: number;
    }>;
    priceRange: Readonly<{
      maximum: number;
      minimum: number;
    }>;
    sort: ShopProductSort;
  }>;
