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
} satisfies components["schemas"]["Associations"];

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
): Promise<ShopProductListing | null> {
  const context = await getShopwareContext(client);
  const categoryId = context.salesChannel.navigationCategoryId;
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
