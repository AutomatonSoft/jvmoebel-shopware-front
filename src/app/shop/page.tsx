import type { Metadata } from "next";

import { ShopCatalog } from "@/features/catalog/components/shop-catalog";
import { shopProductListingMock } from "@/lib/shopware/mocks/product-listing";

export const metadata: Metadata = {
  description: "Browse the JVMöbel furniture collection.",
  title: "Shop | JVMöbel",
};

export default function ShopPage() {
  return (
    <main className="flex-1">
      <ShopCatalog listing={shopProductListingMock} />
    </main>
  );
}
