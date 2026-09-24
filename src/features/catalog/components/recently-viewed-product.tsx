"use client";

import { useEffect } from "react";

import { rememberRecentlyViewedProduct } from "@/features/catalog/hooks/recently-viewed-products";

export function RecentlyViewedProduct({
  productId,
}: Readonly<{ productId: string }>) {
  useEffect(() => {
    rememberRecentlyViewedProduct({ id: productId });
  }, [productId]);

  return null;
}
