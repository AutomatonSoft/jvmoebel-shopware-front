import type { Metadata } from "next";

import { ErrorExperience } from "@/features/storefront-shell/components/error-experience";
import { DiscountOffersPage } from "@/features/offers/components/discount-offers-page";
import { getShopProductListing } from "@/features/catalog/server/product-listing";

export const metadata: Metadata = {
  description: "Entdecke reduzierte Möbel und Wohnaccessoires im JVMöbel Sale.",
  title: "Möbel Sale & Rabattangebote | JVMöbel",
};

export default async function OffersPage() {
  const listing = await getShopProductListing();

  if (!listing) {
    return (
      <ErrorExperience
        code="SALE"
        description="Die Angebotsdaten werden momentan für den neuen Shop vorbereitet. Sobald die reduzierten Produkte freigegeben sind, erscheinen sie automatisch auf dieser Seite."
        eyebrow="Angebote werden vorbereitet"
        showShopLink={false}
        title="Unser Sale ist bald für Sie verfügbar."
      />
    );
  }

  return <DiscountOffersPage listing={listing} />;
}
