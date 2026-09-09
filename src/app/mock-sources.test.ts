import { afterEach, describe, expect, test } from "bun:test";

import { aboutCmsPageMock } from "@/features/about/fixtures/about-page";
import { getAboutCmsPage } from "@/features/about/server/about-page";
import { shopProductListingMock } from "@/features/catalog/fixtures/product-listing";
import { getShopProductListing } from "@/features/catalog/server/product-listing";
import { homeCmsPageMock } from "@/features/cms/fixtures/home-page";
import { getHomeCmsPage } from "@/features/cms/server/home-page";
import { discountOffersCmsPageMock } from "@/features/offers/fixtures/discount-offers-page";
import { getDiscountOffersCmsPage } from "@/features/offers/server/discount-offers-page";
import {
  mainNavigationMock,
  serviceNavigationMock,
} from "@/features/storefront-shell/fixtures/navigation";
import { defaultStorefrontBranding } from "@/features/storefront-shell/model/branding";
import { defaultStorefrontFooterContent } from "@/features/storefront-shell/fixtures/footer";
import { getStorefrontShellData } from "@/features/storefront-shell/server/storefront-config";
import { videoShopCmsPageMock } from "@/features/video-shop/fixtures/video-shop-page";
import { getVideoShopCmsPage } from "@/features/video-shop/server/video-shop-page";

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

    const [listing, page, aboutPage, offersPage, videoShopPage, storefront] =
      await Promise.all([
        getShopProductListing(),
        getHomeCmsPage(),
        getAboutCmsPage(),
        getDiscountOffersCmsPage(),
        getVideoShopCmsPage(),
        getStorefrontShellData(),
      ]);

    expect(listing).toBe(shopProductListingMock);
    expect(page).toBe(homeCmsPageMock);
    expect(aboutPage).toBe(aboutCmsPageMock);
    expect(offersPage).toBe(discountOffersCmsPageMock);
    expect(videoShopPage).toBe(videoShopCmsPageMock);
    expect(storefront).toEqual({
      branding: defaultStorefrontBranding,
      footerContent: defaultStorefrontFooterContent,
      footerNavigation: mainNavigationMock,
      navigation: mainNavigationMock,
      serviceNavigation: serviceNavigationMock,
    });
  });
});
