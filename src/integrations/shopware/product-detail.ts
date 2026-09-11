import "server-only";

import type { components } from "@shopware/api-client/store-api-types";

import type { ShopProductPageData } from "@/features/catalog/model/product-detail";
import type { ShopwareClient } from "@/integrations/shopware/client";
import { getShopwareContext } from "@/integrations/shopware/context";
import { mapShopwareProductDetail } from "@/integrations/shopware/mappers/product-detail";

const productDetailAssociations = {
  categories: {},
  cover: { associations: { media: {} } },
  deliveryTime: {},
  manufacturer: {},
  media: { associations: { media: {} } },
  properties: { associations: { group: {} } },
  unit: {},
} satisfies components["schemas"]["Associations"];

export async function getShopwareProductDetail(
  client: ShopwareClient,
  productId: string,
): Promise<ShopProductPageData | null> {
  const [context, response] = await Promise.all([
    getShopwareContext(client),
    client.invoke("readProductDetail post /product/{productId}", {
      body: { associations: productDetailAssociations },
      fetchOptions: { cache: "no-store" },
      pathParams: { productId },
      query: { skipCmsPage: true, skipConfigurator: true },
    }),
  ]);
  const product = response.data.product;

  if (!product) {
    return null;
  }

  return mapShopwareProductDetail({
    currency: context.currency?.isoCode || "EUR",
    locale: context.languageInfo.localeCode || "de-DE",
    product,
  });
}
