"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

import {
  getRecentlyViewedProducts,
  getServerRecentlyViewedProducts,
  subscribeToRecentlyViewedProducts,
  type RecentlyViewedProduct,
} from "@/features/catalog/hooks/recently-viewed-products";
import type { ShopProductListing } from "@/features/catalog/model/product-listing";

type RecentlyViewedRequest = Readonly<{
  history: readonly RecentlyViewedProduct[];
  listing?: ShopProductListing;
  status: "success" | "error";
}>;

export function useRecentlyViewedProducts() {
  const history = useSyncExternalStore(
    subscribeToRecentlyViewedProducts,
    getRecentlyViewedProducts,
    getServerRecentlyViewedProducts,
  );
  const [request, setRequest] = useState<RecentlyViewedRequest | null>(null);

  useEffect(() => {
    if (history.length === 0) return;

    const controller = new AbortController();

    async function loadProducts() {
      try {
        const response = await fetch("/bff/wishlist/products", {
          body: JSON.stringify({ productIds: history.map(({ id }) => id) }),
          cache: "no-store",
          headers: { "Content-Type": "application/json" },
          method: "POST",
          signal: controller.signal,
        });

        if (!response.ok)
          throw new Error("Recently viewed products request failed.");

        const listing = (await response.json()) as ShopProductListing;
        if (!controller.signal.aborted) {
          setRequest({ history, listing, status: "success" });
        }
      } catch (error) {
        if (controller.signal.aborted) return;

        console.error("Recently viewed products could not be loaded.", error);
        setRequest({ history, status: "error" });
      }
    }

    void loadProducts();
    return () => controller.abort();
  }, [history]);

  if (
    request?.history !== history ||
    request.status !== "success" ||
    !request.listing
  ) {
    return undefined;
  }

  const productsById = new Map(
    request.listing.products.map((product) => [product.id, product]),
  );

  return {
    ...request.listing,
    products: history.flatMap(({ id }) => {
      const product = productsById.get(id);
      return product ? [product] : [];
    }),
  };
}
