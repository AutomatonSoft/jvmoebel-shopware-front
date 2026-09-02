import type { Metadata } from "next";

import { ShopCatalog } from "@/features/catalog/components/shop-catalog";
import { getShopProductListing } from "@/features/catalog/server/product-listing";
import { ErrorExperience } from "@/features/storefront-shell/components/error-experience";

export const metadata: Metadata = {
  description: "Browse the JVMöbel furniture collection.",
  title: "Shop | JVMöbel",
};

export default async function ShopPage() {
  const listing = await getShopProductListing();

  if (!listing) {
    return (
      <ErrorExperience
        code="SHOP"
        eyebrow="Shop wird vorbereitet"
        title="Unser Sortiment ist bald für Sie verfügbar."
        description="Die Produktdaten werden momentan für den neuen Shop vorbereitet. Sobald das Sortiment freigegeben ist, erscheint es automatisch auf dieser Seite."
        showShopLink={false}
      />
    );
  }

  return (
    <main className="flex-1">
      <ShopCatalog listing={listing} />
    </main>
  );
}
