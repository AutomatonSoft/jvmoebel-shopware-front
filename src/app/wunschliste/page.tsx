import type { Metadata } from "next";

import { WishlistPage } from "@/features/wishlist/components/wishlist-page";

export const metadata: Metadata = {
  description: "Speichern Sie Ihre Moebel-Favoriten bei JVMoebel.",
  title: "Meine Wunschliste | JVMoebel",
};

export default function WishlistRoute() {
  return <WishlistPage />;
}
