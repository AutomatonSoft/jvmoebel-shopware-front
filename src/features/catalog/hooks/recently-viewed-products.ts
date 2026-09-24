"use client";

const recentlyViewedStorageKey = "jvmoebel:recently-viewed-products";
const maximumRecentlyViewedProducts = 12;
const recentlyViewedListeners = new Set<() => void>();

export type RecentlyViewedProduct = Readonly<{ id: string }>;

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

  return typeof product.id === "string" && product.id.trim().length > 0;
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
    const seenIds = new Set<string>();
    const products: RecentlyViewedProduct[] = [];

    if (Array.isArray(parsedValue)) {
      for (const value of parsedValue) {
        if (!isRecentlyViewedProduct(value) || seenIds.has(value.id)) continue;

        seenIds.add(value.id);
        products.push({ id: value.id });
        if (products.length === maximumRecentlyViewedProducts) break;
      }
    }

    return { products, storageValue };
  } catch {
    return { products: emptyRecentlyViewedProducts, storageValue };
  }
}

export function getRecentlyViewedProducts(): readonly RecentlyViewedProduct[] {
  const storageValue = readRecentlyViewedStorageValue();

  if (cachedRecentlyViewedSnapshot?.storageValue !== storageValue) {
    cachedRecentlyViewedSnapshot = createRecentlyViewedSnapshot(storageValue);

    const idsOnlyValue = JSON.stringify(cachedRecentlyViewedSnapshot.products);
    if (storageValue !== idsOnlyValue) {
      try {
        window.localStorage.setItem(recentlyViewedStorageKey, idsOnlyValue);
        cachedRecentlyViewedSnapshot = {
          ...cachedRecentlyViewedSnapshot,
          storageValue: idsOnlyValue,
        };
      } catch (error) {
        console.error("Recently viewed products could not be saved.", error);
      }
    }
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
  if (!isRecentlyViewedProduct(product)) return;

  const nextProducts = [
    { id: product.id },
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
