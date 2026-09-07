import { afterEach, describe, expect, test } from "bun:test";

import { shopProductListingMock } from "@/features/catalog/fixtures/product-listing";
import { getShopProductListing } from "@/features/catalog/server/product-listing";
import { homeCmsPageMock } from "@/features/cms/fixtures/home-page";
import { getHomeCmsPage } from "@/features/cms/server/home-page";
import { discountOffersCmsPageMock } from "@/features/offers/fixtures/discount-offers-page";
import { getDiscountOffersCmsPage } from "@/features/offers/server/discount-offers-page";
import {
  footerNavigationMock,
  mainNavigationMock,
  serviceNavigationMock,
} from "@/features/storefront-shell/fixtures/navigation";
import { defaultStorefrontBranding } from "@/features/storefront-shell/model/branding";
import { defaultStorefrontFooterContent } from "@/features/storefront-shell/fixtures/footer";
import { getStorefrontBranding } from "@/features/storefront-shell/server/branding";
import { getStorefrontFooterContent } from "@/features/storefront-shell/server/footer";
import {
  getFooterNavigation,
  getMainNavigation,
  getServiceNavigation,
} from "@/features/storefront-shell/server/navigation";

const originalShopwareEndpoint = process.env.SHOPWARE_ENDPOINT;
const originalShopwareAccessToken = process.env.SHOPWARE_ACCESS_TOKEN;
const originalShopwareUseMocks = process.env.SHOPWARE_USE_MOCKS;

function setEnvironmentVariable(name: string, value: string | undefined) {
  if (value === undefined) {
    delete process.env[name];
  } else {
    process.env[name] = value;
  }
}

afterEach(() => {
  setEnvironmentVariable("SHOPWARE_ENDPOINT", originalShopwareEndpoint);
  setEnvironmentVariable("SHOPWARE_ACCESS_TOKEN", originalShopwareAccessToken);
  setEnvironmentVariable("SHOPWARE_USE_MOCKS", originalShopwareUseMocks);
});

describe("Shopware mock sources", () => {
  test("return storefront fixtures without Shopware credentials", async () => {
    process.env.SHOPWARE_USE_MOCKS = "true";
    delete process.env.SHOPWARE_ENDPOINT;
    delete process.env.SHOPWARE_ACCESS_TOKEN;

    const [
      listing,
      page,
      offersPage,
      branding,
      footerContent,
      main,
      footer,
      service,
    ] = await Promise.all([
      getShopProductListing(),
      getHomeCmsPage(),
      getDiscountOffersCmsPage(),
      getStorefrontBranding(),
      getStorefrontFooterContent(),
      getMainNavigation(),
      getFooterNavigation(),
      getServiceNavigation(),
    ]);

    expect(listing).toBe(shopProductListingMock);
    expect(page).toBe(homeCmsPageMock);
    expect(offersPage).toBe(discountOffersCmsPageMock);
    expect(branding).toBe(defaultStorefrontBranding);
    expect(footerContent).toBe(defaultStorefrontFooterContent);
    expect(main).toBe(mainNavigationMock);
    expect(footer).toBe(footerNavigationMock);
    expect(service).toBe(serviceNavigationMock);
  });
});
