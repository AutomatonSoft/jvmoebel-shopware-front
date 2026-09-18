import { aboutCmsPageMock } from "@/features/about/fixtures/about-page";
import type { CmsLandingPage } from "@/features/cms/model/landing-page";
import { inspirationCmsPageMock } from "@/features/inspiration/fixtures/inspiration-page";
import { discountOffersCmsPageMock } from "@/features/offers/fixtures/discount-offers-page";
import { videoShopCmsPageMock } from "@/features/video-shop/fixtures/video-shop-page";

export type MockLandingPageRoute = Readonly<{
  canonicalPath: string;
  page: CmsLandingPage;
}>;

const mockLandingPages: Readonly<Record<string, MockLandingPageRoute>> = {
  "/inspiration": {
    canonicalPath: "/inspiration",
    page: {
      cmsPage: inspirationCmsPageMock,
      id: "mock-inspiration-landing-page",
      metaDescription:
        "Entdecken Sie Wohnideen, Einrichtungstrends und abgestimmte Möbel für jeden Raum bei JVMöbel.",
      metaTitle: "Wohnideen & Inspiration | JVMöbel",
      name: "Inspiration",
    },
  },
  "/rabatt-angebote": {
    canonicalPath: "/rabatt-angebote",
    page: {
      cmsPage: discountOffersCmsPageMock,
      id: "mock-discount-offers-landing-page",
      metaDescription:
        "Entdecke reduzierte Möbel und Wohnaccessoires im JVMöbel Sale.",
      metaTitle: "Möbel Sale & Rabattangebote | JVMöbel",
      name: "Angebote",
    },
  },
  "/ueber-uns": {
    canonicalPath: "/ueber-uns",
    page: {
      cmsPage: aboutCmsPageMock,
      id: "mock-about-landing-page",
      metaDescription:
        "Erfahren Sie mehr über JVMöbel, unsere Auswahl, unseren Service und unsere Philosophie.",
      metaTitle: "Über uns | JVMöbel",
      name: "Über uns",
    },
  },
  "/video-shop": {
    canonicalPath: "/video-shop",
    page: {
      cmsPage: videoShopCmsPageMock,
      id: "mock-video-shop-landing-page",
      metaDescription:
        "Entdecken Sie Möbel, Wohnwelten und Einrichtungsideen von JVMöbel im Video.",
      metaTitle: "Video Shop | JVMöbel",
      name: "Video Shop",
    },
  },
};

export function getMockLandingPageRoute(
  pathname: string,
): MockLandingPageRoute | null {
  return mockLandingPages[pathname] ?? null;
}
