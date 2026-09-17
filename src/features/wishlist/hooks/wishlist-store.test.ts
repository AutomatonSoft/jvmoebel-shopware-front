import { afterEach, describe, expect, test } from "bun:test";

import {
  getWishlistItemSnapshot,
  getWishlistProductIdsSnapshot,
  subscribeToWishlist,
  toggleWishlistProduct,
} from "@/features/wishlist/hooks/wishlist-store";

const originalWindowDescriptor = Object.getOwnPropertyDescriptor(
  globalThis,
  "window",
);

afterEach(() => {
  if (originalWindowDescriptor) {
    Object.defineProperty(globalThis, "window", originalWindowDescriptor);
  } else {
    Reflect.deleteProperty(globalThis, "window");
  }
});

function installBrowserWindow() {
  const storage = new Map<string, string>();
  const storageListeners = new Set<EventListenerOrEventListenerObject>();
  let storageListenerAdds = 0;
  let storageListenerRemovals = 0;
  const localStorage: Storage = {
    clear: () => storage.clear(),
    getItem: (key) => storage.get(key) ?? null,
    key: (index) => [...storage.keys()][index] ?? null,
    get length() {
      return storage.size;
    },
    removeItem: (key) => storage.delete(key),
    setItem: (key, value) => storage.set(key, value),
  };

  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      addEventListener: (
        type: string,
        listener: EventListenerOrEventListenerObject,
      ) => {
        if (type === "storage") {
          storageListenerAdds += 1;
          storageListeners.add(listener);
        }
      },
      localStorage,
      removeEventListener: (
        type: string,
        listener: EventListenerOrEventListenerObject,
      ) => {
        if (type === "storage") {
          storageListenerRemovals += 1;
          storageListeners.delete(listener);
        }
      },
    },
  });

  return {
    getStorageListenerAdds: () => storageListenerAdds,
    getStorageListenerRemovals: () => storageListenerRemovals,
  };
}

function subscribeToSelector<TSnapshot>(
  getSnapshot: () => TSnapshot,
  onChange: () => void,
) {
  let currentSnapshot = getSnapshot();

  return subscribeToWishlist(() => {
    const nextSnapshot = getSnapshot();

    if (!Object.is(currentSnapshot, nextSnapshot)) {
      currentSnapshot = nextSnapshot;
      onChange();
    }
  });
}

describe("wishlist store subscriptions", () => {
  test("notifies only the item selector whose favorite state changed", () => {
    const browser = installBrowserWindow();
    let productListChanges = 0;
    let sofaChanges = 0;
    let chairChanges = 0;
    const unsubscribeProductList = subscribeToSelector(
      getWishlistProductIdsSnapshot,
      () => {
        productListChanges += 1;
      },
    );
    const unsubscribeSofa = subscribeToSelector(
      () => getWishlistItemSnapshot("sofa-1"),
      () => {
        sofaChanges += 1;
      },
    );
    const unsubscribeChair = subscribeToSelector(
      () => getWishlistItemSnapshot("chair-2"),
      () => {
        chairChanges += 1;
      },
    );

    toggleWishlistProduct("sofa-1");

    expect(productListChanges).toBe(1);
    expect(sofaChanges).toBe(1);
    expect(chairChanges).toBe(0);
    expect(browser.getStorageListenerAdds()).toBe(1);

    unsubscribeProductList();
    unsubscribeSofa();
    unsubscribeChair();

    expect(browser.getStorageListenerRemovals()).toBe(1);
  });
});
