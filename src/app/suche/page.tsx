import type { Metadata } from "next";
import { redirect } from "next/navigation";

import {
  getProductPageRequest,
  type ProductListingSearchParams,
} from "@/app/_lib/product-listing-search-params";
import { ShopProductListingCatalog } from "@/features/catalog/components/shop-catalog";
import { getShopProductListingPage } from "@/features/catalog/server/product-listing";

type SearchPageProps = Readonly<{
  searchParams: Promise<ProductListingSearchParams>;
}>;

function getQuery(parameters: ProductListingSearchParams) {
  const value = Array.isArray(parameters.query)
    ? parameters.query[0]
    : parameters.query;

  return value?.trim().slice(0, 100) ?? "";
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
