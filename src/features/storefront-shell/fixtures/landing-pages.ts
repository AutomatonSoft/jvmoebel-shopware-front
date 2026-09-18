import { aboutCmsPageMock } from "@/features/about/fixtures/about-page";
import type { CmsLandingPage } from "@/features/cms/model/landing-page";
import { contactCmsPageMock } from "@/features/contact/fixtures/contact-page";
import { inspirationCmsPageMock } from "@/features/inspiration/fixtures/inspiration-page";
import { discountOffersCmsPageMock } from "@/features/offers/fixtures/discount-offers-page";
import { videoShopCmsPageMock } from "@/features/video-shop/fixtures/video-shop-page";

export type MockLandingPageRoute = Readonly<{
  canonicalPath: string;
  page: CmsLandingPage;
}>;

const mockLandingPages: Readonly<Record<string, MockLandingPageRoute>> = {
  "/kontakt": {
    canonicalPath: "/kontakt",
    page: {
      cmsPage: contactCmsPageMock,
      id: "mock-contact-landing-page",
      metaDescription:
        "Kontaktieren Sie JVMoebel für eine persönliche Beratung zu Möbeln und Einrichtung.",
      metaTitle: "Kontakt | JVMoebel",
      name: "Kontakt",
    },
  },
  "/inspiration": {
    canonicalPath: "/inspiration",
    page: {
      cmsPage: inspirationCmsPageMock,
      id: "mock-inspiration-landing-page",
      metaDescription:
        "Entdecken Sie Wohnideen, Einrichtungstrends und abgestimmte Moebel für jeden Raum bei JVMoebel.",
      metaTitle: "Wohnideen & Inspiration | JVMoebel",
      name: "Inspiration",
    },
  },
  "/rabatt-angebote": {
    canonicalPath: "/rabatt-angebote",
    page: {
      cmsPage: discountOffersCmsPageMock,
      id: "mock-discount-offers-landing-page",
      metaDescription:
        "Entdecke reduzierte Moebel und Wohnaccessoires im JVMoebel Sale.",
      metaTitle: "Moebel Sale & Rabattangebote | JVMoebel",
      name: "Angebote",
    },
  },
  "/ueber-uns": {
    canonicalPath: "/ueber-uns",
    page: {
      cmsPage: aboutCmsPageMock,
      id: "mock-about-landing-page",
      metaDescription:
        "Erfahren Sie mehr über JVMoebel, unsere Auswahl, unseren Service und unsere Philosophie.",
      metaTitle: "Über uns | JVMoebel",
      name: "Über uns",
    },
  },
  "/video-shop": {
    canonicalPath: "/video-shop",
    page: {
      cmsPage: videoShopCmsPageMock,
      id: "mock-video-shop-landing-page",
      metaDescription:
        "Entdecken Sie Moebel, Wohnwelten und Einrichtungsideen von JVMoebel im Video.",
      metaTitle: "Video Shop | JVMoebel",
      name: "Video Shop",
    },
  },
};

export function getMockLandingPageRoute(
  pathname: string,
): MockLandingPageRoute | null {
  return mockLandingPages[pathname] ?? null;
}
