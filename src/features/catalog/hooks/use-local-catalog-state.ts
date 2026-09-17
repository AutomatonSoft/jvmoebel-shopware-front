"use client";

import {
  useCallback,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

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

export function useLocalCatalogState(
  products: readonly ShopProduct[],
  initialCategory?: Pick<ProductFilterOption, "label" | "value">,
) {
  const { maximumPriceBound, minimumPriceBound } = useMemo(() => {
    const prices = products.map((product) => product.unitPrice);

    return {
      maximumPriceBound: Math.ceil(Math.max(...prices) / 10) * 10,
      minimumPriceBound: Math.floor(Math.min(...prices) / 10) * 10,
    };
  }, [products]);
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
  const filters = useMemo(
    () => ({
      attributes: selectedAttributes,
      categories: selectedCategories,
      companies: selectedCompanies,
      maximumPrice,
      minimumPrice,
    }),
    [
      maximumPrice,
      minimumPrice,
      selectedAttributes,
      selectedCategories,
      selectedCompanies,
    ],
  );
  const { attributeGroups, categories, companies } = useMemo(() => {
    const {
      attributeGroups,
      categories: productCategories,
      companies,
    } = buildShopProductFilterOptions(products, filters);
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

    return { attributeGroups, categories, companies };
  }, [filters, initialCategory, products]);
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
  const filteredProducts = useMemo(
    () => filterAndSortShopProducts(products, filters, sort),
    [filters, products, sort],
  );
  const pagination = useMemo(
    () => paginateProducts(filteredProducts, currentPage),
    [currentPage, filteredProducts],
  );

  const resetPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedCategories([]);
    setSelectedAttributes({});
    setSelectedCompanies([]);
    setMinimumPrice(minimumPriceBound);
    setMaximumPrice(maximumPriceBound);
    resetPage();
  }, [maximumPriceBound, minimumPriceBound, resetPage]);

  const changeSort = useCallback(
    (value: ShopProductSort) => {
      setSort(value);
      resetPage();
    },
    [resetPage],
  );

  const changeMaximumPrice = useCallback(
    (value: number) => {
      setMaximumPrice(
        Math.max(minimumPrice, Math.min(value, maximumPriceBound)),
      );
      resetPage();
    },
    [maximumPriceBound, minimumPrice, resetPage],
  );
  const changeMinimumPrice = useCallback(
    (value: number) => {
      setMinimumPrice(
        Math.min(maximumPrice, Math.max(value, minimumPriceBound)),
      );
      resetPage();
    },
    [maximumPrice, minimumPriceBound, resetPage],
  );
  const changePriceRange = useCallback(
    (value: readonly [number, number]) => {
      const nextMinimumPrice = Math.max(
        minimumPriceBound,
        Math.min(value[0], maximumPriceBound),
      );
      const nextMaximumPrice = Math.min(
        maximumPriceBound,
        Math.max(value[1], nextMinimumPrice),
      );

      setMinimumPrice(nextMinimumPrice);
      setMaximumPrice(nextMaximumPrice);
      resetPage();
    },
    [maximumPriceBound, minimumPriceBound, resetPage],
  );
  const toggleCategory = useCallback(
    (value: string) => toggleValue(value, setSelectedCategories, resetPage),
    [resetPage],
  );
  const toggleAttribute = useCallback(
    (groupId: string, value: string) => {
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
    [resetPage],
  );
  const toggleCompany = useCallback(
    (value: string) => toggleValue(value, setSelectedCompanies, resetPage),
    [resetPage],
  );
  const filterPanelProps = useMemo(
    () => ({
      activeFilterCount,
      attributeGroups,
      categories,
      companies,
      maximumPrice,
      maximumPriceBound,
      minimumPrice,
      minimumPriceBound,
      onClear: clearFilters,
      onMaximumPriceChange: changeMaximumPrice,
      onMinimumPriceChange: changeMinimumPrice,
      onPriceRangeChange: changePriceRange,
      onToggleAttribute: toggleAttribute,
      onToggleCategory: toggleCategory,
      onToggleCompany: toggleCompany,
      selectedAttributes,
      selectedCategories,
      selectedCompanies,
    }),
    [
      activeFilterCount,
      attributeGroups,
      categories,
      changeMaximumPrice,
      changeMinimumPrice,
      changePriceRange,
      clearFilters,
      companies,
      maximumPrice,
      maximumPriceBound,
      minimumPrice,
      minimumPriceBound,
      selectedAttributes,
      selectedCategories,
      selectedCompanies,
      toggleAttribute,
      toggleCategory,
      toggleCompany,
    ],
  );
  const paginationProps = useMemo(
    () => ({
      currentPage: pagination.currentPage,
      onPageChange: setCurrentPage,
      pageSize: productsPerPage,
      totalPages: pagination.totalPages,
      totalProducts: pagination.totalProducts,
    }),
    [pagination.currentPage, pagination.totalPages, pagination.totalProducts],
  );

  return {
    clearFilters,
    filterPanelProps,
    isLoading: false,
    paginationProps,
    products: pagination.products,
    setSort: changeSort,
    sort,
  };
}
