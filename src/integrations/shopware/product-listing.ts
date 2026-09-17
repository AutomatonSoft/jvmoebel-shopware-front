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
const productListingAggregations = [
  {
    field: "categories.id",
    limit: 100,
    name: "categoryCounts",
    type: "terms",
  },
  {
    definition: "category",
    field: "categories.id",
    name: "categoryEntities",
    type: "entity",
  },
  {
    field: "manufacturerId",
    limit: 100,
    name: "manufacturerCounts",
    type: "terms",
  },
  {
    field: "properties.id",
    limit: 1000,
    name: "propertyCounts",
    type: "terms",
  },
] satisfies components["schemas"]["Aggregation"][];

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
  const context = await getShopwareContext(client);
  const categoryId =
    requestedCategoryId ?? context.salesChannel.navigationCategoryId;
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
  const response = await client.invoke(
    "readProductListing post /product-listing/{categoryId}",
    {
      body: {
        ...getShopwareProductSort(request.sort),
        aggregations: productListingAggregations,
        associations: productListingPageAssociations,
        includes: productListingPageIncludes,
        limit: shopProductPageSize,
        manufacturer:
          request.companyIds.length > 0
            ? request.companyIds.join("|")
            : undefined,
        "max-price": request.maximumPrice,
        "min-price": request.minimumPrice,
        page: request.page,
        "post-filter": categoryFilter,
        properties:
          request.propertyIds.length > 0
            ? request.propertyIds.join("|")
            : undefined,
      },
      fetchOptions: { cache: "no-store" },
      pathParams: { categoryId },
    },
  );

  return mapShopwareProductListingPage(
    response.data,
    request,
    context.currency?.isoCode || "EUR",
    context.languageInfo.localeCode || "de-DE",
  );
}
