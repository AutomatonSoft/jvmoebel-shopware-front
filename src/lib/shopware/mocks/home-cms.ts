import type { CmsPage } from "@/lib/shopware/cms";

const pageId = "mock-home-page";
const sectionId = "mock-home-section";
const blockId = "mock-home-text-block";

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
      sizingMode: "boxed",
      type: "default",
      blocks: [
        {
          apiAlias: "cms_block",
          id: blockId,
          marginBottom: "4rem",
          marginTop: "4rem",
          position: 0,
          sectionId,
          type: "text",
          slots: [
            {
              apiAlias: "cms_slot",
              blockId,
              id: "mock-home-text-slot",
              slot: "content",
              type: "text",
              translated: {
                blockId,
                cmsBlockVersionId: "",
                slot: "content",
                type: "text",
                versionId: "",
              },
              data: {
                apiAlias: "cms_text",
                content:
                  '<p>The new living collection</p><h1>A home that feels like you.</h1><p>Thoughtful furniture, rich textures and lasting comfort — curated for everyday living.</p><p><a href="/new-in">Shop new arrivals</a></p>',
              },
            },
          ],
        },
      ],
    },
  ],
} satisfies CmsPage;
