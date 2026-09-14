import type {
  ShopProduct,
  ShopProductAttributeOption,
} from "@/features/catalog/model/product-listing";
import {
  filterShopProducts,
  type ShopProductFilters,
} from "@/features/catalog/model/filter-products";

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

function updateOptionCounts<
  TOption extends Readonly<{ count: number; value: string }>,
>(
  options: readonly TOption[],
  countedOptions: readonly Readonly<{ count: number; value: string }>[],
) {
  const counts = new Map(
    countedOptions.map((option) => [option.value, option.count]),
  );

  return options.map((option) => ({
    ...option,
    count: counts.get(option.value) ?? 0,
  }));
}

function getFiltersWithoutAttributeGroup(
  filters: ShopProductFilters,
  groupId: string,
): ShopProductFilters {
  return {
    ...filters,
    attributes: Object.fromEntries(
      Object.entries(filters.attributes ?? {}).filter(
        ([candidateId]) => candidateId !== groupId,
      ),
    ),
  };
}

export function buildShopProductFilterOptions(
  products: readonly ShopProduct[],
  filters?: ShopProductFilters,
): ShopProductFilterOptions {
  const options = {
    attributeGroups: getAttributeGroups(products),
    categories: getCategoryOptions(products),
    companies: getCompanyOptions(products),
  };

  if (!filters) {
    return options;
  }

  const categoryProducts = filterShopProducts(products, {
    ...filters,
    categories: [],
  });
  const companyProducts = filterShopProducts(products, {
    ...filters,
    companies: [],
  });

  return {
    attributeGroups: options.attributeGroups.map((group) => {
      const groupProducts = filterShopProducts(
        products,
        getFiltersWithoutAttributeGroup(filters, group.id),
      );
      const countedGroup = getAttributeGroups(groupProducts).find(
        (candidate) => candidate.id === group.id,
      );

      return {
        ...group,
        options: updateOptionCounts(group.options, countedGroup?.options ?? []),
      };
    }),
    categories: updateOptionCounts(
      options.categories,
      getCategoryOptions(categoryProducts),
    ),
    companies: updateOptionCounts(
      options.companies,
      getCompanyOptions(companyProducts),
    ),
  };
}
