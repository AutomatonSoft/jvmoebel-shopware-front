import { parseWishlistProductIds } from "@/features/wishlist/model/wishlist";

const emptyWishlistStorageValue = "[]";
const wishlistStorageKey = "jvmoebel:wishlist-product-ids";

export const emptyWishlistProductIds: readonly string[] = [];

const emptyProductIdSet: ReadonlySet<string> = new Set();
const wishlistListeners = new Set<() => void>();

type WishlistSnapshot = Readonly<{
  productIds: readonly string[];
  productIdSet: ReadonlySet<string>;
  storageValue: string;
}>;

let cachedWishlistSnapshot: WishlistSnapshot | null = null;

function createWishlistSnapshot(storageValue: string): WishlistSnapshot {
  const productIds = parseWishlistProductIds(storageValue);

  if (productIds.length === 0) {
    return {
      productIds: emptyWishlistProductIds,
      productIdSet: emptyProductIdSet,
      storageValue,
    };
  }

  return {
    productIds,
    productIdSet: new Set(productIds),
    storageValue,
  };
}

function readWishlistStorageValue() {
  try {
    return (
      window.localStorage.getItem(wishlistStorageKey) ??
      emptyWishlistStorageValue
    );
  } catch (error) {
    console.error("Wishlist storage could not be read.", error);
    return emptyWishlistStorageValue;
  }
}

function refreshWishlistSnapshot() {
  const storageValue = readWishlistStorageValue();

  if (cachedWishlistSnapshot?.storageValue !== storageValue) {
    cachedWishlistSnapshot = createWishlistSnapshot(storageValue);
  }

  return cachedWishlistSnapshot;
}

function getWishlistSnapshot() {
  if (cachedWishlistSnapshot) {
    return cachedWishlistSnapshot;
  }

  return refreshWishlistSnapshot();
}

export function getWishlistProductIdsSnapshot(): readonly string[] | null {
  return getWishlistSnapshot().productIds;
}

export function getServerWishlistProductIdsSnapshot(): null {
  return null;
}

export function getServerWishlistItemSnapshot(): null {
  return null;
}

export function getWishlistItemSnapshot(productId: string): boolean | null {
  return getWishlistSnapshot().productIdSet.has(productId);
}

function notifyWishlistListeners() {
  wishlistListeners.forEach((listener) => listener());
}

function handleWishlistStorage(event: StorageEvent) {
  if (event.key !== null && event.key !== wishlistStorageKey) {
    return;
  }

  const storageValue =
    event.key === null
      ? emptyWishlistStorageValue
      : (event.newValue ?? emptyWishlistStorageValue);

  if (cachedWishlistSnapshot?.storageValue === storageValue) {
    return;
  }

  cachedWishlistSnapshot = createWishlistSnapshot(storageValue);
  notifyWishlistListeners();
}

export function subscribeToWishlist(onStoreChange: () => void) {
  wishlistListeners.add(onStoreChange);

  if (wishlistListeners.size === 1) {
    window.addEventListener("storage", handleWishlistStorage);
    refreshWishlistSnapshot();
  }

  return () => {
    wishlistListeners.delete(onStoreChange);

    if (wishlistListeners.size === 0) {
      window.removeEventListener("storage", handleWishlistStorage);
      cachedWishlistSnapshot = null;
    }
  };
}

function writeWishlist(productIds: readonly string[]) {
  try {
    const storageValue = JSON.stringify(productIds);

    window.localStorage.setItem(wishlistStorageKey, storageValue);
    cachedWishlistSnapshot = createWishlistSnapshot(storageValue);
    notifyWishlistListeners();
  } catch (error) {
    console.error("Wishlist storage could not be updated.", error);
  }
}

export function toggleWishlistProduct(productId: string) {
  const currentProductIds = getWishlistSnapshot().productIds;
  const nextProductIds = currentProductIds.includes(productId)
    ? currentProductIds.filter((currentId) => currentId !== productId)
    : [...currentProductIds, productId];

  writeWishlist(nextProductIds);
}
