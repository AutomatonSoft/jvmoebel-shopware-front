import { afterEach, describe, expect, test } from "bun:test";

import { defaultStorefrontFooterContent } from "@/features/storefront-shell/fixtures/footer";
import {
  mainNavigationMock,
  serviceNavigationMock,
} from "@/features/storefront-shell/fixtures/navigation";
import { defaultStorefrontBranding } from "@/features/storefront-shell/model/branding";
import { getStorefrontShellData } from "@/features/storefront-shell/server/storefront-config";

const originalShopwareUseMocks = process.env.SHOPWARE_USE_MOCKS;

afterEach(() => {
  if (originalShopwareUseMocks === undefined) {
    delete process.env.SHOPWARE_USE_MOCKS;
  } else {
    process.env.SHOPWARE_USE_MOCKS = originalShopwareUseMocks;
  }
});

describe("getStorefrontShellData", () => {
  test("keeps the existing shell fixtures in mock mode", async () => {
    process.env.SHOPWARE_USE_MOCKS = "true";

    await expect(getStorefrontShellData()).resolves.toEqual({
      branding: defaultStorefrontBranding,
      footerContent: defaultStorefrontFooterContent,
      footerNavigation: mainNavigationMock,
      navigation: mainNavigationMock,
      serviceNavigation: serviceNavigationMock,
    });
  });
});
