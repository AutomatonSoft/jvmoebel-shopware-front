import type { CmsPage } from "@/lib/shopware/cms";

const pageId = "mock-home-page";
const sectionId = "mock-home-section";
const blockId = "mock-home-hero-block";

export const homeCmsPageMock = {
  apiAlias: "cms_page",
  id: pageId,
  name: "Mock home page",
  type: "page",
  translated: {
    cssClass: "",
    entity: "",
    name: "Mock home page",
    previewMediaId: "",
    type: "page",
    versionId: "",
  },
  sections: [
    {
      apiAlias: "cms_section",
      id: sectionId,
      pageId,
      position: 0,
      sizingMode: "full_width",
      type: "default",
      blocks: [
        {
          apiAlias: "cms_block",
          id: blockId,
          position: 0,
          sectionId,
          type: "jv-hero",
          slots: [
            {
              apiAlias: "cms_slot",
              blockId,
              id: "mock-home-hero-slot",
              slot: "content",
              type: "jv-hero",
              translated: {
                blockId,
                cmsBlockVersionId: "",
                slot: "content",
                type: "jv-hero",
                versionId: "",
              },
              data: {
                apiAlias: "cms_jv_hero",
                eyebrow: "The new living collection",
                title: "A home that feels like you.",
                description:
                  "Thoughtful furniture, rich textures and lasting comfort — curated for everyday living.",
                image: {
                  alt: "Warm contemporary living room with an ivory sofa",
                  url: "/images/hero-editorial.webp",
                },
                primaryLink: {
                  label: "Shop new arrivals",
                  url: "/new-in",
                },
                secondaryLink: {
                  label: "Explore the collection",
                  url: "/living",
                },
              },
            },
          ],
        },
      ],
    },
  ],
} satisfies CmsPage;
