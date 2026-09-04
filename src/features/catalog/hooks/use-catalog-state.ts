"use client";

import { useState, type Dispatch, type SetStateAction } from "react";

import { buildShopProductFilterOptions } from "@/features/catalog/model/filter-options";
import {
  filterAndSortShopProducts,
  type ShopProductSort,
} from "@/features/catalog/model/filter-products";
import {
  paginateProducts,
  productsPerPage,
} from "@/features/catalog/model/paginate-products";
import type {
  ShopProduct,
  ShopProductSize,
} from "@/features/catalog/model/product-listing";

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

export function useCatalogState(products: readonly ShopProduct[]) {
  const prices = products.map((product) => product.unitPrice);
  const minimumPriceBound = Math.floor(Math.min(...prices) / 10) * 10;
  const maximumPriceBound = Math.ceil(Math.max(...prices) / 10) * 10;
  const { categories, colors, companies, materials, sizes } =
    buildShopProductFilterOptions(products);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<ShopProductSize[]>([]);
  const [minimumPrice, setMinimumPrice] = useState(minimumPriceBound);
  const [maximumPrice, setMaximumPrice] = useState(maximumPriceBound);
  const [sort, setSort] = useState<ShopProductSort>("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const activeFilterCount =
    selectedCategories.length +
    selectedColors.length +
    selectedCompanies.length +
    selectedMaterials.length +
    selectedSizes.length +
    (minimumPrice !== minimumPriceBound || maximumPrice !== maximumPriceBound
      ? 1
      : 0);
  const filteredProducts = filterAndSortShopProducts(
    products,
    {
      categories: selectedCategories,
      colors: selectedColors,
      companies: selectedCompanies,
      materials: selectedMaterials,
      maximumPrice,
      minimumPrice,
      sizes: selectedSizes,
    },
    sort,
  );
  const pagination = paginateProducts(filteredProducts, currentPage);

  function resetPage() {
    setCurrentPage(1);
  }

  function clearFilters() {
    setSelectedCategories([]);
    setSelectedColors([]);
    setSelectedCompanies([]);
    setSelectedMaterials([]);
    setSelectedSizes([]);
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
      categories,
      colors,
      companies,
      materials,
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
      onToggleColor: (value: string) =>
        toggleValue(value, setSelectedColors, resetPage),
      onToggleCompany: (value: string) =>
        toggleValue(value, setSelectedCompanies, resetPage),
      onToggleMaterial: (value: string) =>
        toggleValue(value, setSelectedMaterials, resetPage),
      onToggleSize: (value: ShopProductSize) =>
        toggleValue(value, setSelectedSizes, resetPage),
      selectedCategories,
      selectedColors,
      selectedCompanies,
      selectedMaterials,
      selectedSizes,
      sizes,
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
