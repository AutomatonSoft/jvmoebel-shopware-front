"use client";

import { useSyncExternalStore } from "react";

import { parseWishlistProductIds } from "@/features/wishlist/model/wishlist";

const emptyWishlistSnapshot = "[]";
const wishlistChangeEvent = "jvmoebel:wishlist-change";
const wishlistStorageKey = "jvmoebel:wishlist-product-ids";

function getWishlistSnapshot() {
  try {
    return (
      window.localStorage.getItem(wishlistStorageKey) ?? emptyWishlistSnapshot
    );
  } catch (error) {
    console.error("Wishlist storage could not be read.", error);
    return emptyWishlistSnapshot;
  }
}

function getServerWishlistSnapshot() {
  return null;
}

function subscribeToWishlist(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(wishlistChangeEvent, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(wishlistChangeEvent, onStoreChange);
  };
}

function writeWishlist(productIds: readonly string[]) {
  try {
    window.localStorage.setItem(wishlistStorageKey, JSON.stringify(productIds));
    window.dispatchEvent(new Event(wishlistChangeEvent));
  } catch (error) {
    console.error("Wishlist storage could not be updated.", error);
  }
}

export function useWishlist() {
  const snapshot = useSyncExternalStore(
    subscribeToWishlist,
    getWishlistSnapshot,
    getServerWishlistSnapshot,
  );
  const productIds = parseWishlistProductIds(snapshot);

  function toggleProduct(productId: string) {
    const currentProductIds = parseWishlistProductIds(getWishlistSnapshot());
    const nextProductIds = currentProductIds.includes(productId)
      ? currentProductIds.filter((currentId) => currentId !== productId)
      : [...currentProductIds, productId];

    writeWishlist(nextProductIds);
  }

  return {
    isFavorite: (productId: string) => productIds.includes(productId),
    isReady: snapshot !== null,
    productIds,
    toggleProduct,
  };
}
