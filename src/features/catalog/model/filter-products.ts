import type {
  ShopProduct,
  ShopProductSize,
} from "@/features/catalog/model/product-listing";

export type ShopProductFilters = Readonly<{
  categories: readonly string[];
  colors: readonly string[];
  companies?: readonly string[];
  materials: readonly string[];
  maximumPrice: number;
  minimumPrice: number;
  sizes?: readonly ShopProductSize[];
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
    const matchesColor =
      filters.colors.length === 0 ||
      product.colors.some((color) => filters.colors.includes(color.value));
    const matchesCompany =
      !filters.companies?.length || filters.companies.includes(product.company);
    const matchesMaterial =
      filters.materials.length === 0 ||
      filters.materials.includes(product.material);
    const matchesPrice =
      product.unitPrice >= filters.minimumPrice &&
      product.unitPrice <= filters.maximumPrice;
    const matchesSize =
      !filters.sizes?.length ||
      product.sizes.some((size) => filters.sizes?.includes(size));

    return (
      matchesCategory &&
      matchesColor &&
      matchesCompany &&
      matchesMaterial &&
      matchesPrice &&
      matchesSize
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
