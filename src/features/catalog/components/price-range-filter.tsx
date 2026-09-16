"use client";

import { useState, type KeyboardEvent } from "react";

import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

export type PriceRangeFilterProps = {
  maximumPrice: number;
  maximumPriceBound: number;
  minimumPrice: number;
  minimumPriceBound: number;
  onMaximumPriceChange: (value: number) => void;
  onMinimumPriceChange: (value: number) => void;
  onPriceRangeChange: (value: readonly [number, number]) => void;
};

export function PriceRangeFilter({
  maximumPrice,
  maximumPriceBound,
  minimumPrice,
  minimumPriceBound,
  onMaximumPriceChange,
  onMinimumPriceChange,
  onPriceRangeChange,
}: PriceRangeFilterProps) {
  const [minimumPriceDraft, setMinimumPriceDraft] = useState<string | null>(
    null,
  );
  const [maximumPriceDraft, setMaximumPriceDraft] = useState<string | null>(
    null,
  );

  function commitMinimumPrice() {
    if (minimumPriceDraft === null) {
      return;
    }

    const value = Number(minimumPriceDraft);

    if (minimumPriceDraft.trim() && Number.isFinite(value)) {
      onMinimumPriceChange(value);
    }

    setMinimumPriceDraft(null);
  }

  function commitMaximumPrice() {
    if (maximumPriceDraft === null) {
      return;
    }

    const value = Number(maximumPriceDraft);

    if (maximumPriceDraft.trim() && Number.isFinite(value)) {
      onMaximumPriceChange(value);
    }

    setMaximumPriceDraft(null);
  }

  function handleDraftKeyDown(
    event: KeyboardEvent<HTMLInputElement>,
    resetDraft: () => void,
  ) {
    if (event.key === "Enter") {
      event.currentTarget.blur();
    }

    if (event.key === "Escape") {
      event.preventDefault();
      resetDraft();
    }
  }

  return (
    <div>
      {minimumPriceBound < maximumPriceBound && (
        <Slider
          aria-label="Price range"
          className="mb-5 py-2"
          max={maximumPriceBound}
          min={minimumPriceBound}
          onValueChange={(value) => {
            if (!Array.isArray(value) || value.length < 2) {
              return;
            }

            setMinimumPriceDraft(null);
            setMaximumPriceDraft(null);
            onPriceRangeChange([value[0], value[1]]);
          }}
          step={10}
          thumbCollisionBehavior="none"
          value={[minimumPrice, maximumPrice]}
        />
      )}

      <div className="grid grid-cols-2 gap-3">
        <label>
          <span className="mb-2 block text-xs text-muted-foreground">From</span>
          <Input
            className="h-10 bg-background text-sm"
            max={maximumPrice}
            min={minimumPriceBound}
            onBlur={commitMinimumPrice}
            onChange={(event) => setMinimumPriceDraft(event.target.value)}
            onKeyDown={(event) =>
              handleDraftKeyDown(event, () => setMinimumPriceDraft(null))
            }
            step="10"
            type="number"
            value={minimumPriceDraft ?? String(minimumPrice)}
          />
        </label>
        <label>
          <span className="mb-2 block text-xs text-muted-foreground">To</span>
          <Input
            className="h-10 bg-background text-sm"
            max={maximumPriceBound}
            min={minimumPrice}
            onBlur={commitMaximumPrice}
            onChange={(event) => setMaximumPriceDraft(event.target.value)}
            onKeyDown={(event) =>
              handleDraftKeyDown(event, () => setMaximumPriceDraft(null))
            }
            step="10"
            type="number"
            value={maximumPriceDraft ?? String(maximumPrice)}
          />
        </label>
      </div>
    </div>
  );
}
