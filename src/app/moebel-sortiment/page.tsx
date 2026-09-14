import type { Metadata } from "next";

import { ShopCatalog } from "@/features/catalog/components/shop-catalog";
import { getShopProductListing } from "@/features/catalog/server/product-listing";
import { ErrorExperience } from "@/features/storefront-shell/components/error-experience";

export const metadata: Metadata = {
  description: "Entdecken Sie das Möbelsortiment von JVMöbel.",
  title: "Möbel-Sortiment | JVMöbel",
};

type FurnitureRangePageProps = Readonly<{
  searchParams: Promise<{
    category?: string | string[];
    categoryLabel?: string | string[];
  }>;
}>;

export default async function FurnitureRangePage({
  searchParams,
}: FurnitureRangePageProps) {
  const [listing, parameters] = await Promise.all([
    getShopProductListing(),
    searchParams,
  ]);

  if (!listing) {
    return (
      <ErrorExperience
        code="SHOP"
        description="Die Produktdaten werden momentan für den neuen Shop vorbereitet. Sobald das Sortiment freigegeben ist, erscheint es automatisch auf dieser Seite."
        eyebrow="Shop wird vorbereitet"
        showShopLink={false}
        title="Unser Sortiment ist bald für Sie verfügbar."
      />
    );
  }

  const requestedCategory = Array.isArray(parameters.category)
    ? parameters.category[0]
    : parameters.category;
  const requestedCategoryLabel = Array.isArray(parameters.categoryLabel)
    ? parameters.categoryLabel[0]
    : parameters.categoryLabel;
  const listingCategory = requestedCategory
    ? listing.products.find((product) => product.category === requestedCategory)
    : undefined;
  const initialCategory =
    requestedCategory && (requestedCategoryLabel || listingCategory)
      ? {
          label: requestedCategoryLabel || listingCategory?.categoryLabel || "",
          value: requestedCategory,
        }
      : undefined;

  return (
    <main className="flex-1">
      <ShopCatalog
        initialCategory={initialCategory}
        key={initialCategory?.value ?? "all-products"}
        listing={listing}
      />
    </main>
  );
}
