"use client";

import { LoaderCircle, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import {
  ProductPagination,
  type ProductPaginationProps,
} from "@/features/catalog/components/product-pagination";
import { ShopProductCard } from "@/features/catalog/components/shop-product-card";
import type { ShopProduct } from "@/features/catalog/model/product-listing";

const resultScrollReleaseDelay = 700;

export type ShopProductResultsProps = {
  currency: string;
  isLoading: boolean;
  locale: string;
  onClearFilters: () => void;
  paginationProps: ProductPaginationProps;
  products: readonly ShopProduct[];
};

export function ShopProductResults({
  currency,
  isLoading,
  locale,
  onClearFilters,
  paginationProps,
  products,
}: ShopProductResultsProps) {
  const previousLoadingRef = useRef(isLoading);
  const productResultsRef = useRef<HTMLDivElement>(null);
  const resultHeightReleaseTimerRef = useRef<number>(null);

  useEffect(() => {
    const productResults = productResultsRef.current;
    const wasLoading = previousLoadingRef.current;
    previousLoadingRef.current = isLoading;

    if (!productResults) {
      return;
    }

    if (resultHeightReleaseTimerRef.current !== null) {
      window.clearTimeout(resultHeightReleaseTimerRef.current);
    }

    if (isLoading) {
      productResults.style.minHeight = `${Math.ceil(productResults.getBoundingClientRect().height)}px`;
      return;
    }

    if (!wasLoading) {
      return;
    }

    window.requestAnimationFrame(() => {
      productResults.scrollIntoView({ behavior: "smooth", block: "start" });

      resultHeightReleaseTimerRef.current = window.setTimeout(() => {
        productResults.style.removeProperty("min-height");
      }, resultScrollReleaseDelay);
    });
  }, [isLoading]);

  useEffect(
    () => () => {
      if (resultHeightReleaseTimerRef.current !== null) {
        window.clearTimeout(resultHeightReleaseTimerRef.current);
      }
    },
    [],
  );

  function changePage(page: number) {
    paginationProps.onPageChange(page);
    window.requestAnimationFrame(() => {
      productResultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  return (
    <div
      aria-busy={isLoading}
      className="relative scroll-mt-28"
      ref={productResultsRef}
    >
      {products.length > 0 ? (
        <>
          <div
            className={`grid grid-cols-2 gap-x-3 gap-y-9 transition-[opacity,filter] duration-200 md:grid-cols-3 md:gap-x-4 xl:grid-cols-4 ${isLoading ? "pointer-events-none opacity-35 saturate-50" : ""}`}
          >
            {products.map((product, index) => (
              <ShopProductCard
                currency={currency}
                eagerImage={index < 4}
                key={product.id}
                locale={locale}
                product={product}
              />
            ))}
          </div>

          <ProductPagination {...paginationProps} onPageChange={changePage} />
        </>
      ) : (
        <div
          className={`flex min-h-96 flex-col items-center justify-center rounded-2xl border border-dashed bg-card/40 px-6 text-center transition-opacity duration-200 ${isLoading ? "pointer-events-none opacity-35" : ""}`}
        >
          <span className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
            <Sparkles className="size-5 text-primary" />
          </span>
          <h2 className="text-lg font-semibold">No matching products</h2>
          <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
            Try removing one or more filters to see more furniture.
          </p>
          <Button className="mt-5" onClick={onClearFilters} variant="outline">
            Clear filters
          </Button>
        </div>
      )}

      {isLoading && (
        <div
          aria-live="polite"
          className="absolute inset-0 z-10 cursor-wait bg-background/45 backdrop-blur-[1px]"
          role="status"
        >
          <div className="sticky top-[45dvh] mx-auto flex w-fit items-center gap-3 rounded-full border bg-card px-5 py-3 text-sm font-semibold shadow-xl">
            <LoaderCircle className="size-5 animate-spin text-primary" />
            Updating products...
          </div>
        </div>
      )}
    </div>
  );
}
