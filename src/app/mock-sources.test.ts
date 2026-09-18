import { afterEach, describe, expect, test } from "bun:test";

import { aboutCmsPageMock } from "@/features/about/fixtures/about-page";
import { shopProductListingMock } from "@/features/catalog/fixtures/product-listing";
import { getShopProductListing } from "@/features/catalog/server/product-listing";
import { homeCmsPageMock } from "@/features/cms/fixtures/home-page";
import { getHomeCmsPage } from "@/features/cms/server/home-page";
import { inspirationCmsPageMock } from "@/features/inspiration/fixtures/inspiration-page";
import { discountOffersCmsPageMock } from "@/features/offers/fixtures/discount-offers-page";
import {
  mainNavigationMock,
  serviceNavigationMock,
} from "@/features/storefront-shell/fixtures/navigation";
import { defaultStorefrontBranding } from "@/features/storefront-shell/model/branding";
import { defaultStorefrontFooterContent } from "@/features/storefront-shell/fixtures/footer";
import { getStorefrontShellData } from "@/features/storefront-shell/server/storefront-config";
import { getStorefrontPageByPath } from "@/features/storefront-shell/server/storefront-page";
import { videoShopCmsPageMock } from "@/features/video-shop/fixtures/video-shop-page";

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
      aboutPage,
      inspirationPage,
      offersPage,
      videoShopPage,
      storefront,
    ] = await Promise.all([
      getShopProductListing(),
      getHomeCmsPage(),
      getStorefrontPageByPath("/ueber-uns"),
      getStorefrontPageByPath("/inspiration"),
      getStorefrontPageByPath("/rabatt-angebote"),
      getStorefrontPageByPath("/video-shop"),
      getStorefrontShellData(),
    ]);

    expect(listing).toBe(shopProductListingMock);
    expect(page).toBe(homeCmsPageMock);

    if (
      aboutPage?.kind !== "landing-page" ||
      inspirationPage?.kind !== "landing-page" ||
      offersPage?.kind !== "landing-page" ||
      videoShopPage?.kind !== "landing-page"
    ) {
      throw new Error(
        "Expected all mock CMS routes to resolve as landing pages.",
      );
    }

    expect(aboutPage.page.cmsPage).toBe(aboutCmsPageMock);
    expect(inspirationPage.page.cmsPage).toBe(inspirationCmsPageMock);
    expect(offersPage.page.cmsPage).toBe(discountOffersCmsPageMock);
    expect(videoShopPage.page.cmsPage).toBe(videoShopCmsPageMock);
    expect(aboutPage.route.canonicalPath).toBe("/ueber-uns");
    expect(inspirationPage.route.canonicalPath).toBe("/inspiration");
    expect(offersPage.route.canonicalPath).toBe("/rabatt-angebote");
    expect(videoShopPage.route.canonicalPath).toBe("/video-shop");
    expect(storefront).toEqual({
      branding: defaultStorefrontBranding,
      footerContent: defaultStorefrontFooterContent,
      footerNavigation: mainNavigationMock,
      navigation: mainNavigationMock,
      serviceNavigation: serviceNavigationMock,
    });
  });
});
