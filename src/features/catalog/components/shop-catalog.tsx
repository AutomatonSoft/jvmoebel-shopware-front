"use client";

import { Dialog } from "@base-ui/react/dialog";
import { SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import { useSyncExternalStore } from "react";

import { ProductFilterPanel } from "@/features/catalog/components/product-filter-panel";
import { ProductQuickFilters } from "@/features/catalog/components/product-quick-filters";
import { ShopProductResults } from "@/features/catalog/components/product-results";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCatalogState } from "@/features/catalog/hooks/use-catalog-state";
import { useLocalCatalogState } from "@/features/catalog/hooks/use-local-catalog-state";
import type { ProductFilterOption } from "@/features/catalog/model/filter-options";
import type { ShopProductSort } from "@/features/catalog/model/filter-products";
import type { ShopProductListing } from "@/features/catalog/model/product-listing";
import type { ShopProductListingPage } from "@/features/catalog/model/product-listing-page";

const desktopCatalogQuery = "(min-width: 64rem)";

function subscribeToDesktopCatalog(onChange: () => void) {
  const mediaQuery = window.matchMedia(desktopCatalogQuery);

  mediaQuery.addEventListener("change", onChange);

  return () => mediaQuery.removeEventListener("change", onChange);
}

function getDesktopCatalogSnapshot() {
  return window.matchMedia(desktopCatalogQuery).matches;
}

function getServerDesktopCatalogSnapshot() {
  return false;
}

export type ShopCatalogProps = {
  breadcrumbLabel?: string;
  description?: string;
  eyebrow?: string;
  hideHeader?: boolean;
  isLoading?: boolean;
  initialCategory?: Pick<ProductFilterOption, "label" | "value">;
  listing: ShopProductListing;
  showQuickFilters?: boolean;
  title?: string;
};

export function ShopCatalog({
  hideHeader = false,
  initialCategory,
  isLoading = false,
  listing,
}: ShopCatalogProps) {
  const catalogState = useLocalCatalogState(listing.products, initialCategory);

  return (
    <ShopCatalogContent
      catalogState={catalogState}
      hideHeader={hideHeader}
      isLoading={isLoading}
      listing={listing}
    />
  );
}

export function ShopProductListingCatalog({
  breadcrumbLabel,
  description,
  eyebrow,
  hideHeader = false,
  isLoading = false,
  listing,
  showQuickFilters = false,
  title,
}: Omit<ShopCatalogProps, "initialCategory" | "listing"> & {
  listing: ShopProductListingPage;
}) {
  const catalogState = useCatalogState(listing);

  return (
    <ShopCatalogContent
      catalogState={catalogState}
      breadcrumbLabel={breadcrumbLabel}
      description={description}
      eyebrow={eyebrow}
      hideHeader={hideHeader}
      isLoading={isLoading}
      listing={listing}
      showQuickFilters={showQuickFilters}
      title={title}
    />
  );
}

function ShopCatalogContent({
  breadcrumbLabel,
  catalogState,
  description,
  eyebrow,
  hideHeader,
  isLoading,
  listing,
  showQuickFilters = false,
  title,
}: {
  breadcrumbLabel?: string;
  catalogState: ReturnType<typeof useCatalogState>;
  description?: string;
  eyebrow?: string;
  hideHeader: boolean;
  isLoading: boolean;
  listing: ShopProductListing;
  showQuickFilters?: boolean;
  title?: string;
}) {
  const isDesktopCatalog = useSyncExternalStore(
    subscribeToDesktopCatalog,
    getDesktopCatalogSnapshot,
    getServerDesktopCatalogSnapshot,
  );
  const {
    clearFilters,
    filterPanelProps,
    isLoading: isCatalogLoading,
    paginationProps,
    products,
    setSort,
    sort,
  } = catalogState;
  const { activeFilterCount } = filterPanelProps;
  const loading = isLoading || isCatalogLoading;

  return (
    <Container className="pb-20 sm:pb-28">
      {!hideHeader && (
        <>
          <nav
            aria-label="Navigationspfad"
            className="flex items-center gap-2.5 pt-6 text-[0.625rem] text-muted-foreground"
          >
            <Link className="transition-colors hover:text-primary" href="/">
              Startseite
            </Link>
            <span aria-hidden="true">/</span>
            <strong className="font-medium text-foreground">
              {breadcrumbLabel ?? "Sortiment"}
            </strong>
          </nav>

          <PageHeader
            aside={
              <p className="max-w-md text-sm leading-6 text-muted-foreground sm:text-right">
                {description ?? listing.description}
              </p>
            }
            className="pt-6"
            eyebrow={eyebrow ?? listing.eyebrow}
            title={title ?? listing.title}
          />
        </>
      )}

      {showQuickFilters && (
        <ProductQuickFilters
          {...filterPanelProps}
          currency={listing.currency}
          locale={listing.locale}
        />
      )}

      <div
        className={`grid gap-8 lg:grid-cols-[13.75rem_minmax(0,1fr)] lg:gap-10 xl:gap-12 ${showQuickFilters ? "pt-4" : "pt-6"}`}
      >
        <aside className="sticky top-24 hidden max-h-[calc(100dvh-7rem)] self-start overflow-y-auto rounded-xl border bg-card/70 p-4 scrollbar-width:none lg:block [&::-webkit-scrollbar]:hidden">
          {isDesktopCatalog && <ProductFilterPanel {...filterPanelProps} />}
        </aside>

        <section aria-label="Produktliste" className="min-w-0">
          <div className="mb-6 flex items-center justify-between gap-3">
            <span className="text-xs font-medium text-muted-foreground">
              {paginationProps.totalProducts} Produkte
            </span>
            {!isDesktopCatalog && (
              <Dialog.Root>
                <Dialog.Trigger
                  render={
                    <Button
                      className="lg:hidden"
                      size="sm"
                      variant="secondary"
                    />
                  }
                >
                  <SlidersHorizontal className="size-4" />
                  Filter
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
                            Filter
                          </Dialog.Title>
                          <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                            Moebelkollektion eingrenzen.
                          </Dialog.Description>
                        </div>
                        <Dialog.Close
                          aria-label="Filter schließen"
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
                          {paginationProps.totalProducts}{" "}
                          {paginationProps.totalProducts === 1
                            ? "Produkt anzeigen"
                            : "Produkte anzeigen"}
                        </Dialog.Close>
                      </div>
                    </Dialog.Popup>
                  </Dialog.Viewport>
                </Dialog.Portal>
              </Dialog.Root>
            )}

            <div className="ml-auto flex items-center gap-2 text-xs">
              <span className="hidden text-muted-foreground sm:inline">
                Sortieren nach
              </span>
              <Select
                onValueChange={(value) => setSort(value as ShopProductSort)}
                value={sort}
              >
                <SelectTrigger
                  aria-label="Produkte sortieren"
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
                    Empfohlen
                  </SelectItem>
                  <SelectItem
                    className="cursor-pointer py-2 text-xs"
                    value="newest"
                  >
                    Neuheiten
                  </SelectItem>
                  <SelectItem
                    className="cursor-pointer py-2 text-xs"
                    value="price-ascending"
                  >
                    Preis: aufsteigend
                  </SelectItem>
                  <SelectItem
                    className="cursor-pointer py-2 text-xs"
                    value="price-descending"
                  >
                    Preis: absteigend
                  </SelectItem>
                  <SelectItem
                    className="cursor-pointer py-2 text-xs"
                    value="rating"
                  >
                    Beste Bewertung
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <ShopProductResults
            currency={listing.currency}
            isLoading={loading}
            locale={listing.locale}
            onClearFilters={clearFilters}
            paginationProps={paginationProps}
            products={products}
          />
        </section>
      </div>
    </Container>
  );
}
