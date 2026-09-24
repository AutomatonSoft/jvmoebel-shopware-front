"use client";

import { ChevronDown, Search } from "lucide-react";
import { useState, type ReactNode } from "react";

import { PriceRangeFilter } from "@/features/catalog/components/price-range-filter";
import type {
  ProductAttributeFilterGroup,
  ProductFilterOption,
} from "@/features/catalog/model/filter-options";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

export type ProductFilterPanelProps = {
  activeFilterCount: number;
  attributeGroups: ProductAttributeFilterGroup[];
  categories: ProductFilterOption[];
  companies: ProductFilterOption[];
  maximumPrice: number;
  maximumPriceBound: number;
  minimumPrice: number;
  minimumPriceBound: number;
  onClear: () => void;
  onMaximumPriceChange: (value: number) => void;
  onMinimumPriceChange: (value: number) => void;
  onPriceRangeChange: (value: readonly [number, number]) => void;
  onToggleAttribute: (groupId: string, value: string) => void;
  onToggleCategory: (value: string) => void;
  onToggleCompany: (value: string) => void;
  selectedAttributes: Readonly<Record<string, readonly string[]>>;
  selectedCategories: readonly string[];
  selectedCompanies: readonly string[];
};

const filterPreviewLimit = 8;

function FilterGroup({
  activeCount = 0,
  children,
  defaultOpen = true,
  title,
}: {
  activeCount?: number;
  children: ReactNode;
  defaultOpen?: boolean;
  title: string;
}) {
  return (
    <details className="group border-t" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 py-5 text-sm font-semibold [&::-webkit-details-marker]:hidden">
        <span className="flex min-w-0 items-center gap-2">
          {title}
          {activeCount > 0 && (
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[0.625rem] font-bold text-primary">
              {activeCount}
            </span>
          )}
        </span>
        <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
      </summary>
      <div className="space-y-3 pb-6">{children}</div>
    </details>
  );
}

function CheckboxOption({
  checked,
  count,
  disabled,
  label,
  onChange,
  swatch,
}: {
  checked: boolean;
  count: number;
  disabled?: boolean;
  label: string;
  onChange: () => void;
  swatch?: string;
}) {
  return (
    <label
      className={`group/option -mx-1 grid grid-cols-[1.125rem_1fr_auto] items-center gap-2.5 rounded-md px-1 py-0.5 text-sm transition-colors ${disabled ? "cursor-not-allowed opacity-45" : "cursor-pointer hover:bg-muted/60"}`}
    >
      <Checkbox
        checked={checked}
        className="size-4.5 rounded-[5px] border-muted-foreground/40 bg-background shadow-xs group-hover/option:border-primary/70"
        disabled={disabled}
        onCheckedChange={onChange}
      />
      <span className="flex min-w-0 items-center gap-2 transition-colors group-hover/option:text-foreground">
        {swatch && (
          <span
            aria-hidden="true"
            className="size-3.5 shrink-0 rounded-full border border-border"
            style={{ backgroundColor: swatch }}
          />
        )}
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
            {searchPlaceholder ?? "Optionen durchsuchen"}
          </span>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-9 bg-background pr-3 pl-9 text-xs"
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder ?? "Optionen durchsuchen"}
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
            Keine Optionen gefunden.
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
          {expanded ? "Weniger anzeigen" : `Alle anzeigen (${options.length})`}
        </button>
      )}
    </>
  );
}

export function ProductFilterPanel({
  activeFilterCount,
  attributeGroups,
  categories,
  companies,
  maximumPrice,
  maximumPriceBound,
  minimumPrice,
  minimumPriceBound,
  onClear,
  onMaximumPriceChange,
  onMinimumPriceChange,
  onPriceRangeChange,
  onToggleAttribute,
  onToggleCategory,
  onToggleCompany,
  selectedAttributes,
  selectedCategories,
  selectedCompanies,
  hasProducts = true,
}: ProductFilterPanelProps & {
  hasProducts?: boolean;
}) {
  const hasPriceFilter =
    minimumPrice !== minimumPriceBound || maximumPrice !== maximumPriceBound;
  const categoryOptions = [
    ...categories,
    ...selectedCategories
      .filter((value) => !categories.some((option) => option.value === value))
      .map((value) => ({ count: 0, label: "Ausgewählt", value })),
  ];
  const companyOptions = [
    ...companies,
    ...selectedCompanies
      .filter((value) => !companies.some((option) => option.value === value))
      .map((value) => ({ count: 0, label: "Ausgewählt", value })),
  ];
  const attributeOptions = [
    ...attributeGroups.map((group) => ({
      ...group,
      options: [
        ...group.options,
        ...(selectedAttributes[group.id] ?? [])
          .filter(
            (value) => !group.options.some((option) => option.value === value),
          )
          .map((value) => ({
            count: 0,
            hex: undefined,
            label: "Ausgewählt",
            value,
          })),
      ],
    })),
    ...Object.entries(selectedAttributes)
      .filter(
        ([groupId]) => !attributeGroups.some((group) => group.id === groupId),
      )
      .map(([groupId, values]) => ({
        id: groupId,
        label: "Eigenschaft",
        options: values.map((value) => ({
          count: 0,
          hex: undefined,
          label: "Ausgewählt",
          value,
        })),
      })),
  ];
  const visibleCompanies = hasProducts
    ? companyOptions
    : companyOptions.filter((option) =>
        selectedCompanies.includes(option.value),
      );
  const visibleCategories = hasProducts
    ? categoryOptions
    : categoryOptions.filter((option) =>
        selectedCategories.includes(option.value),
      );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pb-5">
        <strong className="shrink-0 text-lg">Filtern nach</strong>
        <button
          className="ml-auto shrink-0 cursor-pointer text-xs text-muted-foreground underline underline-offset-4 transition-colors hover:text-primary disabled:cursor-default disabled:opacity-40"
          disabled={activeFilterCount === 0}
          onClick={onClear}
          type="button"
        >
          Alle löschen
        </button>
      </div>

      {hasProducts && (
        <FilterGroup activeCount={hasPriceFilter ? 1 : 0} title="Preis">
          <PriceRangeFilter
            maximumPrice={maximumPrice}
            maximumPriceBound={maximumPriceBound}
            minimumPrice={minimumPrice}
            minimumPriceBound={minimumPriceBound}
            onMaximumPriceChange={onMaximumPriceChange}
            onMinimumPriceChange={onMinimumPriceChange}
            onPriceRangeChange={onPriceRangeChange}
          />
        </FilterGroup>
      )}

      {(hasProducts || selectedCompanies.length > 0) && (
        <FilterGroup activeCount={selectedCompanies.length} title="Hersteller">
          <ExpandableFilterOptions
            getKey={(option) => option.value}
            getSearchText={(option) => option.label}
            layoutClassName="space-y-3"
            options={visibleCompanies}
            renderOption={(option) => (
              <CheckboxOption
                checked={selectedCompanies.includes(option.value)}
                count={option.count}
                disabled={
                  option.count === 0 &&
                  !selectedCompanies.includes(option.value)
                }
                label={option.label}
                onChange={() => onToggleCompany(option.value)}
              />
            )}
            searchPlaceholder="Hersteller suchen"
          />
        </FilterGroup>
      )}

      {(hasProducts || selectedCategories.length > 0) && (
        <FilterGroup activeCount={selectedCategories.length} title="Kategorie">
          <ExpandableFilterOptions
            getKey={(option) => option.value}
            layoutClassName="space-y-3"
            options={visibleCategories}
            renderOption={(option) => (
              <CheckboxOption
                checked={selectedCategories.includes(option.value)}
                count={option.count}
                disabled={
                  option.count === 0 &&
                  !selectedCategories.includes(option.value)
                }
                label={option.label}
                onChange={() => onToggleCategory(option.value)}
              />
            )}
          />
        </FilterGroup>
      )}

      {attributeOptions
        .filter(
          (group) =>
            hasProducts || (selectedAttributes[group.id] ?? []).length > 0,
        )
        .map((group) => (
          <FilterGroup
            activeCount={(selectedAttributes[group.id] ?? []).length}
            defaultOpen={(selectedAttributes[group.id] ?? []).length > 0}
            key={group.id}
            title={group.label}
          >
            <ExpandableFilterOptions
              getKey={(option) => option.value}
              getSearchText={(option) => option.label}
              layoutClassName="space-y-3"
              options={
                hasProducts
                  ? group.options
                  : group.options.filter((option) =>
                      (selectedAttributes[group.id] ?? []).includes(
                        option.value,
                      ),
                    )
              }
              renderOption={(option) => (
                <CheckboxOption
                  checked={(selectedAttributes[group.id] ?? []).includes(
                    option.value,
                  )}
                  count={option.count}
                  disabled={
                    option.count === 0 &&
                    !(selectedAttributes[group.id] ?? []).includes(option.value)
                  }
                  label={option.label}
                  onChange={() => onToggleAttribute(group.id, option.value)}
                  swatch={option.hex}
                />
              )}
              searchPlaceholder={`${group.label} durchsuchen`}
            />
          </FilterGroup>
        ))}
    </div>
  );
}
