import type { components } from "@shopware/api-client/store-api-types";

import type {
  ProductAttributeFilterGroup,
  ProductFilterOption,
  ShopProductFilterOptions,
} from "@/features/catalog/model/filter-options";
import type { ShopProductListingPage } from "@/features/catalog/model/product-listing-page";
import type { ShopProductPageRequest } from "@/features/catalog/model/product-listing-page";
import {
  createShopwareProductListing,
  getShopwareTranslatedName,
} from "@/integrations/shopware/mappers/product-listing";

type ShopwareProductListingResult =
  components["schemas"]["ProductListingResult"];
type ShopwareCategory = components["schemas"]["Category"];
type ShopwareManufacturer = components["schemas"]["ProductManufacturer"];
type ShopwarePropertyGroup = components["schemas"]["PropertyGroup"];

type AggregationBucket = Readonly<{ count: number; key: string }>;
type BucketAggregation = Readonly<{ buckets?: readonly AggregationBucket[] }>;
type EntityAggregation<TEntity> = Readonly<{
  entities?: readonly TEntity[];
}>;
type PriceAggregation = Readonly<{ max?: number | null; min?: number | null }>;
type ProductListingAggregations = Readonly<{
  categoryCounts?: BucketAggregation;
  categoryEntities?: EntityAggregation<ShopwareCategory>;
  manufacturer?: EntityAggregation<ShopwareManufacturer>;
  manufacturerCounts?: BucketAggregation;
  price?: PriceAggregation;
  properties?: EntityAggregation<ShopwarePropertyGroup>;
  propertyCounts?: BucketAggregation;
}>;

function getAggregationCounts(aggregation?: BucketAggregation) {
  return new Map(
    (aggregation?.buckets ?? []).map((bucket) => [bucket.key, bucket.count]),
  );
}

function mapEntityOptions(
  entities: readonly Readonly<{
    id: string;
    name?: string | null;
    translated?: { name?: string | null };
  }>[] = [],
  aggregation?: BucketAggregation,
): ProductFilterOption[] {
  const counts = getAggregationCounts(aggregation);

  return entities.flatMap((entity) => {
    const label = getShopwareTranslatedName(entity);
    const count = counts.get(entity.id) ?? 0;

    return label && count > 0 ? [{ count, label, value: entity.id }] : [];
  });
}

function mapAttributeGroups(
  groups: readonly ShopwarePropertyGroup[] = [],
  aggregation?: BucketAggregation,
): ProductAttributeFilterGroup[] {
  const counts = getAggregationCounts(aggregation);

  return groups.flatMap((group) => {
    const label = getShopwareTranslatedName(group);
    const options = (group.options ?? []).flatMap((option) => {
      const optionLabel = getShopwareTranslatedName(option);
      const count = counts.get(option.id) ?? 0;
      const hex =
        option.translated?.colorHexCode?.trim() ||
        option.colorHexCode?.trim() ||
        undefined;

      return optionLabel && count > 0
        ? [
            {
              count,
              hex: hex && /^#[0-9a-f]{3,8}$/i.test(hex) ? hex : undefined,
              label: optionLabel,
              value: option.id,
            },
          ]
        : [];
    });

    return label && options.length > 0
      ? [{ id: group.id, label, options }]
      : [];
  });
}

function getSelectedAttributes(
  filterOptions: ShopProductFilterOptions,
  propertyIds: readonly string[],
) {
  const selectedPropertyIds = new Set(propertyIds);

  return Object.fromEntries(
    filterOptions.attributeGroups.flatMap((group) => {
      const selectedOptions = group.options
        .filter((option) => selectedPropertyIds.has(option.value))
        .map((option) => option.value);

      return selectedOptions.length > 0 ? [[group.id, selectedOptions]] : [];
    }),
  );
}

export function mapShopwareProductListingPage(
  response: ShopwareProductListingResult,
  request: ShopProductPageRequest,
  currency: string,
  locale: string,
): ShopProductListingPage {
  const listing = createShopwareProductListing({
    currency,
    locale,
    products: response.elements,
  });

  const aggregations = response.aggregations as unknown as
    ProductListingAggregations | undefined;
  const minimumPriceBound =
    Math.floor((aggregations?.price?.min ?? 0) / 10) * 10;
  const maximumPriceBound =
    Math.ceil((aggregations?.price?.max ?? 0) / 10) * 10;
  const filterOptions = {
    attributeGroups: mapAttributeGroups(
      aggregations?.properties?.entities,
      aggregations?.propertyCounts,
    ),
    categories: mapEntityOptions(
      aggregations?.categoryEntities?.entities,
      aggregations?.categoryCounts,
    ),
    companies: mapEntityOptions(
      aggregations?.manufacturer?.entities,
      aggregations?.manufacturerCounts,
    ),
  };
  const pageSize = response.limit ?? 12;
  const totalProducts = response.total ?? response.elements.length;

  return {
    ...listing,
    filterOptions,
    filters: {
      attributes: getSelectedAttributes(filterOptions, request.propertyIds),
      categories: request.categoryIds,
      companies: request.companyIds,
      maximumPrice: request.maximumPrice ?? maximumPriceBound,
      minimumPrice: request.minimumPrice ?? minimumPriceBound,
    },
    pagination: {
      currentPage: response.page ?? request.page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(totalProducts / pageSize)),
      totalProducts,
    },
    priceRange: {
      maximum: maximumPriceBound,
      minimum: minimumPriceBound,
    },
    sort: request.sort,
  };
}
