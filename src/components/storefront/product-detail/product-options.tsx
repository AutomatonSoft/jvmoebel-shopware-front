import { ChevronDown } from "lucide-react";

import type { ShopProductDetailOptionGroup } from "@/lib/shopware/product-detail";

export type ProductOptionsProps = {
  currency: string;
  groups: readonly ShopProductDetailOptionGroup[];
  locale: string;
};

export function ProductOptions({
  currency,
  groups,
  locale,
}: ProductOptionsProps) {
  const priceFormatter = new Intl.NumberFormat(locale, {
    currency,
    maximumFractionDigits: 0,
    signDisplay: "always",
    style: "currency",
  });

  return (
    <div className="divide-y border-y">
      {groups.map((group) => {
        const selectedOption = group.options.find(
          (option) => option.id === group.selectedOptionId,
        );

        return (
          <section className="py-5" key={group.id}>
            <div className="mb-3 flex items-center justify-between gap-4 text-sm">
              <h2 className="font-semibold">{group.label}</h2>
              {selectedOption && (
                <span className="text-xs text-muted-foreground">
                  {selectedOption.label}
                </span>
              )}
            </div>

            {group.displayType === "swatch" && (
              <div className="flex flex-wrap gap-3">
                {group.options.map((option) => {
                  const selected = option.id === group.selectedOptionId;

                  return (
                    <span
                      aria-label={`${option.label}${selected ? ", selected" : ""}`}
                      className={`size-9 rounded-full border-2 border-background shadow-[0_0_0_1px_var(--color-border)] ${selected ? "shadow-[0_0_0_2px_var(--color-foreground)]" : ""} ${option.available ? "" : "opacity-35"}`}
                      key={option.id}
                      role="img"
                      style={{ backgroundColor: option.swatch }}
                      title={option.label}
                    />
                  );
                })}
              </div>
            )}

            {group.displayType === "button" && (
              <div className="grid gap-2 sm:grid-cols-2">
                {group.options.map((option) => {
                  const selected = option.id === group.selectedOptionId;

                  return (
                    <div
                      className={`flex min-h-12 items-center justify-between gap-3 rounded-xl border px-4 py-3 text-xs ${selected ? "border-foreground bg-foreground text-background" : "bg-card"} ${option.available ? "" : "opacity-35"}`}
                      key={option.id}
                    >
                      <strong className="font-semibold">{option.label}</strong>
                      {option.priceDifference !== undefined && (
                        <span
                          className={
                            selected
                              ? "text-background/70"
                              : "text-muted-foreground"
                          }
                        >
                          {priceFormatter.format(option.priceDifference)}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {group.displayType === "select" && selectedOption && (
              <div className="flex h-12 items-center justify-between gap-4 rounded-xl border bg-card px-4 text-sm shadow-xs">
                <span>{selectedOption.label}</span>
                <ChevronDown
                  aria-hidden="true"
                  className="size-4 text-muted-foreground"
                />
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
