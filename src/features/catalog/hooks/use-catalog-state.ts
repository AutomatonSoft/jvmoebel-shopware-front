"use client";

import { useState, type Dispatch, type SetStateAction } from "react";

import { buildShopProductFilterOptions } from "@/features/catalog/model/filter-options";
import type { ProductFilterOption } from "@/features/catalog/model/filter-options";
import {
  filterAndSortShopProducts,
  type ShopProductSort,
} from "@/features/catalog/model/filter-products";
import {
  paginateProducts,
  productsPerPage,
} from "@/features/catalog/model/paginate-products";
import type { ShopProduct } from "@/features/catalog/model/product-listing";

function toggleValue<TValue extends string>(
  value: TValue,
  setValues: Dispatch<SetStateAction<TValue[]>>,
  resetPage: () => void,
) {
  setValues((values) =>
    values.includes(value)
      ? values.filter((selectedValue) => selectedValue !== value)
      : [...values, value],
  );
  resetPage();
}

export function useCatalogState(
  products: readonly ShopProduct[],
  initialCategory?: Pick<ProductFilterOption, "label" | "value">,
) {
  const prices = products.map((product) => product.unitPrice);
  const minimumPriceBound = Math.floor(Math.min(...prices) / 10) * 10;
  const maximumPriceBound = Math.ceil(Math.max(...prices) / 10) * 10;
  const {
    attributeGroups,
    categories: productCategories,
    companies,
  } = buildShopProductFilterOptions(products);
  const categoryCount =
    productCategories.find(
      (category) => category.value === initialCategory?.value,
    )?.count ?? 0;
  const categories = initialCategory
    ? [
        { ...initialCategory, count: categoryCount },
        ...productCategories.filter(
          (category) => category.value !== initialCategory.value,
        ),
      ]
    : productCategories;
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() =>
    initialCategory ? [initialCategory.value] : [],
  );
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string[]>
  >({});
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [minimumPrice, setMinimumPrice] = useState(minimumPriceBound);
  const [maximumPrice, setMaximumPrice] = useState(maximumPriceBound);
  const [sort, setSort] = useState<ShopProductSort>("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const activeFilterCount =
    selectedCategories.length +
    selectedCompanies.length +
    Object.values(selectedAttributes).reduce(
      (count, values) => count + values.length,
      0,
    ) +
    (minimumPrice !== minimumPriceBound || maximumPrice !== maximumPriceBound
      ? 1
      : 0);
  const filteredProducts = filterAndSortShopProducts(
    products,
    {
      attributes: selectedAttributes,
      categories: selectedCategories,
      companies: selectedCompanies,
      maximumPrice,
      minimumPrice,
    },
    sort,
  );
  const pagination = paginateProducts(filteredProducts, currentPage);

  function resetPage() {
    setCurrentPage(1);
  }

  function clearFilters() {
    setSelectedCategories([]);
    setSelectedAttributes({});
    setSelectedCompanies([]);
    setMinimumPrice(minimumPriceBound);
    setMaximumPrice(maximumPriceBound);
    resetPage();
  }

  function changeSort(value: ShopProductSort) {
    setSort(value);
    resetPage();
  }

  return {
    clearFilters,
    filterPanelProps: {
      activeFilterCount,
      attributeGroups,
      categories,
      companies,
      maximumPrice,
      maximumPriceBound,
      minimumPrice,
      minimumPriceBound,
      onClear: clearFilters,
      onMaximumPriceChange: (value: number) => {
        setMaximumPrice(
          Math.max(minimumPrice, Math.min(value, maximumPriceBound)),
        );
        resetPage();
      },
      onMinimumPriceChange: (value: number) => {
        setMinimumPrice(
          Math.min(maximumPrice, Math.max(value, minimumPriceBound)),
        );
        resetPage();
      },
      onToggleCategory: (value: string) =>
        toggleValue(value, setSelectedCategories, resetPage),
      onToggleAttribute: (groupId: string, value: string) => {
        setSelectedAttributes((attributes) => {
          const groupValues = attributes[groupId] ?? [];
          const nextGroupValues = groupValues.includes(value)
            ? groupValues.filter((selectedValue) => selectedValue !== value)
            : [...groupValues, value];

          if (nextGroupValues.length === 0) {
            const { [groupId]: removedGroup, ...remainingAttributes } =
              attributes;
            void removedGroup;

            return remainingAttributes;
          }

          return { ...attributes, [groupId]: nextGroupValues };
        });
        resetPage();
      },
      onToggleCompany: (value: string) =>
        toggleValue(value, setSelectedCompanies, resetPage),
      selectedAttributes,
      selectedCategories,
      selectedCompanies,
    },
    paginationProps: {
      currentPage: pagination.currentPage,
      onPageChange: setCurrentPage,
      pageSize: productsPerPage,
      totalPages: pagination.totalPages,
      totalProducts: pagination.totalProducts,
    },
    products: pagination.products,
    setSort: changeSort,
    sort,
  };
}
