import type { Metadata } from "next";

import { getShopProductListing } from "@/features/catalog/server/product-listing";
import { ErrorExperience } from "@/features/storefront-shell/components/error-experience";
import { WishlistPage } from "@/features/wishlist/components/wishlist-page";

export const metadata: Metadata = {
  description: "Speichern Sie Ihre Möbel-Favoriten bei JVMöbel.",
  title: "Meine Wunschliste | JVMöbel",
};

export default async function WishlistRoute() {
  const listing = await getShopProductListing();

  if (!listing) {
    return (
      <ErrorExperience
        code="WUNSCHLISTE"
        description="Die Produktdaten können momentan nicht geladen werden. Bitte versuchen Sie es später erneut."
        eyebrow="Wunschliste nicht verfügbar"
        title="Ihre Auswahl kann gerade nicht angezeigt werden."
      />
    );
  }

  return <WishlistPage listing={listing} />;
}
