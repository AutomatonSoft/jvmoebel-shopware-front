"use client";

import { X } from "lucide-react";

import type { ProductFilterPanelProps } from "@/features/catalog/components/product-filter-panel";

type ActiveProductFiltersProps = ProductFilterPanelProps & {
  currency: string;
  locale: string;
};

export function ActiveProductFilters({
  attributeGroups,
  categories,
  companies,
  currency,
  locale,
  maximumPrice,
  maximumPriceBound,
  minimumPrice,
  minimumPriceBound,
  onPriceRangeChange,
  onToggleAttribute,
  onToggleCategory,
  onToggleCompany,
  selectedAttributes,
  selectedCategories,
  selectedCompanies,
}: ActiveProductFiltersProps) {
  const formatPrice = new Intl.NumberFormat(locale, {
    currency,
    maximumFractionDigits: 0,
    style: "currency",
  }).format;
  const hasMinimumPriceFilter = minimumPrice !== minimumPriceBound;
  const hasMaximumPriceFilter = maximumPrice !== maximumPriceBound;
  const selectedFilters = [
    ...selectedCategories.map((value) => ({
      key: `category-${value}`,
      label: `Kategorie: ${categories.find((option) => option.value === value)?.label ?? "Ausgewählt"}`,
      onRemove: () => onToggleCategory(value),
    })),
    ...selectedCompanies.map((value) => ({
      key: `company-${value}`,
      label: `Hersteller: ${companies.find((option) => option.value === value)?.label ?? "Ausgewählt"}`,
      onRemove: () => onToggleCompany(value),
    })),
    ...Object.entries(selectedAttributes).flatMap(([groupId, values]) => {
      const group = attributeGroups.find(
        (candidate) => candidate.id === groupId,
      );

      return values.map((value) => ({
        key: `attribute-${groupId}-${value}`,
        label: `${group?.label ?? "Eigenschaft"}: ${group?.options.find((option) => option.value === value)?.label ?? "Ausgewählt"}`,
        onRemove: () => onToggleAttribute(groupId, value),
      }));
    }),
    ...(hasMinimumPriceFilter || hasMaximumPriceFilter
      ? [
          {
            key: "price",
            label:
              hasMinimumPriceFilter && hasMaximumPriceFilter
                ? `Preis: ${formatPrice(minimumPrice)} – ${formatPrice(maximumPrice)}`
                : hasMinimumPriceFilter
                  ? `Preis: ab ${formatPrice(minimumPrice)}`
                  : `Preis: bis ${formatPrice(maximumPrice)}`,
            onRemove: () =>
              onPriceRangeChange([minimumPriceBound, maximumPriceBound]),
          },
        ]
      : []),
  ];

  if (selectedFilters.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Aktive Filter"
      className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-5"
    >
      <p className="shrink-0 text-xs font-semibold text-muted-foreground">
        Aktive Filter ({selectedFilters.length})
      </p>
      <div className="flex min-w-0 flex-wrap gap-2">
        {selectedFilters.map((filter) => (
          <button
            aria-label={`${filter.label} entfernen`}
            className="inline-flex max-w-full cursor-pointer items-center gap-1.5 rounded-lg border border-primary/25 bg-primary/5 px-3 py-1.5 text-left text-xs font-medium text-foreground transition-colors hover:border-primary/60 hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            key={filter.key}
            onClick={filter.onRemove}
            type="button"
          >
            <span className="truncate">{filter.label}</span>
            <X aria-hidden="true" className="size-3.5 shrink-0 text-primary" />
          </button>
        ))}
      </div>
    </section>
  );
}
