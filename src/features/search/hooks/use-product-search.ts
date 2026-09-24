"use client";

import { useEffect, useState } from "react";

import type { ProductSearchResponse } from "@/features/search/model/product-search";

const SEARCH_DEBOUNCE_MS = 300;

type SearchRequestState = Readonly<{
  errorMessage?: string;
  query: string;
  requestId?: number;
  response?: ProductSearchResponse;
  status: "idle" | "success" | "error";
}>;

export function useProductSearch(query: string, isOpen: boolean) {
  const normalizedQuery = query.trim();
  const [request, setRequest] = useState<SearchRequestState>({
    query: "",
    status: "idle",
  });
  const [searchSession, setSearchSession] = useState(() => ({
    isOpen,
    query: normalizedQuery,
    requestId: 0,
  }));

  if (
    searchSession.isOpen !== isOpen ||
    searchSession.query !== normalizedQuery
  ) {
    const requestId = searchSession.requestId + 1;
    setSearchSession({
      isOpen,
      query: normalizedQuery,
      requestId,
    });
    setRequest({ query: normalizedQuery, requestId, status: "idle" });
  }

  useEffect(() => {
    if (!isOpen || !normalizedQuery) return;

    const controller = new AbortController();
    const requestId = searchSession.requestId;
    const timeout = window.setTimeout(async () => {
      try {
        const response = await fetch(
          `/bff/products/search?query=${encodeURIComponent(normalizedQuery)}`,
          { cache: "no-store", signal: controller.signal },
        );

        if (!response.ok) throw new Error("Product search request failed.");

        const data = (await response.json()) as ProductSearchResponse;
        if (controller.signal.aborted) return;

        setRequest({
          query: normalizedQuery,
          requestId,
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
          errorMessage:
            "Die Suche ist vorübergehend nicht verfügbar. Bitte versuchen Sie es erneut.",
          query: normalizedQuery,
          requestId,
          status: "error",
        });
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [isOpen, normalizedQuery, searchSession.requestId]);

  const hasCurrentResponse =
    isOpen &&
    request.query === normalizedQuery &&
    request.requestId === searchSession.requestId &&
    request.status !== "idle";

  return {
    currency: hasCurrentResponse
      ? (request.response?.currency ?? "EUR")
      : "EUR",
    debouncedQuery: hasCurrentResponse ? request.query : normalizedQuery,
    errorMessage:
      hasCurrentResponse && request.status === "error"
        ? request.errorMessage
        : undefined,
    isSearching: Boolean(isOpen && normalizedQuery) && !hasCurrentResponse,
    locale: hasCurrentResponse
      ? (request.response?.locale ?? "de-DE")
      : "de-DE",
    results:
      hasCurrentResponse && request.status === "success"
        ? (request.response?.results ?? [])
        : [],
  };
}
