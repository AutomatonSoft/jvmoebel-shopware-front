import "server-only";

import {
  footerNavigationMock,
  mainNavigationMock,
  serviceNavigationMock,
} from "@/features/storefront-shell/fixtures/navigation";
import type {
  MainNavigation,
  StoreNavigationItem,
} from "@/features/storefront-shell/model/navigation";
import {
  getShopwareFooterNavigation,
  getShopwareMainNavigation,
  getShopwareServiceNavigation,
} from "@/integrations/shopware/navigation";
import type { ShopwareClient } from "@/lib/shopware/client";
import { shouldUseShopwareMocks } from "@/lib/shopware/mocks/config";

export async function getMainNavigation(
  client: ShopwareClient,
): Promise<MainNavigation> {
  if (shouldUseShopwareMocks()) {
    return mainNavigationMock;
  }

  return getShopwareMainNavigation(client);
}

export async function getFooterNavigation(
  client: ShopwareClient,
): Promise<StoreNavigationItem[]> {
  if (shouldUseShopwareMocks()) {
    return footerNavigationMock;
  }

  return getShopwareFooterNavigation(client);
}

export async function getServiceNavigation(
  client: ShopwareClient,
): Promise<StoreNavigationItem[]> {
  if (shouldUseShopwareMocks()) {
    return serviceNavigationMock;
  }

  return getShopwareServiceNavigation(client);
}
