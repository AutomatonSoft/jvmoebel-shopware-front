import "server-only";

import type { components } from "@shopware/api-client/store-api-types";

import type { ShopProductListing } from "@/features/catalog/model/product-listing";
import type { ShopwareClient } from "@/integrations/shopware/client";
import { getShopwareContext } from "@/integrations/shopware/context";
import { mapShopwareProductListing } from "@/integrations/shopware/mappers/product-listing";

const productListingPageSize = 100;
const productListingAssociations = {
  categories: {},
  cover: { associations: { media: {} } },
  manufacturer: {},
  properties: { associations: { group: {} } },
  seoUrls: {},
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
  product_manufacturer: ["name", "translated"],
  product_media: ["media"],
  property_group: ["id", "name", "translated"],
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

async function getShopwareProductListingPage(
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
        limit: productListingPageSize,
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
    const response = await getShopwareProductListingPage(
      client,
      categoryId,
      page,
    );
    const pageProducts = response.data.elements;

    products.push(...pageProducts);
    total = response.data.total;

    if (pageProducts.length < productListingPageSize) {
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
