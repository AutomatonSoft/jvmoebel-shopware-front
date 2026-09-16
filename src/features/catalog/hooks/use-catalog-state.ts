"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Route } from "next";
import { useTransition } from "react";

import type { ShopProductSort } from "@/features/catalog/model/filter-products";
import type { ShopProductListingPage } from "@/features/catalog/model/product-listing-page";

type QueryValue = string | readonly string[] | undefined;

function toggleValue(value: string, values: readonly string[]) {
  return values.includes(value)
    ? values.filter((selectedValue) => selectedValue !== value)
    : [...values, value];
}

function setQueryValue(
  parameters: URLSearchParams,
  key: string,
  value: QueryValue,
) {
  parameters.delete(key);

  if (typeof value === "string") {
    parameters.set(key, value);
  } else if (value) {
    value.forEach((entry) => parameters.append(key, entry));
  }
}

export function useCatalogState(listing: ShopProductListingPage) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParameters = useSearchParams();
  const [isLoading, startTransition] = useTransition();
  const { filterOptions, filters, pagination, priceRange, sort } = listing;
  const selectedAttributes = filters.attributes ?? {};
  const selectedCategories = filters.categories;
  const selectedCompanies = filters.companies ?? [];
  const activeFilterCount =
    selectedCategories.length +
    selectedCompanies.length +
    Object.values(selectedAttributes).reduce(
      (count, values) => count + values.length,
      0,
    ) +
    (filters.minimumPrice !== priceRange.minimum ||
    filters.maximumPrice !== priceRange.maximum
      ? 1
      : 0);

  function navigate(updates: Readonly<Record<string, QueryValue>>) {
    const parameters = new URLSearchParams(searchParameters.toString());

    Object.entries(updates).forEach(([key, value]) =>
      setQueryValue(parameters, key, value),
    );

    const query = parameters.toString();

    startTransition(() => {
      router.push((query ? `${pathname}?${query}` : pathname) as Route, {
        scroll: false,
      });
    });
  }

  function resetPage(updates: Readonly<Record<string, QueryValue>>) {
    navigate({ ...updates, page: undefined });
  }

  function getPriceParameter(value: number, bound: number) {
    return value === bound ? undefined : String(value);
  }

  return {
    clearFilters: () =>
      resetPage({
        category: undefined,
        categoryLabel: undefined,
        manufacturer: undefined,
        maxPrice: undefined,
        minPrice: undefined,
        property: undefined,
      }),
    filterPanelProps: {
      activeFilterCount,
      attributeGroups: filterOptions.attributeGroups,
      categories: filterOptions.categories,
      companies: filterOptions.companies,
      maximumPrice: filters.maximumPrice,
      maximumPriceBound: priceRange.maximum,
      minimumPrice: filters.minimumPrice,
      minimumPriceBound: priceRange.minimum,
      onClear: () =>
        resetPage({
          category: undefined,
          categoryLabel: undefined,
          manufacturer: undefined,
          maxPrice: undefined,
          minPrice: undefined,
          property: undefined,
        }),
      onMaximumPriceChange: (value: number) => {
        const maximumPrice = Math.max(
          filters.minimumPrice,
          Math.min(value, priceRange.maximum),
        );
        resetPage({
          maxPrice: getPriceParameter(maximumPrice, priceRange.maximum),
        });
      },
      onMinimumPriceChange: (value: number) => {
        const minimumPrice = Math.min(
          filters.maximumPrice,
          Math.max(value, priceRange.minimum),
        );
        resetPage({
          minPrice: getPriceParameter(minimumPrice, priceRange.minimum),
        });
      },
      onPriceRangeChange: (value: readonly [number, number]) => {
        const minimumPrice = Math.max(
          priceRange.minimum,
          Math.min(value[0], priceRange.maximum),
        );
        const maximumPrice = Math.min(
          priceRange.maximum,
          Math.max(value[1], minimumPrice),
        );
        resetPage({
          maxPrice: getPriceParameter(maximumPrice, priceRange.maximum),
          minPrice: getPriceParameter(minimumPrice, priceRange.minimum),
        });
      },
      onToggleAttribute: (groupId: string, value: string) => {
        const properties = Object.entries(selectedAttributes).flatMap(
          ([candidateGroupId, selectedOptions]) =>
            candidateGroupId === groupId
              ? toggleValue(value, selectedOptions)
              : selectedOptions,
        );

        if (!(groupId in selectedAttributes)) {
          properties.push(value);
        }

        resetPage({ property: properties });
      },
      onToggleCategory: (value: string) =>
        resetPage({
          category: toggleValue(value, selectedCategories),
          categoryLabel: undefined,
        }),
      onToggleCompany: (value: string) =>
        resetPage({
          manufacturer: toggleValue(value, selectedCompanies),
        }),
      selectedAttributes,
      selectedCategories,
      selectedCompanies,
    },
    isLoading,
    paginationProps: {
      ...pagination,
      onPageChange: (page: number) =>
        navigate({ page: page === 1 ? undefined : String(page) }),
    },
    products: listing.products,
    setSort: (value: ShopProductSort) =>
      resetPage({ sort: value === "featured" ? undefined : value }),
    sort,
  };
}
