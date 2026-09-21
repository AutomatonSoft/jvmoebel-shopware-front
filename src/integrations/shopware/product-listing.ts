import "server-only";

import type { components } from "@shopware/api-client/store-api-types";

import type { ShopProductListing } from "@/features/catalog/model/product-listing";
import type {
  ShopProductListingPage,
  ShopProductPageRequest,
} from "@/features/catalog/model/product-listing-page";
import { shopProductPageSize } from "@/features/catalog/model/product-listing-page";
import type { ShopwareClient } from "@/integrations/shopware/client";
import { getShopwareContext } from "@/integrations/shopware/context";
import { mapShopwareProductListing } from "@/integrations/shopware/mappers/product-listing";
import { mapShopwareProductListingPage } from "@/integrations/shopware/mappers/product-listing-page";

const completeProductListingPageSize = 100;
const productListingAssociations = {
  categories: {},
  cover: { associations: { media: {} } },
  manufacturer: {},
  properties: { associations: { group: {} } },
  seoUrls: {},
} satisfies components["schemas"]["Associations"];
const productListingPageAssociations = {
  cover: { associations: { media: {} } },
  manufacturer: {},
  properties: {},
  seoUrls: {
    filter: [
      {
        field: "routeName",
        type: "equals",
        value: "frontend.detail.page",
      },
      { field: "isCanonical", type: "equals", value: true },
      { field: "isDeleted", type: "equals", value: false },
    ],
  },
} satisfies components["schemas"]["Associations"];
const productListingIncludes = {
  category: ["id", "name", "path", "translated"],
  media: ["alt", "translated", "url"],
  product: [
    "calculatedPrice",
    "categories",
    "cover",
    "createdAt",
    "description",
    "id",
    "isNew",
    "manufacturer",
    "markAsTopseller",
    "name",
    "properties",
    "ratingAverage",
    "releaseDate",
    "seoUrls",
    "translated",
  ],
  product_manufacturer: ["id", "name", "translated"],
  product_media: ["media"],
  property_group: ["id", "name", "options", "translated"],
  property_group_option: [
    "colorHexCode",
    "group",
    "groupId",
    "id",
    "name",
    "translated",
  ],
  seo_url: ["isCanonical", "isDeleted", "routeName", "seoPathInfo"],
} satisfies components["schemas"]["Includes"];
const productListingPageIncludes = {
  category: ["id", "name", "translated"],
  media: ["alt", "translated", "url"],
  product: [
    "calculatedPrice",
    "cover",
    "id",
    "isNew",
    "manufacturer",
    "markAsTopseller",
    "name",
    "properties",
    "ratingAverage",
    "seoUrls",
    "translated",
  ],
  product_manufacturer: ["id", "name", "translated"],
  product_media: ["media"],
  property_group: ["id", "name", "options", "translated"],
  property_group_option: [
    "colorHexCode",
    "groupId",
    "id",
    "name",
    "translated",
  ],
  seo_url: ["isCanonical", "isDeleted", "routeName", "seoPathInfo"],
} satisfies components["schemas"]["Includes"];
type ShopwareCriteriaFilter = NonNullable<
  components["schemas"]["Criteria"]["filter"]
>[number];
type ShopwareTermsAggregation = components["schemas"]["AggregationTerms"] &
  components["schemas"]["SubAggregations"];

const staticProductListingAggregations = [
  {
    definition: "category",
    field: "categories.id",
    name: "categoryEntities",
    type: "entity",
  },
] satisfies components["schemas"]["Aggregation"][];

function getPropertyCountAggregationName(groupId: string) {
  return `propertyCounts_${groupId}`;
}

function getPropertyFilters(
  request: ShopProductPageRequest,
  excludedGroupId?: string,
): ShopwareCriteriaFilter[] {
  const groupedPropertyIds = new Set(
    Object.values(request.propertyGroups).flat(),
  );
  const propertyGroups: Array<[string, readonly string[]]> = Object.entries(
    request.propertyGroups,
  );
  const ungroupedPropertyIds = request.propertyIds.filter(
    (id) => !groupedPropertyIds.has(id),
  );

  if (ungroupedPropertyIds.length > 0) {
    propertyGroups.push(["ungrouped", ungroupedPropertyIds]);
  }

  return propertyGroups.flatMap(([groupId, propertyIds]) =>
    groupId === excludedGroupId || propertyIds.length === 0
      ? []
      : [
          {
            operator: "or" as const,
            queries: [
              {
                field: "product.optionIds",
                type: "equalsAny" as const,
                value: propertyIds.join("|"),
              },
              {
                field: "product.propertyIds",
                type: "equalsAny" as const,
                value: propertyIds.join("|"),
              },
            ],
            type: "multi" as const,
          },
        ],
  );
}

function getFacetFilters(
  request: ShopProductPageRequest,
  options: Readonly<{
    excludeCategory?: boolean;
    excludeManufacturer?: boolean;
    excludePropertyGroupId?: string;
  }> = {},
): ShopwareCriteriaFilter[] {
  const filters: ShopwareCriteriaFilter[] = [];

  if (!options.excludeCategory && request.categoryIds.length > 0) {
    filters.push({
      field: "categories.id",
      type: "equalsAny",
      value: request.categoryIds.join("|"),
    });
  }

  if (!options.excludeManufacturer && request.companyIds.length > 0) {
    filters.push({
      field: "manufacturerId",
      type: "equalsAny",
      value: request.companyIds.join("|"),
    });
  }

  if (
    request.minimumPrice !== undefined ||
    request.maximumPrice !== undefined
  ) {
    filters.push({
      field: "product.cheapestPrice",
      parameters: {
        gte: request.minimumPrice,
        lte: request.maximumPrice,
      },
      type: "range",
    });
  }

  filters.push(...getPropertyFilters(request, options.excludePropertyGroupId));

  return filters;
}

function getFilteredTermsAggregation(
  name: string,
  field: string,
  limit: number,
  filters: ShopwareCriteriaFilter[],
): components["schemas"]["Aggregation"] {
  const aggregation = {
    field,
    limit,
    name,
    type: "terms" as const,
  } satisfies ShopwareTermsAggregation;

  if (filters.length === 0) {
    return aggregation;
  }

  return {
    aggregation,
    // The generated SDK type contains one extra array level; the Store API
    // expects the same flat filter list used by Criteria.filter.
    filter:
      filters as unknown as components["schemas"]["AggregationFilter"]["filter"],
    name,
    type: "filter",
  };
}

function getProductListingAggregations(request: ShopProductPageRequest) {
  return [
    getFilteredTermsAggregation(
      "categoryCounts",
      "categories.id",
      100,
      getFacetFilters(request, { excludeCategory: true }),
    ),
    ...staticProductListingAggregations,
    getFilteredTermsAggregation(
      "manufacturerCounts",
      "manufacturerId",
      100,
      getFacetFilters(request, { excludeManufacturer: true }),
    ),
    getFilteredTermsAggregation(
      "propertyCounts",
      "properties.id",
      1000,
      getFacetFilters(request),
    ),
    ...Object.keys(request.propertyGroups).map((groupId) =>
      getFilteredTermsAggregation(
        getPropertyCountAggregationName(groupId),
        "properties.id",
        1000,
        getFacetFilters(request, { excludePropertyGroupId: groupId }),
      ),
    ),
  ];
}

async function requestCompleteProductListingPage(
  client: ShopwareClient,
  categoryId: string,
  page: number,
) {
  return client.invoke(
    "readProductListing post /product-listing/{categoryId}",
    {
      body: {
        associations: productListingAssociations,
        includes: productListingIncludes,
        limit: completeProductListingPageSize,
        page,
      },
      fetchOptions: { cache: "no-store" },
      pathParams: { categoryId },
    },
  );
}

export async function getShopwareProductListing(
  client: ShopwareClient,
  requestedCategoryId?: string,
): Promise<ShopProductListing | null> {
  const context = await getShopwareContext(client);
  const categoryId =
    requestedCategoryId ?? context.salesChannel.navigationCategoryId;
  const products: components["schemas"]["Product"][] = [];
  let page = 1;
  let total: number | undefined;

  do {
    const response = await requestCompleteProductListingPage(
      client,
      categoryId,
      page,
    );
    const pageProducts = response.data.elements;

    products.push(...pageProducts);
    total = response.data.total;

    if (pageProducts.length < completeProductListingPageSize) {
      break;
    }

    page += 1;
  } while (total === undefined || products.length < total);

  return mapShopwareProductListing({
    currency: context.currency?.isoCode || "EUR",
    locale: context.languageInfo.localeCode || "de-DE",
    products,
  });
}

function getShopwareProductSort(sort: ShopProductPageRequest["sort"]) {
  switch (sort) {
    case "newest":
      return { sort: [{ field: "createdAt", order: "DESC" as const }] };
    case "price-ascending":
      return { order: "price-asc" };
    case "price-descending":
      return { order: "price-desc" };
    case "rating":
      return { sort: [{ field: "ratingAverage", order: "DESC" as const }] };
    default:
      return {};
  }
}

export async function getShopwareProductListingPage(
  client: ShopwareClient,
  request: ShopProductPageRequest,
  requestedCategoryId?: string,
): Promise<ShopProductListingPage> {
  const contextPromise = getShopwareContext(client);
  const categoryFilter =
    request.categoryIds.length > 0
      ? [
          {
            field: "categories.id",
            type: "equalsAny" as const,
            value: request.categoryIds.join("|"),
          },
        ]
      : undefined;
  const body = {
    ...getShopwareProductSort(request.sort),
    aggregations: getProductListingAggregations(request),
    associations: productListingPageAssociations,
    includes: productListingPageIncludes,
    limit: shopProductPageSize,
    manufacturer:
      request.companyIds.length > 0 ? request.companyIds.join("|") : undefined,
    "max-price": request.maximumPrice,
    "min-price": request.minimumPrice,
    page: request.page,
    "post-filter": categoryFilter,
    properties:
      request.propertyIds.length > 0
        ? request.propertyIds.join("|")
        : undefined,
  };
  const responsePromise = request.search
    ? client.invoke("searchPage post /search", {
        body: { ...body, search: request.search },
        fetchOptions: { cache: "no-store" },
      })
    : client.invoke("readProductListing post /product-listing/{categoryId}", {
        body,
        fetchOptions: { cache: "no-store" },
        pathParams: {
          categoryId:
            requestedCategoryId ??
            (await contextPromise).salesChannel.navigationCategoryId,
        },
      });
  const [context, response] = await Promise.all([
    contextPromise,
    responsePromise,
  ]);

  return mapShopwareProductListingPage(
    response.data,
    request,
    context.currency?.isoCode || "EUR",
    context.languageInfo.localeCode || "de-DE",
  );
}
