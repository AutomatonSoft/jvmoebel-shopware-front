import type { Metadata } from "next";

import { WishlistPage } from "@/features/wishlist/components/wishlist-page";

export const metadata: Metadata = {
  description: "Speichern Sie Ihre Möbel-Favoriten bei JVMöbel.",
  title: "Meine Wunschliste | JVMöbel",
};

export default function WishlistRoute() {
  return <WishlistPage />;
}
