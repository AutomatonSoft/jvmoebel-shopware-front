import "server-only";

import { getShopwareCategoryPage } from "@/integrations/shopware/category-page";
import {
  resolveShopwareCategoryRoute,
  type ShopwareCategoryRoute,
} from "@/integrations/shopware/category-route";
import { getShopwareRequestSession } from "@/integrations/shopware/session";

export async function getCategoryPageByPath(pathname: string) {
  const client = getShopwareRequestSession().client;
  const route = await resolveShopwareCategoryRoute(client, pathname);

  if (!route) {
    return null;
  }

  const page = await getShopwareCategoryPage(client, route.categoryId);

  return { page, route } satisfies {
    page: Awaited<ReturnType<typeof getShopwareCategoryPage>>;
    route: ShopwareCategoryRoute;
  };
}
