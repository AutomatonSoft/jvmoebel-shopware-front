"use client";

import { ChevronDown, Search } from "lucide-react";
import { useState, type ReactNode } from "react";

import type {
  ProductColorFilterOption,
  ProductFilterOption,
} from "@/components/storefront/shop-catalog/filter-options";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import type { ShopProductSize } from "@/features/catalog/model/product-listing";

export type ProductFilterPanelProps = {
  activeFilterCount: number;
  categories: ProductFilterOption[];
  colors: ProductColorFilterOption[];
  companies: ProductFilterOption[];
  materials: ProductFilterOption[];
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
  sizes: ProductFilterOption<ShopProductSize>[];
};

const filterPreviewLimit = 8;

function FilterGroup({
  children,
  title,
}: {
  children: ReactNode;
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
    <label className="group/option -mx-1 grid cursor-pointer grid-cols-[1.125rem_1fr_auto] items-center gap-2.5 rounded-md px-1 py-0.5 text-sm transition-colors hover:bg-muted/60">
      <Checkbox
        checked={checked}
        className="size-4.5 rounded-[5px] border-muted-foreground/40 bg-background shadow-xs group-hover/option:border-primary/70"
        onCheckedChange={onChange}
      />
      <span className="transition-colors group-hover/option:text-foreground">
        {label}
      </span>
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
  renderOption: (option: TOption) => ReactNode;
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

export function ProductFilterPanel({
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
