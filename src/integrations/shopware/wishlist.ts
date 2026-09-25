import "server-only";

import type { components } from "@shopware/api-client/store-api-types";

import type { ShopProductListing } from "@/features/catalog/model/product-listing";
import type { ShopwareClient } from "@/integrations/shopware/client";
import { getShopwareContext } from "@/integrations/shopware/context";
import {
  createShopwareProductListing,
  mapShopwareProductCard,
} from "@/integrations/shopware/mappers/product-listing";

const wishlistProductAssociations = {
  cover: { associations: { media: { associations: { thumbnails: {} } } } },
  manufacturer: {},
  properties: { associations: { group: {} } },
  seoUrls: {
    filter: [
      { field: "routeName", type: "equals", value: "frontend.detail.page" },
      { field: "isCanonical", type: "equals", value: true },
      { field: "isDeleted", type: "equals", value: false },
    ],
  },
} satisfies components["schemas"]["Associations"];

const wishlistProductIncludes = {
  media: ["alt", "thumbnails", "translated", "url"],
  media_thumbnail: ["height", "url", "width"],
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
    "group",
    "groupId",
    "id",
    "name",
    "translated",
  ],
  seo_url: ["isCanonical", "isDeleted", "routeName", "seoPathInfo"],
} satisfies components["schemas"]["Includes"];

export async function getShopwareWishlistProducts(
  client: ShopwareClient,
  productIds: readonly string[],
): Promise<ShopProductListing> {
  const contextPromise = getShopwareContext(client);
  const responsePromise = client.invoke("searchPage post /search", {
    body: {
      associations: wishlistProductAssociations,
      ids: [...productIds],
      includes: wishlistProductIncludes,
      limit: productIds.length,
    },
    fetchOptions: { cache: "no-store" },
  });
  const [context, response] = await Promise.all([
    contextPromise,
    responsePromise,
  ]);
  const productsById = new Map(
    response.data.elements.map((product) => [product.id, product]),
  );
  const products = productIds.flatMap((productId) => {
    const product = productsById.get(productId);

    return product ? [product] : [];
  });

  return createShopwareProductListing(
    {
      currency: context.currency?.isoCode || "EUR",
      locale: context.languageInfo.localeCode || "de-DE",
      products,
    },
    mapShopwareProductCard,
  );
}
