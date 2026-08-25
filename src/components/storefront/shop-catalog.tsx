"use client";

import { Dialog } from "@base-ui/react/dialog";
import {
  ChevronDown,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState, type Dispatch, type SetStateAction } from "react";

import { ShopProductCard } from "@/components/storefront/shop-product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  filterAndSortShopProducts,
  type ShopProduct,
  type ShopProductColor,
  type ShopProductListing,
  type ShopProductSize,
  type ShopProductSort,
} from "@/lib/shopware/product-listing";

type FilterOption<TValue extends string = string> = {
  count: number;
  label: string;
  value: TValue;
};

type ProductFilterPanelProps = {
  activeFilterCount: number;
  categories: FilterOption[];
  colors: (ShopProductColor & { count: number })[];
  companies: FilterOption[];
  materials: FilterOption[];
  maximumPrice: number;
  maximumPriceBound: number;
  minimumPrice: number;
  minimumPriceBound: number;
  onClear: () => void;
  onMaximumPriceChange: (value: number) => void;
  onMinimumPriceChange: (value: number) => void;
  onToggleCategory: (value: string) => void;
  onToggleColor: (value: string) => void;
  onToggleCompany: (value: string) => void;
  onToggleMaterial: (value: string) => void;
  onToggleSize: (value: ShopProductSize) => void;
  selectedCategories: string[];
  selectedColors: string[];
  selectedCompanies: string[];
  selectedMaterials: string[];
  selectedSizes: ShopProductSize[];
  sizes: FilterOption<ShopProductSize>[];
};

const shopProductSizes = [
  { label: "Small", value: "small" },
  { label: "Medium", value: "medium" },
  { label: "Large", value: "large" },
  { label: "Extra large", value: "extra-large" },
] as const satisfies readonly Omit<FilterOption<ShopProductSize>, "count">[];

const filterPreviewLimit = 8;

function getCategoryOptions(products: readonly ShopProduct[]) {
  const options = new Map<string, FilterOption>();

  for (const product of products) {
    const option = options.get(product.category);
    options.set(product.category, {
      count: (option?.count ?? 0) + 1,
      label: product.categoryLabel,
      value: product.category,
    });
  }

  return Array.from(options.values());
}

function getColorOptions(products: readonly ShopProduct[]) {
  const options = new Map<string, ShopProductColor & { count: number }>();

  for (const product of products) {
    for (const color of product.colors) {
      const option = options.get(color.value);
      options.set(color.value, {
        ...color,
        count: (option?.count ?? 0) + 1,
      });
    }
  }

  return Array.from(options.values());
}

function getCompanyOptions(products: readonly ShopProduct[]) {
  const options = new Map<string, FilterOption>();

  for (const product of products) {
    const option = options.get(product.company);
    options.set(product.company, {
      count: (option?.count ?? 0) + 1,
      label: product.company,
      value: product.company,
    });
  }

  return Array.from(options.values());
}

function getMaterialOptions(products: readonly ShopProduct[]) {
  const options = new Map<string, FilterOption>();

  for (const product of products) {
    const option = options.get(product.material);
    options.set(product.material, {
      count: (option?.count ?? 0) + 1,
      label: product.material,
      value: product.material,
    });
  }

  return Array.from(options.values());
}

function getSizeOptions(products: readonly ShopProduct[]) {
  return shopProductSizes.map((size) => ({
    ...size,
    count: products.filter((product) => product.sizes.includes(size.value))
      .length,
  }));
}

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

function FilterGroup({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <details className="group border-t" open>
      <summary className="flex cursor-pointer list-none items-center justify-between py-5 text-sm font-semibold [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
      </summary>
      <div className="space-y-3 pb-6">{children}</div>
    </details>
  );
}

function CheckboxOption({
  checked,
  count,
  label,
  onChange,
}: {
  checked: boolean;
  count: number;
  label: string;
  onChange: () => void;
}) {
  return (
    <label className="grid cursor-pointer grid-cols-[1.125rem_1fr_auto] items-center gap-2.5 text-sm">
      <input
        checked={checked}
        className="size-4.5 accent-primary"
        onChange={onChange}
        type="checkbox"
      />
      <span>{label}</span>
      <small className="text-xs text-muted-foreground">{count}</small>
    </label>
  );
}

function ExpandableFilterOptions<TOption>({
  getKey,
  getSearchText,
  layoutClassName,
  options,
  renderOption,
  searchPlaceholder,
}: {
  getKey: (option: TOption) => string;
  getSearchText?: (option: TOption) => string;
  layoutClassName: string;
  options: readonly TOption[];
  renderOption: (option: TOption) => React.ReactNode;
  searchPlaceholder?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const filteredOptions =
    expanded && getSearchText
      ? options.filter((option) =>
          getSearchText(option).toLocaleLowerCase().includes(normalizedQuery),
        )
      : options;
  const visibleOptions = expanded
    ? filteredOptions
    : filteredOptions.slice(0, filterPreviewLimit);

  function toggleExpanded() {
    if (expanded) {
      setQuery("");
    }

    setExpanded(!expanded);
  }

  return (
    <>
      {expanded && getSearchText && (
        <label className="relative block">
          <span className="sr-only">
            {searchPlaceholder ?? "Search options"}
          </span>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-9 bg-background pr-3 pl-9 text-xs"
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder ?? "Search options"}
            type="search"
            value={query}
          />
        </label>
      )}

      <div
        className={`${layoutClassName} ${expanded ? "max-h-60 overflow-y-auto pr-2" : ""}`}
      >
        {visibleOptions.map((option) => (
          <div key={getKey(option)}>{renderOption(option)}</div>
        ))}
        {visibleOptions.length === 0 && (
          <p className="py-2 text-xs text-muted-foreground">
            No options found.
          </p>
        )}
      </div>

      {options.length > filterPreviewLimit && (
        <button
          aria-expanded={expanded}
          className="cursor-pointer text-xs font-semibold text-primary underline underline-offset-4 transition-colors hover:text-destructive"
          onClick={toggleExpanded}
          type="button"
        >
          {expanded ? "Show less" : `Show all (${options.length})`}
        </button>
      )}
    </>
  );
}

function ProductFilterPanel({
  activeFilterCount,
  categories,
  colors,
  companies,
  materials,
  maximumPrice,
  maximumPriceBound,
  minimumPrice,
  minimumPriceBound,
  onClear,
  onMaximumPriceChange,
  onMinimumPriceChange,
  onToggleCategory,
  onToggleColor,
  onToggleCompany,
  onToggleMaterial,
  onToggleSize,
  selectedCategories,
  selectedColors,
  selectedCompanies,
  selectedMaterials,
  selectedSizes,
  sizes,
}: ProductFilterPanelProps) {
  return (
    <div>
      <div className="flex items-center justify-between pb-5">
        <strong className="text-lg">Filter by</strong>
        <button
          className="cursor-pointer text-xs text-muted-foreground underline underline-offset-4 transition-colors hover:text-primary disabled:cursor-default disabled:opacity-40"
          disabled={activeFilterCount === 0}
          onClick={onClear}
          type="button"
        >
          Clear all
        </button>
      </div>

      <FilterGroup title="Colour">
        <ExpandableFilterOptions
          getKey={(color) => color.value}
          layoutClassName="flex flex-wrap gap-3"
          options={colors}
          renderOption={(color) => {
            const selected = selectedColors.includes(color.value);

            return (
              <button
                aria-label={`${color.label}, ${color.count} products`}
                aria-pressed={selected}
                className={`size-9 cursor-pointer rounded-full border-2 border-background shadow-[0_0_0_1px_var(--color-border)] transition-[box-shadow,transform] hover:scale-105 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${selected ? "shadow-[0_0_0_2px_var(--color-foreground)]" : ""}`}
                onClick={() => onToggleColor(color.value)}
                style={{ backgroundColor: color.hex }}
                title={color.label}
                type="button"
              />
            );
          }}
        />
      </FilterGroup>

      <FilterGroup title="Price">
        <div className="grid grid-cols-2 gap-3">
          <label>
            <span className="mb-2 block text-xs text-muted-foreground">
              From
            </span>
            <Input
              className="h-10 bg-background text-sm"
              max={maximumPrice}
              min={minimumPriceBound}
              onChange={(event) => {
                if (Number.isFinite(event.target.valueAsNumber)) {
                  onMinimumPriceChange(event.target.valueAsNumber);
                }
              }}
              step="10"
              type="number"
              value={minimumPrice}
            />
          </label>
          <label>
            <span className="mb-2 block text-xs text-muted-foreground">To</span>
            <Input
              className="h-10 bg-background text-sm"
              max={maximumPriceBound}
              min={minimumPrice}
              onChange={(event) => {
                if (Number.isFinite(event.target.valueAsNumber)) {
                  onMaximumPriceChange(event.target.valueAsNumber);
                }
              }}
              step="10"
              type="number"
              value={maximumPrice}
            />
          </label>
        </div>
      </FilterGroup>

      <FilterGroup title="Company">
        <ExpandableFilterOptions
          getKey={(option) => option.value}
          getSearchText={(option) => option.label}
          layoutClassName="space-y-3"
          options={companies}
          renderOption={(option) => (
            <CheckboxOption
              checked={selectedCompanies.includes(option.value)}
              count={option.count}
              label={option.label}
              onChange={() => onToggleCompany(option.value)}
            />
          )}
          searchPlaceholder="Search companies"
        />
      </FilterGroup>

      <FilterGroup title="Size">
        <ExpandableFilterOptions
          getKey={(option) => option.value}
          layoutClassName="space-y-3"
          options={sizes}
          renderOption={(option) => (
            <CheckboxOption
              checked={selectedSizes.includes(option.value)}
              count={option.count}
              label={option.label}
              onChange={() => onToggleSize(option.value)}
            />
          )}
        />
      </FilterGroup>

      <FilterGroup title="Category">
        <ExpandableFilterOptions
          getKey={(option) => option.value}
          layoutClassName="space-y-3"
          options={categories}
          renderOption={(option) => (
            <CheckboxOption
              checked={selectedCategories.includes(option.value)}
              count={option.count}
              label={option.label}
              onChange={() => onToggleCategory(option.value)}
            />
          )}
        />
      </FilterGroup>

      <FilterGroup title="Material">
        <ExpandableFilterOptions
          getKey={(option) => option.value}
          layoutClassName="space-y-3"
          options={materials}
          renderOption={(option) => (
            <CheckboxOption
              checked={selectedMaterials.includes(option.value)}
              count={option.count}
              label={option.label}
              onChange={() => onToggleMaterial(option.value)}
            />
          )}
        />
      </FilterGroup>
    </div>
  );
}

export type ShopCatalogProps = {
  listing: ShopProductListing;
};

export function ShopCatalog({ listing }: ShopCatalogProps) {
  const prices = listing.products.map((product) => product.unitPrice);
  const minimumPriceBound = Math.floor(Math.min(...prices) / 10) * 10;
  const maximumPriceBound = Math.ceil(Math.max(...prices) / 10) * 10;
  const categories = getCategoryOptions(listing.products);
  const colors = getColorOptions(listing.products);
  const companies = getCompanyOptions(listing.products);
  const materials = getMaterialOptions(listing.products);
  const sizes = getSizeOptions(listing.products);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<ShopProductSize[]>([]);
  const [minimumPrice, setMinimumPrice] = useState(minimumPriceBound);
  const [maximumPrice, setMaximumPrice] = useState(maximumPriceBound);
  const [sort, setSort] = useState<ShopProductSort>("featured");
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
        <aside className="sticky top-24 hidden max-h-[calc(100dvh-7rem)] self-start overflow-y-auto rounded-xl border bg-card/70 p-4 [scrollbar-width:none] lg:block [&::-webkit-scrollbar]:hidden">
          <ProductFilterPanel {...filterPanelProps} />
        </aside>

        <section aria-label="Product results" className="min-w-0">
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

            <label className="ml-auto flex items-center gap-2 text-xs">
              <span className="hidden text-muted-foreground sm:inline">
                Sort by
              </span>
              <span className="relative">
                <select
                  aria-label="Sort products"
                  className="h-10 min-w-40 cursor-pointer appearance-none rounded-lg border bg-card py-0 pr-9 pl-3 text-xs outline-none transition-[border-color,box-shadow] focus:border-primary focus:ring-3 focus:ring-primary/15"
                  onChange={(event) =>
                    setSort(event.target.value as ShopProductSort)
                  }
                  value={sort}
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="price-ascending">Price: low to high</option>
                  <option value="price-descending">Price: high to low</option>
                  <option value="rating">Best rated</option>
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
              </span>
            </label>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-3 gap-y-9 md:grid-cols-3 md:gap-x-4 xl:grid-cols-4">
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
            <div className="flex min-h-96 flex-col items-center justify-center rounded-2xl border border-dashed bg-card/40 px-6 text-center">
              <span className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
                <Sparkles className="size-5 text-primary" />
              </span>
              <h2 className="text-lg font-semibold">No matching products</h2>
              <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                Try removing one or more filters to see more furniture.
              </p>
              <Button className="mt-5" onClick={clearFilters} variant="outline">
                Clear filters
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
