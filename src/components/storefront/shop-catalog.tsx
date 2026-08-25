"use client";

import { Dialog } from "@base-ui/react/dialog";
import { LoaderCircle, SlidersHorizontal, Sparkles, X } from "lucide-react";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

import { ShopProductCard } from "@/components/storefront/shop-product-card";
import { buildShopProductFilterOptions } from "@/components/storefront/shop-catalog/filter-options";
import {
  ProductFilterPanel,
  type ProductFilterPanelProps,
} from "@/components/storefront/shop-catalog/product-filter-panel";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  filterAndSortShopProducts,
  type ShopProductListing,
  type ShopProductSize,
  type ShopProductSort,
} from "@/lib/shopware/product-listing";

const resultScrollReleaseDelay = 700;

function toggleValue<TValue extends string>(
  value: TValue,
  setValues: Dispatch<SetStateAction<TValue[]>>,
) {
  setValues((values) =>
    values.includes(value)
      ? values.filter((selectedValue) => selectedValue !== value)
      : [...values, value],
  );
}

export type ShopCatalogProps = {
  isLoading?: boolean;
  listing: ShopProductListing;
};

export function ShopCatalog({ isLoading = false, listing }: ShopCatalogProps) {
  const prices = listing.products.map((product) => product.unitPrice);
  const minimumPriceBound = Math.floor(Math.min(...prices) / 10) * 10;
  const maximumPriceBound = Math.ceil(Math.max(...prices) / 10) * 10;
  const { categories, colors, companies, materials, sizes } =
    buildShopProductFilterOptions(listing.products);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<ShopProductSize[]>([]);
  const [minimumPrice, setMinimumPrice] = useState(minimumPriceBound);
  const [maximumPrice, setMaximumPrice] = useState(maximumPriceBound);
  const [sort, setSort] = useState<ShopProductSort>("featured");
  const previousLoadingRef = useRef(isLoading);
  const productResultsRef = useRef<HTMLDivElement>(null);
  const resultHeightReleaseTimerRef = useRef<number>(null);
  const activeFilterCount =
    selectedCategories.length +
    selectedColors.length +
    selectedCompanies.length +
    selectedMaterials.length +
    selectedSizes.length +
    (minimumPrice !== minimumPriceBound || maximumPrice !== maximumPriceBound
      ? 1
      : 0);
  const products = filterAndSortShopProducts(
    listing.products,
    {
      categories: selectedCategories,
      colors: selectedColors,
      companies: selectedCompanies,
      materials: selectedMaterials,
      maximumPrice,
      minimumPrice,
      sizes: selectedSizes,
    },
    sort,
  );

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

  function clearFilters() {
    setSelectedCategories([]);
    setSelectedColors([]);
    setSelectedCompanies([]);
    setSelectedMaterials([]);
    setSelectedSizes([]);
    setMinimumPrice(minimumPriceBound);
    setMaximumPrice(maximumPriceBound);
  }

  const filterPanelProps = {
    activeFilterCount,
    categories,
    colors,
    companies,
    materials,
    maximumPrice,
    maximumPriceBound,
    minimumPrice,
    minimumPriceBound,
    onClear: clearFilters,
    onMaximumPriceChange: (value: number) =>
      setMaximumPrice(
        Math.max(minimumPrice, Math.min(value, maximumPriceBound)),
      ),
    onMinimumPriceChange: (value: number) =>
      setMinimumPrice(
        Math.min(maximumPrice, Math.max(value, minimumPriceBound)),
      ),
    onToggleCategory: (value: string) =>
      toggleValue(value, setSelectedCategories),
    onToggleColor: (value: string) => toggleValue(value, setSelectedColors),
    onToggleCompany: (value: string) =>
      toggleValue(value, setSelectedCompanies),
    onToggleMaterial: (value: string) =>
      toggleValue(value, setSelectedMaterials),
    onToggleSize: (value: ShopProductSize) =>
      toggleValue(value, setSelectedSizes),
    selectedCategories,
    selectedColors,
    selectedCompanies,
    selectedMaterials,
    selectedSizes,
    sizes,
  } satisfies ProductFilterPanelProps;

  return (
    <div className="mx-auto w-full max-w-360 px-4 pb-20 sm:px-8 sm:pb-28">
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

      <div className="grid gap-8 pt-8 lg:grid-cols-[13.75rem_minmax(0,1fr)] lg:gap-10 xl:gap-12">
        <aside className="sticky top-24 hidden max-h-[calc(100dvh-7rem)] self-start overflow-y-auto rounded-xl border bg-card/70 p-4 scrollbar-width:none lg:block [&::-webkit-scrollbar]:hidden">
          <ProductFilterPanel {...filterPanelProps} />
        </aside>

        <section
          aria-busy={isLoading}
          aria-label="Product results"
          className="min-w-0"
        >
          <div className="mb-6 flex items-center justify-between gap-3">
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
                  <Dialog.Popup className="flex h-dvh w-[min(24rem,92vw)] flex-col rounded-l-2xl border-l bg-background shadow-2xl transition-transform duration-300 ease-out data-ending-style:translate-x-full data-starting-style:translate-x-full">
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
                        Show {products.length}{" "}
                        {products.length === 1 ? "product" : "products"}
                      </Dialog.Close>
                    </div>
                  </Dialog.Popup>
                </Dialog.Viewport>
              </Dialog.Portal>
            </Dialog.Root>

            <p className="hidden text-xs text-muted-foreground sm:block">
              Showing {products.length} of {listing.products.length}
            </p>

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

          <div className="relative scroll-mt-28" ref={productResultsRef}>
            {products.length > 0 ? (
              <div
                className={`grid grid-cols-2 gap-x-3 gap-y-9 transition-[opacity,filter] duration-200 md:grid-cols-3 md:gap-x-4 xl:grid-cols-4 ${isLoading ? "pointer-events-none opacity-35 saturate-50" : ""}`}
              >
                {products.map((product, index) => (
                  <ShopProductCard
                    currency={listing.currency}
                    eagerImage={index < 4}
                    key={product.id}
                    locale={listing.locale}
                    product={product}
                  />
                ))}
              </div>
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
                <Button
                  className="mt-5"
                  onClick={clearFilters}
                  variant="outline"
                >
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
        </section>
      </div>
    </div>
  );
}
