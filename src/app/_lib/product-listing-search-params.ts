import type { ShopProductSort } from "@/features/catalog/model/filter-products";
import type { ShopProductPageRequest } from "@/features/catalog/model/product-listing-page";

export type ProductListingSearchParams = Readonly<{
  category?: string | string[];
  categoryLabel?: string | string[];
  manufacturer?: string | string[];
  maxPrice?: string | string[];
  minPrice?: string | string[];
  page?: string | string[];
  property?: string | string[];
  query?: string | string[];
  sort?: string | string[];
}>;

function getFirstParameter(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function getParameterValues(value?: string | string[]) {
  return (Array.isArray(value) ? value : value ? [value] : []).flatMap(
    (entry) => entry.split(",").filter(Boolean),
  );
}

function getPropertySelection(value?: string | string[]) {
  const propertyIds: string[] = [];
  const propertyGroups: Record<string, string[]> = {};

  for (const entry of getParameterValues(value)) {
    const separatorIndex = entry.indexOf(":");

    if (separatorIndex <= 0 || separatorIndex === entry.length - 1) {
      propertyIds.push(entry);
      continue;
    }

    const groupId = entry.slice(0, separatorIndex);
    const propertyId = entry.slice(separatorIndex + 1);

    propertyIds.push(propertyId);
    propertyGroups[groupId] = [...(propertyGroups[groupId] ?? []), propertyId];
  }

  return { propertyGroups, propertyIds };
}

function getPositiveInteger(value?: string | string[]) {
  const number = Number(getFirstParameter(value));

  return Number.isInteger(number) && number > 0 ? number : 1;
}

function getOptionalPrice(value?: string | string[]) {
  const number = Number(getFirstParameter(value));

  return Number.isFinite(number) && number >= 0 ? number : undefined;
}

function getProductSort(value?: string | string[]): ShopProductSort {
  const sort = getFirstParameter(value);

  return [
    "featured",
    "newest",
    "price-ascending",
    "price-descending",
    "rating",
  ].includes(sort ?? "")
    ? (sort as ShopProductSort)
    : "featured";
}

export function getProductPageRequest(
  parameters: ProductListingSearchParams,
): ShopProductPageRequest {
  const { propertyGroups, propertyIds } = getPropertySelection(
    parameters.property,
  );

  return {
    categoryIds: getParameterValues(parameters.category),
    companyIds: getParameterValues(parameters.manufacturer),
    maximumPrice: getOptionalPrice(parameters.maxPrice),
    minimumPrice: getOptionalPrice(parameters.minPrice),
    page: getPositiveInteger(parameters.page),
    propertyGroups,
    propertyIds,
    search:
      getFirstParameter(parameters.query)?.trim().slice(0, 100) || undefined,
    sort: getProductSort(parameters.sort),
  };
}
