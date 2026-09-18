"use client";

import { useEffect, useState } from "react";

import type { ShopProductListing } from "@/features/catalog/model/product-listing";

type WishlistRecommendationsRequest = Readonly<{
  productIdsKey: string;
  response?: ShopProductListing;
  status: "idle" | "loading" | "success" | "error";
}>;

const initialRequest: WishlistRecommendationsRequest = {
  productIdsKey: "",
  status: "idle",
};

export function useWishlistRecommendations(
  productIds: readonly string[],
  isWishlistReady: boolean,
) {
  const [request, setRequest] =
    useState<WishlistRecommendationsRequest>(initialRequest);
  const productIdsKey = productIds.join("|");

  useEffect(() => {
    if (!isWishlistReady) {
      return;
    }

    const controller = new AbortController();

    async function loadWishlistRecommendations() {
      setRequest({ productIdsKey, status: "loading" });

      try {
        const response = await fetch("/bff/wishlist/recommendations", {
          body: JSON.stringify({ productIds }),
          cache: "no-store",
          headers: { "Content-Type": "application/json" },
          method: "POST",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Wishlist recommendations request failed.");
        }

        const data = (await response.json()) as ShopProductListing;

        if (!controller.signal.aborted) {
          setRequest({ productIdsKey, response: data, status: "success" });
        }
      } catch (error) {
        if (
          controller.signal.aborted ||
          (error instanceof DOMException && error.name === "AbortError")
        ) {
          return;
        }

        setRequest({ productIdsKey, status: "error" });
      }
    }

    void loadWishlistRecommendations();

    return () => controller.abort();
  }, [isWishlistReady, productIds, productIdsKey]);

  const hasCurrentResponse = request.productIdsKey === productIdsKey;

  return {
    isLoading:
      isWishlistReady && (!hasCurrentResponse || request.status === "loading"),
    listing: hasCurrentResponse ? request.response : undefined,
  };
}
