"use client";

import { ArrowRight, LoaderCircle, Search } from "lucide-react";
import { motion } from "motion/react";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import type { ProductSearchResult } from "@/features/search/model/product-search";
import { getSearchUrl } from "@/features/search/model/search-url";

export type SearchResultsProps = {
  currency: string;
  debouncedQuery: string;
  errorMessage?: string;
  isSearching: boolean;
  locale: string;
  onResultSelect: () => void;
  query: string;
  results: readonly ProductSearchResult[];
};

export function SearchResults({
  currency,
  debouncedQuery,
  errorMessage,
  isSearching,
  locale,
  onResultSelect,
  query,
  results,
}: SearchResultsProps) {
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

  const priceFormatter = new Intl.NumberFormat(locale, {
    currency,
    maximumFractionDigits: 0,
    style: "currency",
  });
  const categorySuggestions = Array.from(
    new Set(
      results
        .map((product) => product.categoryLabel.trim())
        .filter(
          (category) =>
            category &&
            category.toLocaleLowerCase() !== "products" &&
            category.toLocaleLowerCase() !==
              debouncedQuery.trim().toLocaleLowerCase(),
        ),
    ),
  ).slice(0, 5);

  return (
    <div>
      <div className="grid gap-5 md:grid-cols-[minmax(12rem,0.8fr)_minmax(0,1.4fr)] md:gap-0 md:divide-x">
        <section className="md:pr-5" aria-labelledby="search-suggestions-title">
          <h2
            className="mb-2 text-sm font-semibold"
            id="search-suggestions-title"
          >
            Suchvorschläge
          </h2>
          <ul className="space-y-1">
            <li>
              <Link
                className="group flex items-center gap-2 rounded-lg px-2 py-2.5 text-sm transition-colors hover:bg-muted hover:text-primary"
                href={getSearchUrl(debouncedQuery) as Route}
                onClick={onResultSelect}
              >
                <Search className="size-3.5 shrink-0 text-muted-foreground group-hover:text-primary" />
                <span className="min-w-0 flex-1 truncate font-semibold">
                  {debouncedQuery}
                </span>
                <ArrowRight className="size-3.5 shrink-0 opacity-50" />
              </Link>
            </li>
            {categorySuggestions.map((category) => (
              <li key={category}>
                <Link
                  className="group flex items-center gap-2 rounded-lg px-2 py-2.5 text-sm transition-colors hover:bg-muted hover:text-primary"
                  href={getSearchUrl(`${debouncedQuery} ${category}`) as Route}
                  onClick={onResultSelect}
                >
                  <Search className="size-3.5 shrink-0 text-muted-foreground group-hover:text-primary" />
                  <span className="min-w-0 flex-1 truncate">
                    {debouncedQuery} in <strong>{category}</strong>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section
          className="md:pl-5"
          aria-labelledby="product-suggestions-title"
        >
          <h2
            className="mb-3 text-sm font-semibold"
            id="product-suggestions-title"
          >
            Produktvorschläge
          </h2>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {results.slice(0, 6).map((product, index) => (
              <motion.li
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 5 }}
                key={product.id}
                transition={{ delay: index * 0.025, duration: 0.2 }}
              >
                <Link
                  className="group block rounded-xl border bg-card p-2 transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                  href={product.url as Route}
                  onClick={onResultSelect}
                >
                  <span className="relative block aspect-[4/3] overflow-hidden rounded-lg bg-muted/60">
                    <Image
                      alt={product.image.alt}
                      className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                      fill
                      sizes="(max-width: 639px) 40vw, 160px"
                      src={product.image.url}
                    />
                  </span>
                  <span className="mt-2 block text-xs font-semibold">
                    {priceFormatter.format(product.unitPrice)}
                  </span>
                  <span className="mt-0.5 line-clamp-2 block text-xs leading-4 group-hover:text-primary">
                    {product.name}
                  </span>
                  <span className="mt-1 block truncate text-[0.625rem] text-muted-foreground">
                    {product.categoryLabel}
                  </span>
                </Link>
              </motion.li>
            ))}
          </ul>
        </section>
      </div>

      <Link
        className={buttonVariants({ className: "mt-4 w-full" })}
        href={getSearchUrl(debouncedQuery) as Route}
        onClick={onResultSelect}
      >
        Alle Ergebnisse anzeigen
        <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}
