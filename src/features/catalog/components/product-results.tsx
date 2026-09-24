"use client";

import { ArrowRight, PackageOpen } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import {
  ProductPagination,
  type ProductPaginationProps,
} from "@/features/catalog/components/product-pagination";
import { ShopProductCard } from "@/features/catalog/components/shop-product-card";
import type { ShopProduct } from "@/features/catalog/model/product-listing";

const resultScrollReleaseDelay = 700;
const productLayoutTransition = {
  duration: 0.28,
  ease: [0.22, 1, 0.36, 1],
} as const;

export type ShopProductResultsProps = {
  activeFilterCount: number;
  currency: string;
  isLoading: boolean;
  locale: string;
  onClearFilters: () => void;
  paginationProps: ProductPaginationProps;
  products: readonly ShopProduct[];
};

const ShopProductGrid = memo(function ShopProductGrid({
  currency,
  locale,
  products,
}: Pick<ShopProductResultsProps, "currency" | "locale" | "products">) {
  return products.map((product, index) => (
    <motion.div
      key={product.id}
      layout="position"
      transition={{ layout: productLayoutTransition }}
    >
      <ShopProductCard
        currency={currency}
        eagerImage={index < 4}
        locale={locale}
        product={product}
      />
    </motion.div>
  ));
});

export function ShopProductResults({
  activeFilterCount,
  currency,
  isLoading,
  locale,
  onClearFilters,
  paginationProps,
  products,
}: ShopProductResultsProps) {
  const pathname = usePathname();
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
            className={`grid grid-cols-2 gap-x-3 gap-y-9 md:grid-cols-3 md:gap-x-4 xl:grid-cols-4 ${isLoading ? "pointer-events-none" : ""}`}
          >
            <ShopProductGrid
              currency={currency}
              locale={locale}
              products={products}
            />
          </div>

          <ProductPagination {...paginationProps} onPageChange={changePage} />
        </>
      ) : (
        <div
          className={`flex min-h-96 flex-col items-center justify-center rounded-2xl border bg-card px-6 py-14 text-center shadow-xs transition-opacity duration-200 sm:min-h-[26rem] ${isLoading ? "pointer-events-none opacity-35" : ""}`}
        >
          <span className="mb-7 flex size-20 items-center justify-center rounded-full border border-border bg-secondary/60 shadow-[0_0_0_8px_var(--color-background)]">
            <PackageOpen
              aria-hidden="true"
              className="size-9 stroke-[1.25] text-foreground"
            />
          </span>
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            {activeFilterCount > 0
              ? "Keine passenden Produkte"
              : "Hier gibt es noch keine Produkte"}
          </h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
            {activeFilterCount > 0
              ? "Passen Sie Ihre Auswahl an, um weitere Produkte zu entdecken."
              : "Entdecken Sie in der Zwischenzeit unser weiteres Sortiment."}
          </p>
          {activeFilterCount > 0 ? (
            <Button className="mt-7" onClick={onClearFilters}>
              Filter zurücksetzen
            </Button>
          ) : (
            <Button
              className="mt-7"
              render={
                <Link
                  href={
                    pathname === "/moebel-sortiment" ? "/" : "/moebel-sortiment"
                  }
                />
              }
            >
              {pathname === "/moebel-sortiment"
                ? "Zur Startseite"
                : "Sortiment entdecken"}
              <ArrowRight aria-hidden="true" className="size-4" />
            </Button>
          )}
        </div>
      )}

      {isLoading && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10 bg-background/30 transition-opacity duration-200"
          />
          <span aria-live="polite" className="sr-only" role="status">
            Produkte werden aktualisiert...
          </span>
        </>
      )}
    </div>
  );
}
