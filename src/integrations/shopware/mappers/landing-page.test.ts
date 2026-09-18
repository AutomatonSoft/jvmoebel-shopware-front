import { describe, expect, test } from "bun:test";
import type { components } from "@shopware/api-client/store-api-types";

import { mapShopwareLandingPage } from "@/integrations/shopware/mappers/landing-page";

type ShopwareLandingPage = components["schemas"]["LandingPage"];

function createLandingPage(
  overrides: Partial<ShopwareLandingPage> = {},
): ShopwareLandingPage {
  return {
    active: true,
    apiAlias: "landing_page",
    cmsPage: {
      apiAlias: "cms_page",
      id: "cms-page-id",
      sections: [],
      translated: {
        cssClass: "",
        entity: "",
        name: "Über uns",
        previewMediaId: "",
        type: "landingpage",
        versionId: "",
      },
      type: "landingpage",
    },
    id: "landing-page-id",
    name: "About",
    translated: {
      cmsPageId: "cms-page-id",
      cmsPageVersionId: "",
      keywords: "",
      metaDescription: "Über JVMöbel",
      metaTitle: "Über uns",
      name: "Über uns",
      url: "/ueber-uns",
      versionId: "",
    },
    url: "/ueber-uns",
    ...overrides,
  };
}

describe("mapShopwareLandingPage", () => {
  test("maps an active landing page and its CMS layout", () => {
    expect(mapShopwareLandingPage(createLandingPage())).toEqual({
      cmsPage: {
        backgroundColor: undefined,
        cssClass: undefined,
        id: "cms-page-id",
        sections: [],
        type: "landingpage",
      },
      id: "landing-page-id",
      metaDescription: "Über JVMöbel",
      metaTitle: "Über uns",
      name: "Über uns",
    });
  });

  test("rejects inactive landing pages and pages without a CMS layout", () => {
    expect(mapShopwareLandingPage(createLandingPage({ active: false }))).toBe(
      null,
    );
    expect(
      mapShopwareLandingPage(createLandingPage({ cmsPage: undefined })),
    ).toBe(null);
  });
});
