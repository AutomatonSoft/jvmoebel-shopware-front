import type { ShopProduct } from "@/features/catalog/model/product-listing";

export type ShopProductFilters = Readonly<{
  attributes?: Readonly<Record<string, readonly string[]>>;
  categories: readonly string[];
  companies?: readonly string[];
  maximumPrice: number;
  minimumPrice: number;
}>;

export type ShopProductSort =
  "featured" | "newest" | "price-ascending" | "price-descending" | "rating";

export function filterAndSortShopProducts(
  products: readonly ShopProduct[],
  filters: ShopProductFilters,
  sort: ShopProductSort,
) {
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      filters.categories.length === 0 ||
      filters.categories.includes(product.category);
    const matchesAttributes = Object.entries(filters.attributes ?? {}).every(
      ([groupId, selectedOptions]) =>
        selectedOptions.length === 0 ||
        product.attributes.some(
          (group) =>
            group.id === groupId &&
            group.options.some((option) =>
              selectedOptions.includes(option.value),
            ),
        ),
    );
    const matchesCompany =
      !filters.companies?.length || filters.companies.includes(product.company);
    const matchesPrice =
      product.unitPrice >= filters.minimumPrice &&
      product.unitPrice <= filters.maximumPrice;

    return (
      matchesAttributes && matchesCategory && matchesCompany && matchesPrice
    );
  });

  return filteredProducts.toSorted((first, second) => {
    switch (sort) {
      case "newest":
        return second.createdAt.localeCompare(first.createdAt);
      case "price-ascending":
        return first.unitPrice - second.unitPrice;
      case "price-descending":
        return second.unitPrice - first.unitPrice;
      case "rating":
        return (second.rating ?? 0) - (first.rating ?? 0);
      default:
        return first.featuredRank - second.featuredRank;
    }
  });
}
