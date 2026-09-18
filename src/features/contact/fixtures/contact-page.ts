import type { CmsPage } from "@/features/cms/model/page";

export const contactCmsPageMock = {
  id: "mock-contact-page",
  sections: [
    {
      blocks: [
        {
          id: "mock-contact-form-block",
          position: 0,
          slots: [
            {
              config: {
                title: { source: "static", value: "Kontaktieren Sie uns" },
                type: { source: "static", value: "contact" },
              },
              id: "mock-contact-form-slot",
              slot: "content",
              type: "form",
            },
          ],
          type: "form",
        },
      ],
      id: "mock-contact-section",
      position: 0,
      sizingMode: "boxed",
      type: "default",
    },
  ],
  type: "landingpage",
} satisfies CmsPage;
