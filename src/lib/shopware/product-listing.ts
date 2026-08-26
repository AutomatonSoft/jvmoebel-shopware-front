export type ShopProductColor = Readonly<{
  hex: string;
  label: string;
  value: string;
}>;

export type ShopProductSize = "small" | "medium" | "large" | "extra-large";

export type ShopProduct = Readonly<{
  badge?: string;
  category: string;
  categoryLabel: string;
  colors: readonly ShopProductColor[];
  company: string;
  createdAt: string;
  description: string;
  featuredRank: number;
  id: string;
  image: Readonly<{
    alt: string;
    url: string;
  }>;
  material: string;
  name: string;
  previousPrice?: number;
  rating?: number;
  reviewCount?: number;
  sizes: readonly ShopProductSize[];
  unitPrice: number;
  url: string;
}>;

export type ShopProductListing = Readonly<{
  currency: string;
  description: string;
  eyebrow: string;
  locale: string;
  products: readonly ShopProduct[];
  title: string;
}>;

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
