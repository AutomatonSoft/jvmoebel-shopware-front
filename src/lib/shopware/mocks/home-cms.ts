import type { CmsPage } from "@/lib/shopware/cms";

const pageId = "mock-home-page";
const sectionId = "mock-home-section";
const heroBlockId = "mock-home-hero-block";
const roomGridBlockId = "mock-home-room-grid-block";

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
          id: heroBlockId,
          position: 0,
          sectionId,
          type: "jv-hero",
          slots: [
            {
              apiAlias: "cms_slot",
              blockId: heroBlockId,
              id: "mock-home-hero-slot",
              slot: "content",
              type: "jv-hero",
              translated: {
                blockId: heroBlockId,
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
        {
          apiAlias: "cms_block",
          id: roomGridBlockId,
          position: 1,
          sectionId,
          type: "jv-room-grid",
          slots: [
            {
              apiAlias: "cms_slot",
              blockId: roomGridBlockId,
              id: "mock-home-room-grid-slot",
              slot: "content",
              type: "jv-room-grid",
              translated: {
                blockId: roomGridBlockId,
                cmsBlockVersionId: "",
                slot: "content",
                type: "jv-room-grid",
                versionId: "",
              },
              data: {
                apiAlias: "cms_jv_room_grid",
                eyebrow: "Shop by room",
                title: "Furniture for every room.",
                description:
                  "Start with the space you are furnishing, then discover pieces selected to work naturally together.",
                rooms: {
                  livingRoom: {
                    featured: 1,
                    id: "living-room",
                    image: {
                      alt: "Contemporary living room",
                      url: "/images/hero-living.webp",
                    },
                    label: "Living room",
                    position: 0,
                    title: "Sofas, armchairs & tables",
                    url: "/living",
                  },
                  diningRoom: {
                    featured: 0,
                    id: "dining-room",
                    image: {
                      alt: "Warm walnut dining room",
                      url: "/images/dining-room.webp",
                    },
                    label: "Dining",
                    position: 1,
                    title: "Tables, chairs & storage",
                    url: "/dining",
                  },
                  bedroom: {
                    featured: 0,
                    id: "bedroom",
                    image: {
                      alt: "Quiet neutral bedroom",
                      url: "/images/bedroom.webp",
                    },
                    label: "Bedroom",
                    position: 2,
                    title: "Beds, bedside & wardrobes",
                    url: "/bedroom",
                  },
                },
              },
            },
          ],
        },
      ],
    },
  ],
} satisfies CmsPage;
