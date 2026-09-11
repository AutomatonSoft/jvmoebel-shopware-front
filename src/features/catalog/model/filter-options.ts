import type {
  ShopProduct,
  ShopProductAttributeOption,
} from "@/features/catalog/model/product-listing";

export type ProductFilterOption<TValue extends string = string> = {
  count: number;
  label: string;
  value: TValue;
};

export type ProductAttributeFilterOption = ShopProductAttributeOption & {
  count: number;
};

export type ProductAttributeFilterGroup = {
  id: string;
  label: string;
  options: ProductAttributeFilterOption[];
};

export type ShopProductFilterOptions = {
  attributeGroups: ProductAttributeFilterGroup[];
  categories: ProductFilterOption[];
  companies: ProductFilterOption[];
};

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

function getAttributeGroups(products: readonly ShopProduct[]) {
  const groups = new Map<string, ProductAttributeFilterGroup>();

  for (const product of products) {
    for (const productGroup of product.attributes) {
      const group = groups.get(productGroup.id) ?? {
        id: productGroup.id,
        label: productGroup.label,
        options: [],
      };
      const countedOptions = new Set<string>();

      for (const productOption of productGroup.options) {
        if (countedOptions.has(productOption.value)) {
          continue;
        }

        countedOptions.add(productOption.value);
        const option = group.options.find(
          (candidate) => candidate.value === productOption.value,
        );

        if (option) {
          option.count += 1;
        } else {
          group.options.push({ ...productOption, count: 1 });
        }
      }

      if (group.options.length > 0) {
        groups.set(group.id, group);
      }
    }
  }

  return Array.from(groups.values());
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

export function buildShopProductFilterOptions(
  products: readonly ShopProduct[],
): ShopProductFilterOptions {
  return {
    attributeGroups: getAttributeGroups(products),
    categories: getCategoryOptions(products),
    companies: getCompanyOptions(products),
  };
}
