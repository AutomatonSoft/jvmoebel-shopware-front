"use client";

import { Dialog } from "@base-ui/react/dialog";
import { SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";

import { ProductFilterPanel } from "@/features/catalog/components/product-filter-panel";
import { ShopProductResults } from "@/features/catalog/components/product-results";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCatalogState } from "@/features/catalog/hooks/use-catalog-state";
import type { ProductFilterOption } from "@/features/catalog/model/filter-options";
import type { ShopProductSort } from "@/features/catalog/model/filter-products";
import type { ShopProductListing } from "@/features/catalog/model/product-listing";

export type ShopCatalogProps = {
  hideHeader?: boolean;
  initialCategory?: Pick<ProductFilterOption, "label" | "value">;
  isLoading?: boolean;
  listing: ShopProductListing;
};

export function ShopCatalog({
  hideHeader = false,
  initialCategory,
  isLoading = false,
  listing,
}: ShopCatalogProps) {
  const {
    clearFilters,
    filterPanelProps,
    paginationProps,
    products,
    setSort,
    sort,
  } = useCatalogState(listing.products, initialCategory);
  const { activeFilterCount } = filterPanelProps;

  return (
    <div className="mx-auto w-full max-w-360 px-4 pb-20 sm:px-8 sm:pb-28">
      {!hideHeader && (
        <>
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2.5 pt-6 text-[0.625rem] text-muted-foreground"
          >
            <Link className="transition-colors hover:text-primary" href="/">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <strong className="font-medium text-foreground">Shop</strong>
          </nav>

          <header className="border-b pt-9 pb-6 sm:flex sm:items-end sm:justify-between sm:gap-8">
            <div>
              <p className="mb-3 flex items-center gap-2 text-[0.625rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase before:block before:size-1.5 before:rounded-full before:bg-primary">
                {listing.eyebrow}
              </p>
              <h1 className="text-3xl leading-none font-semibold tracking-[-0.04em] text-balance sm:text-4xl">
                {listing.title}
              </h1>
            </div>
            <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground sm:mt-0 sm:text-right">
              {listing.description}
            </p>
          </header>
        </>
      )}

      <div className="grid gap-8 pt-8 lg:grid-cols-[13.75rem_minmax(0,1fr)] lg:gap-10 xl:gap-12">
        <aside className="sticky top-24 hidden max-h-[calc(100dvh-7rem)] self-start overflow-y-auto rounded-xl border bg-card/70 p-4 scrollbar-width:none lg:block [&::-webkit-scrollbar]:hidden">
          <ProductFilterPanel {...filterPanelProps} />
        </aside>

        <section aria-label="Product results" className="min-w-0">
          <div className="mb-6 flex items-center justify-between gap-3">
            <span className="text-xs font-medium text-muted-foreground">
              {paginationProps.totalProducts} Produkte
            </span>
            <Dialog.Root>
              <Dialog.Trigger
                render={
                  <Button className="lg:hidden" size="sm" variant="secondary" />
                }
              >
                <SlidersHorizontal className="size-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[0.625rem] font-bold text-primary-foreground">
                    {activeFilterCount}
                  </span>
                )}
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Backdrop className="fixed inset-0 z-60 min-h-dvh bg-foreground/45 transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-[-webkit-touch-callout:none]:absolute" />
                <Dialog.Viewport className="fixed inset-0 z-70 flex min-h-dvh justify-end">
                  <Dialog.Popup className="flex h-dvh w-[min(24rem,92vw)] flex-col rounded-l-2xl border-l bg-background shadow-2xl transition-transform ease-out data-ending-style:translate-x-full data-starting-style:translate-x-full">
                    <div className="flex items-start justify-between gap-4 border-b px-5 py-5">
                      <div>
                        <Dialog.Title className="text-2xl font-semibold tracking-tight">
                          Filters
                        </Dialog.Title>
                        <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                          Refine the furniture collection.
                        </Dialog.Description>
                      </div>
                      <Dialog.Close
                        aria-label="Close filters"
                        render={
                          <Button
                            className="rounded-full"
                            size="icon-lg"
                            type="button"
                            variant="ghost"
                          />
                        }
                      >
                        <X className="size-5" />
                      </Dialog.Close>
                    </div>
                    <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
                      <ProductFilterPanel {...filterPanelProps} />
                    </div>
                    <div className="border-t p-5">
                      <Dialog.Close
                        render={<Button className="w-full" size="lg" />}
                      >
                        Show {paginationProps.totalProducts}{" "}
                        {paginationProps.totalProducts === 1
                          ? "product"
                          : "products"}
                      </Dialog.Close>
                    </div>
                  </Dialog.Popup>
                </Dialog.Viewport>
              </Dialog.Portal>
            </Dialog.Root>

            <div className="ml-auto flex items-center gap-2 text-xs">
              <span className="hidden text-muted-foreground sm:inline">
                Sort by
              </span>
              <Select
                onValueChange={(value) => setSort(value as ShopProductSort)}
                value={sort}
              >
                <SelectTrigger
                  aria-label="Sort products"
                  className="h-10 min-w-40 cursor-pointer bg-card px-3 text-xs shadow-xs transition-[border-color,box-shadow,background-color] hover:border-primary/60 hover:bg-accent/30 data-popup-open:border-primary data-popup-open:ring-3 data-popup-open:ring-primary/15"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  align="end"
                  alignItemWithTrigger={false}
                  className="min-w-52 p-1.5"
                >
                  <SelectItem
                    className="cursor-pointer py-2 text-xs"
                    value="featured"
                  >
                    Featured
                  </SelectItem>
                  <SelectItem
                    className="cursor-pointer py-2 text-xs"
                    value="newest"
                  >
                    Newest
                  </SelectItem>
                  <SelectItem
                    className="cursor-pointer py-2 text-xs"
                    value="price-ascending"
                  >
                    Price: low to high
                  </SelectItem>
                  <SelectItem
                    className="cursor-pointer py-2 text-xs"
                    value="price-descending"
                  >
                    Price: high to low
                  </SelectItem>
                  <SelectItem
                    className="cursor-pointer py-2 text-xs"
                    value="rating"
                  >
                    Best rated
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <ShopProductResults
            currency={listing.currency}
            isLoading={isLoading}
            locale={listing.locale}
            onClearFilters={clearFilters}
            paginationProps={paginationProps}
            products={products}
          />
        </section>
      </div>
    </div>
  );
}
