"use client";

import { useEffect, useState } from "react";

import type { ShopProductListing } from "@/features/catalog/model/product-listing";

type WishlistProductsRequest = Readonly<{
  errorMessage?: string;
  productIdsKey: string;
  response?: ShopProductListing;
  status: "idle" | "loading" | "success" | "error";
}>;

const initialRequest: WishlistProductsRequest = {
  productIdsKey: "",
  status: "idle",
};

export function useWishlistProducts(
  productIds: readonly string[],
  isWishlistReady: boolean,
) {
  const [request, setRequest] =
    useState<WishlistProductsRequest>(initialRequest);
  const productIdsKey = productIds.join("|");

  useEffect(() => {
    if (!isWishlistReady || productIds.length === 0) {
      return;
    }

    const controller = new AbortController();

    async function loadWishlistProducts() {
      setRequest({ productIdsKey, status: "loading" });

      try {
        const response = await fetch("/bff/wishlist/products", {
          body: JSON.stringify({ productIds }),
          cache: "no-store",
          headers: { "Content-Type": "application/json" },
          method: "POST",
          signal: controller.signal,
        });

        if (!response.ok) throw new Error("Wishlist products request failed.");

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

        setRequest({
          errorMessage:
            "Die Wunschliste konnte nicht geladen werden. Bitte versuchen Sie es erneut.",
          productIdsKey,
          status: "error",
        });
      }
    }

    void loadWishlistProducts();

    return () => controller.abort();
  }, [isWishlistReady, productIds, productIdsKey]);

  const hasCurrentResponse = request.productIdsKey === productIdsKey;

  return {
    errorMessage:
      hasCurrentResponse && request.status === "error"
        ? request.errorMessage
        : undefined,
    isLoading:
      isWishlistReady &&
      productIds.length > 0 &&
      (!hasCurrentResponse || request.status === "loading"),
    listing: hasCurrentResponse ? request.response : undefined,
  };
}
