import type { Metadata } from "next";

import {
  getProductPageRequest,
  type ProductListingSearchParams,
} from "@/app/_lib/product-listing-search-params";
import { ShopProductListingCatalog } from "@/features/catalog/components/shop-catalog";
import { getShopProductListingPage } from "@/features/catalog/server/product-listing";

export const metadata: Metadata = {
  description: "Entdecken Sie das Möbelsortiment von JVMöbel.",
  title: "Möbel-Sortiment | JVMöbel",
};

type FurnitureRangePageProps = Readonly<{
  searchParams: Promise<ProductListingSearchParams>;
}>;

export default async function FurnitureRangePage({
  searchParams,
}: FurnitureRangePageProps) {
  const parameters = await searchParams;
  const listing = await getShopProductListingPage(
    getProductPageRequest(parameters),
  );

  return (
    <main className="flex-1">
      <ShopProductListingCatalog listing={listing} />
    </main>
  );
}
