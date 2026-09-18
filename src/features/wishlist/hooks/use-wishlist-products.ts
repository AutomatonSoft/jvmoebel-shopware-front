"use client";

import { useEffect, useMemo, useState } from "react";

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
      setRequest((currentRequest) => ({
        productIdsKey,
        response: currentRequest.response,
        status: "loading",
      }));

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

        setRequest((currentRequest) => ({
          errorMessage:
            "Die Wunschliste konnte nicht geladen werden. Bitte versuchen Sie es erneut.",
          productIdsKey,
          response: currentRequest.response,
          status: "error",
        }));
      }
    }

    void loadWishlistProducts();

    return () => controller.abort();
  }, [isWishlistReady, productIds, productIdsKey]);

  const listing = useMemo(() => {
    if (!request.response) {
      return undefined;
    }

    const visibleProductIds = new Set(productIds);

    return {
      ...request.response,
      products: request.response.products.filter((product) =>
        visibleProductIds.has(product.id),
      ),
    };
  }, [productIds, request.response]);
  const hasCurrentRequest = request.productIdsKey === productIdsKey;

  return {
    errorMessage:
      hasCurrentRequest && request.status === "error" && !listing
        ? request.errorMessage
        : undefined,
    isLoading:
      isWishlistReady &&
      productIds.length > 0 &&
      !listing &&
      request.status !== "error",
    listing,
  };
}
