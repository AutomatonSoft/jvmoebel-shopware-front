import type {
  ShopProduct,
  ShopProductColor,
  ShopProductSize,
} from "@/lib/shopware/product-listing";

export type ProductFilterOption<TValue extends string = string> = {
  count: number;
  label: string;
  value: TValue;
};

export type ProductColorFilterOption = ShopProductColor & { count: number };

export type ShopProductFilterOptions = {
  categories: ProductFilterOption[];
  colors: ProductColorFilterOption[];
  companies: ProductFilterOption[];
  materials: ProductFilterOption[];
  sizes: ProductFilterOption<ShopProductSize>[];
};

const shopProductSizes = [
  { label: "Small", value: "small" },
  { label: "Medium", value: "medium" },
  { label: "Large", value: "large" },
  { label: "Extra large", value: "extra-large" },
] as const satisfies readonly Omit<
  ProductFilterOption<ShopProductSize>,
  "count"
>[];

function getCategoryOptions(products: readonly ShopProduct[]) {
  const options = new Map<string, ProductFilterOption>();

  for (const product of products) {
    const option = options.get(product.category);
    options.set(product.category, {
      count: (option?.count ?? 0) + 1,
      label: product.categoryLabel,
      value: product.category,
    });
  }

  return Array.from(options.values());
}

function getColorOptions(products: readonly ShopProduct[]) {
  const options = new Map<string, ProductColorFilterOption>();

  for (const product of products) {
    for (const color of product.colors) {
      const option = options.get(color.value);
      options.set(color.value, {
        ...color,
        count: (option?.count ?? 0) + 1,
      });
    }
  }

  return Array.from(options.values());
}

function getCompanyOptions(products: readonly ShopProduct[]) {
  const options = new Map<string, ProductFilterOption>();

  for (const product of products) {
    const option = options.get(product.company);
    options.set(product.company, {
      count: (option?.count ?? 0) + 1,
      label: product.company,
      value: product.company,
    });
  }

  return Array.from(options.values());
}

function getMaterialOptions(products: readonly ShopProduct[]) {
  const options = new Map<string, ProductFilterOption>();

  for (const product of products) {
    const option = options.get(product.material);
    options.set(product.material, {
      count: (option?.count ?? 0) + 1,
      label: product.material,
      value: product.material,
    });
  }

  return Array.from(options.values());
}

function getSizeOptions(products: readonly ShopProduct[]) {
  return shopProductSizes.map((size) => ({
    ...size,
    count: products.filter((product) => product.sizes.includes(size.value))
      .length,
  }));
}

export function buildShopProductFilterOptions(
  products: readonly ShopProduct[],
): ShopProductFilterOptions {
  return {
    categories: getCategoryOptions(products),
    colors: getColorOptions(products),
    companies: getCompanyOptions(products),
    materials: getMaterialOptions(products),
    sizes: getSizeOptions(products),
  };
}
