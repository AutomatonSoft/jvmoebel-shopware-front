"use client";

import type { ShopProduct } from "@/features/catalog/model/product-listing";

const recentlyViewedStorageKey = "jvmoebel:recently-viewed-products";
const maximumRecentlyViewedProducts = 12;
const recentlyViewedListeners = new Set<() => void>();

export type RecentlyViewedProduct = Pick<
  ShopProduct,
  | "badge"
  | "colors"
  | "company"
  | "id"
  | "image"
  | "name"
  | "previousPrice"
  | "rating"
  | "reviewCount"
  | "unitPrice"
  | "url"
>;

const emptyRecentlyViewedProducts: readonly RecentlyViewedProduct[] = [];

type RecentlyViewedSnapshot = Readonly<{
  products: readonly RecentlyViewedProduct[];
  storageValue: string;
}>;

let cachedRecentlyViewedSnapshot: RecentlyViewedSnapshot | null = null;

function isRecentlyViewedProduct(
  value: unknown,
): value is RecentlyViewedProduct {
  if (!value || typeof value !== "object") return false;

  const product = value as Partial<RecentlyViewedProduct>;

  return (
    typeof product.id === "string" &&
    typeof product.name === "string" &&
    typeof product.company === "string" &&
    typeof product.unitPrice === "number" &&
    typeof product.url === "string" &&
    Boolean(
      product.image &&
      typeof product.image.alt === "string" &&
      typeof product.image.url === "string",
    )
  );
}

function readRecentlyViewedStorageValue() {
  try {
    return window.localStorage.getItem(recentlyViewedStorageKey) ?? "[]";
  } catch (error) {
    console.error("Recently viewed products could not be read.", error);
    return "[]";
  }
}

function createRecentlyViewedSnapshot(
  storageValue: string,
): RecentlyViewedSnapshot {
  try {
    const parsedValue: unknown = JSON.parse(storageValue);
    const products = Array.isArray(parsedValue)
      ? parsedValue
          .filter(isRecentlyViewedProduct)
          .slice(0, maximumRecentlyViewedProducts)
      : emptyRecentlyViewedProducts;

    return { products, storageValue };
  } catch {
    return { products: emptyRecentlyViewedProducts, storageValue };
  }
}

export function getRecentlyViewedProducts(): readonly RecentlyViewedProduct[] {
  const storageValue = readRecentlyViewedStorageValue();

  if (cachedRecentlyViewedSnapshot?.storageValue !== storageValue) {
    cachedRecentlyViewedSnapshot = createRecentlyViewedSnapshot(storageValue);
  }

  return cachedRecentlyViewedSnapshot.products;
}

export function getServerRecentlyViewedProducts(): readonly RecentlyViewedProduct[] {
  return emptyRecentlyViewedProducts;
}

function notifyRecentlyViewedListeners() {
  recentlyViewedListeners.forEach((listener) => listener());
}

function handleRecentlyViewedStorage(event: StorageEvent) {
  if (event.key === null || event.key === recentlyViewedStorageKey) {
    cachedRecentlyViewedSnapshot = null;
    notifyRecentlyViewedListeners();
  }
}

export function subscribeToRecentlyViewedProducts(listener: () => void) {
  recentlyViewedListeners.add(listener);

  if (recentlyViewedListeners.size === 1) {
    window.addEventListener("storage", handleRecentlyViewedStorage);
  }

  return () => {
    recentlyViewedListeners.delete(listener);

    if (recentlyViewedListeners.size === 0) {
      window.removeEventListener("storage", handleRecentlyViewedStorage);
    }
  };
}

export function rememberRecentlyViewedProduct(product: RecentlyViewedProduct) {
  const nextProducts = [
    product,
    ...getRecentlyViewedProducts().filter(
      (currentProduct) => currentProduct.id !== product.id,
    ),
  ].slice(0, maximumRecentlyViewedProducts);

  try {
    const storageValue = JSON.stringify(nextProducts);

    window.localStorage.setItem(recentlyViewedStorageKey, storageValue);
    cachedRecentlyViewedSnapshot = { products: nextProducts, storageValue };
    notifyRecentlyViewedListeners();
  } catch (error) {
    console.error("Recently viewed products could not be saved.", error);
  }
}
