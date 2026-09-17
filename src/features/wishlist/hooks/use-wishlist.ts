"use client";

import { useSyncExternalStore } from "react";

import {
  emptyWishlistProductIds,
  getServerWishlistItemSnapshot,
  getServerWishlistProductIdsSnapshot,
  getWishlistItemSnapshot,
  getWishlistProductIdsSnapshot,
  subscribeToWishlist,
  toggleWishlistProduct,
} from "@/features/wishlist/hooks/wishlist-store";

export function useWishlist() {
  const productIds = useSyncExternalStore(
    subscribeToWishlist,
    getWishlistProductIdsSnapshot,
    getServerWishlistProductIdsSnapshot,
  );

  return {
    isReady: productIds !== null,
    productIds: productIds ?? emptyWishlistProductIds,
    toggleProduct: toggleWishlistProduct,
  };
}

export function useWishlistItem(productId: string) {
  const isFavorite = useSyncExternalStore<boolean | null>(
    subscribeToWishlist,
    () => getWishlistItemSnapshot(productId),
    getServerWishlistItemSnapshot,
  );

  return {
    isFavorite: isFavorite ?? false,
    isReady: isFavorite !== null,
    toggleProduct: () => toggleWishlistProduct(productId),
  };
}
