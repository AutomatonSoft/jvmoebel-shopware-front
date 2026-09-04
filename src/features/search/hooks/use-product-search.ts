"use client";

import { useEffect, useState } from "react";

import type { ProductSearchResponse } from "@/features/search/model/product-search";

const SEARCH_DEBOUNCE_MS = 300;

type SearchRequestState = Readonly<{
  errorMessage?: string;
  query: string;
  response?: ProductSearchResponse;
  status: "idle" | "loading" | "success" | "error";
}>;

export function useProductSearch(query: string, isOpen: boolean) {
  const [request, setRequest] = useState<SearchRequestState>({
    query: "",
    status: "idle",
  });
  const normalizedQuery = query.trim();

  useEffect(() => {
    if (!isOpen || !normalizedQuery) return;

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setRequest({ query: normalizedQuery, status: "loading" });

      try {
        const response = await fetch(
          `/api/products/search?query=${encodeURIComponent(normalizedQuery)}`,
          { cache: "no-store", signal: controller.signal },
        );

        if (!response.ok) throw new Error("Product search request failed.");

        const data = (await response.json()) as ProductSearchResponse;
        if (controller.signal.aborted) return;

        setRequest({
          query: normalizedQuery,
          response: data,
          status: "success",
        });
      } catch (error) {
        if (
          controller.signal.aborted ||
          (error instanceof DOMException && error.name === "AbortError")
        ) {
          return;
        }

        setRequest({
          errorMessage: "Search is temporarily unavailable. Please try again.",
          query: normalizedQuery,
          status: "error",
        });
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [isOpen, normalizedQuery]);

  const hasCurrentResponse = request.query === normalizedQuery;

  return {
    currency: request.response?.currency ?? "EUR",
    debouncedQuery: hasCurrentResponse ? request.query : normalizedQuery,
    errorMessage:
      hasCurrentResponse && request.status === "error"
        ? request.errorMessage
        : undefined,
    isSearching:
      Boolean(normalizedQuery) &&
      (!hasCurrentResponse || request.status === "loading"),
    locale: request.response?.locale ?? "de-DE",
    results: hasCurrentResponse ? (request.response?.results ?? []) : [],
  };
}
