import { describe, expect, test } from "bun:test";

import { mapShopwareCmsPage } from "@/integrations/shopware/mappers/cms-page";

describe("mapShopwareCmsPage", () => {
  test("maps only the CMS fields required by the renderer", () => {
    const page = {
      config: { backgroundColor: "#fbfaf6" },
      id: "home-page",
      name: "Home",
      sections: [
        {
          blocks: [
            {
              backgroundColor: "#ffffff",
              backgroundMedia: { url: "https://example.com/block.jpg" },
              backgroundMediaMode: "contain",
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
              sectionPosition: "main",
              type: "jv-hero",
              visibility: { desktop: true, mobile: false, tablet: true },
            },
          ],
          backgroundColor: "#f0efe7",
          backgroundMedia: { url: "https://example.com/section.jpg" },
          backgroundMediaMode: "cover",
          id: "main-section",
          mobileBehavior: "hidden",
          position: 0,
          sizingMode: "full_width",
          type: "default",
          visibility: { desktop: true, mobile: true, tablet: false },
        },
      ],
      type: "page",
    } as unknown as Parameters<typeof mapShopwareCmsPage>[0];

    expect(mapShopwareCmsPage(page)).toEqual({
      backgroundColor: "#fbfaf6",
      cssClass: undefined,
      id: "home-page",
      sections: [
        {
          blocks: [
            {
              backgroundColor: "#ffffff",
              backgroundMediaMode: "contain",
              backgroundMediaUrl: "https://example.com/block.jpg",
              cssClass: undefined,
              id: "hero-block",
              marginBottom: undefined,
              marginLeft: undefined,
              marginRight: undefined,
              marginTop: undefined,
              position: 0,
              sectionPosition: "main",
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
              visibility: { desktop: true, mobile: false, tablet: true },
            },
          ],
          backgroundColor: "#f0efe7",
          backgroundMediaMode: "cover",
          backgroundMediaUrl: "https://example.com/section.jpg",
          cssClass: undefined,
          id: "main-section",
          mobileBehavior: "hidden",
          position: 0,
          sizingMode: "full_width",
          type: "default",
          visibility: { desktop: true, mobile: true, tablet: false },
        },
      ],
      type: "page",
    });
  });
});
