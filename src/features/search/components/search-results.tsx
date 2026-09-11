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
            className="flex min-h-28 items-center gap-4 py-4 text-left transition-colors hover:text-primary"
            href={product.url}
          >
            <span className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-muted/60 sm:h-24 sm:w-32">
              <Image
                alt=""
                className="object-contain p-2"
                fill
                sizes="(max-width: 639px) 96px, 128px"
                src={product.image.url}
                unoptimized
              />
            </span>
            <span className="min-w-0 flex-1">
              <span className="line-clamp-2 block text-sm leading-5 font-semibold sm:text-base">
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
