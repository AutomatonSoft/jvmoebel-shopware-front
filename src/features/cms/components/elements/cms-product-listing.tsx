import { ShopCatalog } from "@/features/catalog/components/shop-catalog";
import type { ShopProductListing } from "@/features/catalog/model/product-listing";

export function CmsProductListing({
  listing,
}: Readonly<{ listing: ShopProductListing }>) {
  return <ShopCatalog hideHeader listing={listing} />;
}
