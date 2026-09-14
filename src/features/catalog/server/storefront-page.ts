import "server-only";

import { getShopwareCategoryPage } from "@/integrations/shopware/category-page";
import { getShopwareProductDetail } from "@/integrations/shopware/product-detail";
import { getShopwareRequestSession } from "@/integrations/shopware/session";
import {
  resolveShopwareStorefrontRoute,
  type ShopwareStorefrontRoute,
} from "@/integrations/shopware/storefront-route";

export async function getStorefrontPageByPath(pathname: string) {
  const client = getShopwareRequestSession().client;
  const route = await resolveShopwareStorefrontRoute(client, pathname);

  if (!route) {
    return null;
  }

  if (route.kind === "product") {
    const page = await getShopwareProductDetail(client, route.entityId);

    return page
      ? ({ kind: "product", page, route } satisfies {
          kind: "product";
          page: NonNullable<
            Awaited<ReturnType<typeof getShopwareProductDetail>>
          >;
          route: ShopwareStorefrontRoute;
        })
      : null;
  }

  return {
    kind: "category",
    page: await getShopwareCategoryPage(client, route.entityId),
    route,
  } satisfies {
    kind: "category";
    page: Awaited<ReturnType<typeof getShopwareCategoryPage>>;
    route: ShopwareStorefrontRoute;
  };
}
