import type { Metadata } from "next";

import { ShopProductListingCatalog } from "@/features/catalog/components/shop-catalog";
import type { ShopProductSort } from "@/features/catalog/model/filter-products";
import { getShopProductListingPage } from "@/features/catalog/server/product-listing";

export const metadata: Metadata = {
  description: "Entdecken Sie das Möbelsortiment von JVMöbel.",
  title: "Möbel-Sortiment | JVMöbel",
};

type FurnitureRangePageProps = Readonly<{
  searchParams: Promise<{
    category?: string | string[];
    categoryLabel?: string | string[];
    manufacturer?: string | string[];
    maxPrice?: string | string[];
    minPrice?: string | string[];
    page?: string | string[];
    property?: string | string[];
    sort?: string | string[];
  }>;
}>;

function getFirstParameter(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function getParameterValues(value?: string | string[]) {
  return (Array.isArray(value) ? value : value ? [value] : []).flatMap(
    (entry) => entry.split(",").filter(Boolean),
  );
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

export default async function FurnitureRangePage({
  searchParams,
}: FurnitureRangePageProps) {
  const parameters = await searchParams;
  const listing = await getShopProductListingPage({
    categoryIds: getParameterValues(parameters.category),
    companyIds: getParameterValues(parameters.manufacturer),
    maximumPrice: getOptionalPrice(parameters.maxPrice),
    minimumPrice: getOptionalPrice(parameters.minPrice),
    page: getPositiveInteger(parameters.page),
    propertyIds: getParameterValues(parameters.property),
    sort: getProductSort(parameters.sort),
  });

  return (
    <main className="flex-1">
      <ShopProductListingCatalog listing={listing} />
    </main>
  );
}
