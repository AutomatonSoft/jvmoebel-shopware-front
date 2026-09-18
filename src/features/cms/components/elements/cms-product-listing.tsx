import { ShopProductListingCatalog } from "@/features/catalog/components/shop-catalog";
import type { ShopProductListingPage } from "@/features/catalog/model/product-listing-page";

export function CmsProductListing({
  listing,
}: Readonly<{ listing: ShopProductListingPage }>) {
  return <ShopProductListingCatalog hideHeader listing={listing} />;
}
