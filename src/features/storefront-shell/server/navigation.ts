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
import { shouldUseShopwareMocks } from "@/integrations/shopware/mock-mode";
import { getShopwareRequestSession } from "@/integrations/shopware/session";

export async function getMainNavigation(): Promise<MainNavigation> {
  if (shouldUseShopwareMocks()) {
    return mainNavigationMock;
  }

  return getShopwareMainNavigation(getShopwareRequestSession().client);
}

export async function getFooterNavigation(): Promise<StoreNavigationItem[]> {
  if (shouldUseShopwareMocks()) {
    return footerNavigationMock;
  }

  return getShopwareFooterNavigation(getShopwareRequestSession().client);
}

export async function getServiceNavigation(): Promise<StoreNavigationItem[]> {
  if (shouldUseShopwareMocks()) {
    return serviceNavigationMock;
  }

  return getShopwareServiceNavigation(getShopwareRequestSession().client);
}
