import { describe, expect, test } from "bun:test";

import { mapShopwareCmsPage } from "@/integrations/shopware/mappers/cms-page";

describe("mapShopwareCmsPage", () => {
  test("maps only the CMS fields required by the renderer", () => {
    const page = {
      id: "home-page",
      name: "Home",
      sections: [
        {
          blocks: [
            {
              id: "hero-block",
              position: 0,
              slots: [
                {
                  data: { title: "Welcome" },
                  id: "hero-slot",
                  slot: "content",
                  type: "jv-hero",
                },
              ],
              type: "jv-hero",
            },
          ],
          id: "main-section",
          position: 0,
          sizingMode: "full_width",
          type: "default",
        },
      ],
      type: "page",
    } as unknown as Parameters<typeof mapShopwareCmsPage>[0];

    expect(mapShopwareCmsPage(page)).toEqual({
      cssClass: undefined,
      id: "home-page",
      sections: [
        {
          blocks: [
            {
              cssClass: undefined,
              id: "hero-block",
              marginBottom: undefined,
              marginLeft: undefined,
              marginRight: undefined,
              marginTop: undefined,
              position: 0,
              slots: [
                {
                  config: undefined,
                  data: { title: "Welcome" },
                  id: "hero-slot",
                  slot: "content",
                  type: "jv-hero",
                },
              ],
              type: "jv-hero",
            },
          ],
          cssClass: undefined,
          id: "main-section",
          position: 0,
          sizingMode: "full_width",
          type: "default",
        },
      ],
      type: "page",
    });
  });
});
