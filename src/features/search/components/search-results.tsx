"use client";

import { LoaderCircle } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";

import type { ProductSearchResult } from "@/features/search/model/product-search";

export type SearchResultsProps = {
  currency: string;
  debouncedQuery: string;
  errorMessage?: string;
  isSearching: boolean;
  locale: string;
  query: string;
  results: readonly ProductSearchResult[];
};

export function SearchResults({
  currency,
  debouncedQuery,
  errorMessage,
  isSearching,
  locale,
  query,
  results,
}: SearchResultsProps) {
  const priceFormatter = new Intl.NumberFormat(locale, {
    currency,
    maximumFractionDigits: 0,
    style: "currency",
  });

  if (!query.trim()) {
    return (
      <p className="py-3 text-sm text-muted-foreground">
        Tippen Sie, um passende Produkte zu sehen.
      </p>
    );
  }

  if (isSearching) {
    return (
      <p className="flex items-center gap-2 py-3 text-sm text-muted-foreground">
        <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
        Suche läuft...
      </p>
    );
  }

  if (errorMessage) {
    return (
      <p className="py-3 text-sm text-destructive" role="status">
        {errorMessage}
      </p>
    );
  }

  if (!results.length) {
    return (
      <p className="py-3 text-sm text-muted-foreground">
        Keine Produkte für „{debouncedQuery}“ gefunden.
      </p>
    );
  }

  return (
    <ul className="divide-y">
      {results.map((product) => (
        <motion.li
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 5 }}
          key={product.id}
          transition={{ duration: 0.2 }}
        >
          <a
            className="flex items-center gap-3 py-3 text-left transition-colors hover:text-primary"
            href={product.url}
          >
            <Image
              alt=""
              className="size-14 rounded-lg object-cover"
              height={56}
              src={product.image.url}
              unoptimized
              width={56}
            />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">
                {product.name}
              </span>
              <span className="mt-1 block truncate text-xs text-muted-foreground">
                {product.categoryLabel} · {product.description}
              </span>
            </span>
            <span className="shrink-0 text-sm font-semibold">
              {priceFormatter.format(product.unitPrice)}
            </span>
          </a>
        </motion.li>
      ))}
    </ul>
  );
}
