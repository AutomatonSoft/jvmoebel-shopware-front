import "server-only";

import type { components } from "@shopware/api-client/store-api-types";

import type { ShopProductPageData } from "@/features/catalog/model/product-detail";
import type { ShopwareClient } from "@/integrations/shopware/client";
import { getShopwareContext } from "@/integrations/shopware/context";
import { mapShopwareProductDetail } from "@/integrations/shopware/mappers/product-detail";
import { mapShopwareProductCard } from "@/integrations/shopware/mappers/product-listing";

const productDetailAssociations = {
  categories: {},
  cover: { associations: { media: { associations: { thumbnails: {} } } } },
  deliveryTime: {},
  manufacturer: {},
  media: { associations: { media: { associations: { thumbnails: {} } } } },
  properties: { associations: { group: {} } },
  seoUrls: {},
  unit: {},
} satisfies components["schemas"]["Associations"];

const productCardAssociations = {
  cover: { associations: { media: { associations: { thumbnails: {} } } } },
  manufacturer: {},
  seoUrls: {},
} satisfies components["schemas"]["Associations"];

export async function getShopwareProductCardData(
  client: ShopwareClient,
  productId: string,
) {
  const [context, response] = await Promise.all([
    getShopwareContext(client),
    client.invoke("readProductDetail post /product/{productId}", {
      body: { associations: productCardAssociations },
      fetchOptions: { cache: "no-store" },
      headers: { "sw-include-seo-urls": true },
      pathParams: { productId },
      query: { skipCmsPage: true, skipConfigurator: true },
    }),
  ]);
  const product = response.data.product;

  return product
    ? {
        currency: context.currency?.isoCode || "EUR",
        locale: context.languageInfo.localeCode || "de-DE",
        product: mapShopwareProductCard(product, 0),
      }
    : null;
}

async function getShopwareProductCrossSellings(
  client: ShopwareClient,
  productId: string,
) {
  try {
    const response = await client.invoke(
      "readProductCrossSellings post /product/{productId}/cross-selling",
      {
        headers: { "sw-include-seo-urls": true },
        fetchOptions: { cache: "no-store" },
        pathParams: { productId },
      },
    );

    return response.data;
  } catch (error) {
    console.error(
      `Could not load Shopware cross-selling for product ${productId}.`,
      error,
    );

    return [];
  }
}

export async function getShopwareProductDetail(
  client: ShopwareClient,
  productId: string,
): Promise<ShopProductPageData | null> {
  const [context, response, productCrossSellings] = await Promise.all([
    getShopwareContext(client),
    client.invoke("readProductDetail post /product/{productId}", {
      body: { associations: productDetailAssociations },
      fetchOptions: { cache: "no-store" },
      headers: { "sw-include-seo-urls": true },
      pathParams: { productId },
      query: { skipCmsPage: true, skipConfigurator: false },
    }),
    getShopwareProductCrossSellings(client, productId),
  ]);
  const product = response.data.product;

  if (!product) {
    return null;
  }

  const crossSellings =
    productCrossSellings.length === 0 &&
    product.parentId &&
    product.parentId !== productId
      ? await getShopwareProductCrossSellings(client, product.parentId)
      : productCrossSellings;

  return mapShopwareProductDetail({
    configurator: response.data.configurator,
    crossSellings,
    currency: context.currency?.isoCode || "EUR",
    locale: context.languageInfo.localeCode || "de-DE",
    product,
  });
}

export async function findShopwareProductVariant(
  client: ShopwareClient,
  parentProductId: string,
  optionIds: readonly string[],
  switchedGroupId: string,
) {
  const response = await client.invoke(
    "searchProductVariantIds post /product/{productId}/find-variant",
    {
      body: { options: [...optionIds], switchedGroup: switchedGroupId },
      fetchOptions: { cache: "no-store" },
      pathParams: { productId: parentProductId },
    },
  );
  const data =
    response.data as components["schemas"]["FindProductVariantRouteResponse"] & {
      variantId?: string;
    };

  return data.foundCombination?.variantId ?? data.variantId ?? null;
}

export async function isShopwareProductAvailable(
  client: ShopwareClient,
  productId: string,
) {
  const response = await client.invoke(
    "readProductDetail post /product/{productId}",
    {
      fetchOptions: { cache: "no-store" },
      pathParams: { productId },
      query: { skipCmsPage: true, skipConfigurator: true },
    },
  );
  const product = response.data.product;

  return Boolean(product && product.available !== false);
}
