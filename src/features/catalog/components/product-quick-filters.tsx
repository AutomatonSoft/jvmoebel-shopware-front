"use client";

import { Popover } from "@base-ui/react/popover";
import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { ProductFilterPanelProps } from "@/features/catalog/components/product-filter-panel";

type ProductQuickFiltersProps = ProductFilterPanelProps & {
  currency: string;
  locale: string;
};

function QuickFilter({
  activeCount = 0,
  children,
  label,
}: {
  activeCount?: number;
  children: ReactNode;
  label: string;
}) {
  return (
    <Popover.Root>
      <Popover.Trigger
        render={
          <Button
            className={
              activeCount > 0
                ? "border-primary bg-primary/8 text-primary hover:bg-primary/12"
                : undefined
            }
            size="sm"
            variant="outline"
          />
        }
      >
        {label}
        {activeCount > 0 && (
          <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[0.625rem] font-bold text-primary-foreground">
            {activeCount}
          </span>
        )}
        <ChevronDown className="size-3.5 transition-transform group-aria-expanded/button:rotate-180" />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner align="start" className="z-80" sideOffset={8}>
          <Popover.Popup className="w-72 origin-[var(--transform-origin)] rounded-xl border bg-popover p-3 text-popover-foreground shadow-xl transition-[transform,scale,opacity] data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
            <Popover.Title className="mb-3 text-sm font-semibold">
              {label}
            </Popover.Title>
            {children}
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}

function QuickOption({
  checked,
  count,
  disabled,
  label,
  onChange,
  swatch,
}: {
  checked: boolean;
  count?: number;
  disabled?: boolean;
  label: string;
  onChange: () => void;
  swatch?: string;
}) {
  return (
    <label
      className={`grid grid-cols-[1.125rem_1fr_auto] items-center gap-2.5 rounded-lg px-2 py-2 text-sm transition-colors ${disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer hover:bg-muted"}`}
    >
      <Checkbox
        checked={checked}
        disabled={disabled}
        onCheckedChange={onChange}
      />
      <span className="flex min-w-0 items-center gap-2">
        {swatch && (
          <span
            aria-hidden="true"
            className="size-3.5 shrink-0 rounded-full border"
            style={{ backgroundColor: swatch }}
          />
        )}
        <span className="truncate">{label}</span>
      </span>
      {count !== undefined && (
        <small className="text-xs text-muted-foreground">{count}</small>
      )}
    </label>
  );
}

export function ProductQuickFilters({
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
}: ProductQuickFiltersProps) {
  const priceFormatter = new Intl.NumberFormat(locale, {
    currency,
    maximumFractionDigits: 0,
    style: "currency",
  });
  const priceRanges = [
    { label: `Bis ${priceFormatter.format(1000)}`, maximum: 1000 },
    {
      label: `${priceFormatter.format(1000)} – ${priceFormatter.format(3000)}`,
      maximum: 3000,
      minimum: 1000,
    },
    { label: `Ab ${priceFormatter.format(3000)}`, minimum: 3000 },
  ].filter(
    (range) =>
      (range.minimum ?? minimumPriceBound) <= maximumPriceBound &&
      (range.maximum ?? maximumPriceBound) >= minimumPriceBound,
  );
  const hasPriceFilter =
    minimumPrice !== minimumPriceBound || maximumPrice !== maximumPriceBound;

  return (
    <section aria-label="Schnellfilter" className="border-y py-3">
      <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] sm:-mx-8 sm:px-8 [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max min-w-full gap-2">
          {categories.length > 0 && (
            <QuickFilter
              activeCount={selectedCategories.length}
              label="Kategorie"
            >
              <div className="max-h-72 overflow-y-auto">
                {categories.map((option) => (
                  <QuickOption
                    checked={selectedCategories.includes(option.value)}
                    count={option.count}
                    disabled={
                      option.count === 0 &&
                      !selectedCategories.includes(option.value)
                    }
                    key={option.value}
                    label={option.label}
                    onChange={() => onToggleCategory(option.value)}
                  />
                ))}
              </div>
            </QuickFilter>
          )}

          {companies.length > 0 && (
            <QuickFilter
              activeCount={selectedCompanies.length}
              label="Hersteller"
            >
              <div className="max-h-72 overflow-y-auto">
                {companies.map((option) => (
                  <QuickOption
                    checked={selectedCompanies.includes(option.value)}
                    count={option.count}
                    disabled={
                      option.count === 0 &&
                      !selectedCompanies.includes(option.value)
                    }
                    key={option.value}
                    label={option.label}
                    onChange={() => onToggleCompany(option.value)}
                  />
                ))}
              </div>
            </QuickFilter>
          )}

          <QuickFilter activeCount={hasPriceFilter ? 1 : 0} label="Preis">
            <div className="space-y-1">
              {priceRanges.map((range) => {
                const rangeMinimum = Math.max(
                  minimumPriceBound,
                  range.minimum ?? minimumPriceBound,
                );
                const rangeMaximum = Math.min(
                  maximumPriceBound,
                  range.maximum ?? maximumPriceBound,
                );
                const checked =
                  minimumPrice === rangeMinimum &&
                  maximumPrice === rangeMaximum;

                return (
                  <QuickOption
                    checked={checked}
                    key={range.label}
                    label={range.label}
                    onChange={() =>
                      onPriceRangeChange(
                        checked
                          ? [minimumPriceBound, maximumPriceBound]
                          : [rangeMinimum, rangeMaximum],
                      )
                    }
                  />
                );
              })}
            </div>
          </QuickFilter>

          {attributeGroups.slice(0, 3).map((group) => {
            const selected = selectedAttributes[group.id] ?? [];

            return (
              <QuickFilter
                activeCount={selected.length}
                key={group.id}
                label={group.label}
              >
                <div className="max-h-72 overflow-y-auto">
                  {group.options.map((option) => (
                    <QuickOption
                      checked={selected.includes(option.value)}
                      count={option.count}
                      disabled={
                        option.count === 0 && !selected.includes(option.value)
                      }
                      key={option.value}
                      label={option.label}
                      onChange={() => onToggleAttribute(group.id, option.value)}
                      swatch={option.hex}
                    />
                  ))}
                </div>
              </QuickFilter>
            );
          })}
        </div>
      </div>
    </section>
  );
}
