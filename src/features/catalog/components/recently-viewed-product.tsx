"use client";

import { useEffect } from "react";

import {
  rememberRecentlyViewedProduct,
  type RecentlyViewedProduct,
} from "@/features/catalog/hooks/recently-viewed-products";

export function RecentlyViewedProduct({
  product,
}: Readonly<{ product: RecentlyViewedProduct }>) {
  useEffect(() => {
    rememberRecentlyViewedProduct(product);
  }, [product]);

  return null;
}
