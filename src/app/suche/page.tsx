import type { Metadata, Route } from "next";
import { redirect } from "next/navigation";

import {
  getProductPageRequest,
  type ProductListingSearchParams,
} from "@/app/_lib/product-listing-search-params";
import { ShopProductListingCatalog } from "@/features/catalog/components/shop-catalog";
import { getShopProductListingPage } from "@/features/catalog/server/product-listing";
import { findExactSearchCategory } from "@/features/search/model/match-search-category";

type SearchPageProps = Readonly<{
  searchParams: Promise<ProductListingSearchParams>;
}>;

function getQuery(parameters: ProductListingSearchParams) {
  const value = Array.isArray(parameters.query)
    ? parameters.query[0]
    : parameters.query;

  return value?.trim().slice(0, 100) ?? "";
}

function hasSelectedCategory(parameters: ProductListingSearchParams) {
  return Array.isArray(parameters.category)
    ? parameters.category.length > 0
    : Boolean(parameters.category);
}

function getCategoryRedirectUrl(
  parameters: ProductListingSearchParams,
  categoryId: string,
) {
  const redirectParameters = new URLSearchParams();

  Object.entries(parameters).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((entry) => redirectParameters.append(key, entry));
    } else if (value) {
      redirectParameters.set(key, value);
    }
  });
  redirectParameters.set("category", categoryId);
  redirectParameters.delete("categoryLabel");
  redirectParameters.delete("page");

  return `/suche?${redirectParameters.toString()}` as Route;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const query = getQuery(await searchParams);

  return {
    description: query
      ? `Suchergebnisse für ${query} bei JVMoebel.`
      : "Produkte bei JVMoebel suchen.",
    robots: { follow: true, index: false },
    title: query ? `${query} | Suche | JVMoebel` : "Suche | JVMoebel",
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const parameters = await searchParams;
  const query = getQuery(parameters);

  if (!query) redirect("/moebel-sortiment");

  const listing = await getShopProductListingPage(
    getProductPageRequest({ ...parameters, query }),
  );
  const matchingCategory = hasSelectedCategory(parameters)
    ? undefined
    : findExactSearchCategory(query, listing.filterOptions.categories);

  if (matchingCategory) {
    redirect(getCategoryRedirectUrl(parameters, matchingCategory.value));
  }

  return (
    <main className="flex-1">
      <ShopProductListingCatalog
        breadcrumbLabel="Suche"
        description={`${listing.pagination.totalProducts} Produkte gefunden.`}
        eyebrow="Suchergebnisse"
        listing={listing}
        showQuickFilters
        title={`„${query}“`}
      />
    </main>
  );
}
