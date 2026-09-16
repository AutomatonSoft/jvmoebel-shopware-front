import type { components } from "@shopware/api-client/store-api-types";

import type { CmsLandingPage } from "@/features/cms/model/landing-page";
import { mapShopwareCmsPage } from "@/integrations/shopware/mappers/cms-page";

type ShopwareLandingPage = components["schemas"]["LandingPage"];

function getOptionalText(...values: Array<string | null | undefined>) {
  return values.find((value) => value?.trim())?.trim();
}

export function mapShopwareLandingPage(
  landingPage: ShopwareLandingPage,
): CmsLandingPage | null {
  if (landingPage.active === false || !landingPage.cmsPage) {
    return null;
  }

  return {
    cmsPage: mapShopwareCmsPage(landingPage.cmsPage),
    id: landingPage.id,
    metaDescription: getOptionalText(
      landingPage.translated.metaDescription,
      landingPage.metaDescription,
    ),
    metaTitle: getOptionalText(
      landingPage.translated.metaTitle,
      landingPage.metaTitle,
    ),
    name:
      getOptionalText(landingPage.translated.name, landingPage.name) ||
      "Landing Page",
  };
}
