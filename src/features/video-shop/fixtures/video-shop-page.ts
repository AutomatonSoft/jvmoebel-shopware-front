import type { CmsBlock, CmsPage } from "@/features/cms/model/page";

const sourceVideos = [
  { id: "BrAtCRDwYhI", title: "Moderne Luxusmöbel" },
  { id: "1MQxaMMG4a8", title: "Wohnzimmer Inspiration" },
  { id: "1uanE8qHM4w", title: "Ecksofa Design" },
  { id: "DcoWk3OUlWM", title: "Esszimmer Einrichtung" },
  { id: "taL61SdrlPU", title: "TV-Wand Möbel" },
  { id: "zPf78C9PYok", title: "Chesterfield Sofa Set" },
  { id: "5Cd73Tbh3LQ", title: "Moderne Wohnwand Kombination" },
  { id: "AsU5irbNfq8", title: "Luxus Esszimmermöbel" },
  { id: "_VtLqI5LIj4", title: "Bequeme Sessel und Sofas" },
  { id: "Oord4V4plM0", title: "Goldene Wohnzimmer Inspiration" },
] as const;

function createYoutubeVideoBlock(
  video: (typeof sourceVideos)[number],
  position: number,
): CmsBlock {
  return {
    id: `mock-video-shop-youtube-${position}-block`,
    position,
    slots: [
      {
        config: {
          advancedPrivacyMode: { source: "static", value: true },
          autoPlay: { source: "static", value: false },
          displayMode: { source: "static", value: "standard" },
          iframeTitle: { source: "static", value: video.title },
          loop: { source: "static", value: false },
          needsConfirmation: { source: "static", value: false },
          showControls: { source: "static", value: true },
          videoID: { source: "static", value: video.id },
        },
        id: `mock-video-shop-youtube-${position}-slot`,
        slot: "video",
        type: "youtube-video",
      },
    ],
    type: "youtube-video",
  };
}

export const videoShopCmsPageMock: CmsPage = {
  id: "mock-video-shop-page",
  sections: [
    {
      blocks: [
        {
          id: "mock-video-shop-header-block",
          position: 0,
          slots: [
            {
              data: {
                description:
                  "Entdecken Sie ausgewählte Möbel, Wohnwelten und Designideen direkt im Video.",
                eyebrow: "Video Shop",
                title: "Unsere Möbel in Aktion.",
              },
              id: "mock-video-shop-header-slot",
              slot: "content",
              type: "jv-page-header",
            },
          ],
          type: "jv-page-header",
        },
      ],
      id: "mock-video-shop-header-section",
      position: 0,
      sizingMode: "full_width",
      type: "default",
    },
    {
      blocks: sourceVideos.map(createYoutubeVideoBlock),
      cssClass: "grid grid-cols-1 gap-5 pb-16 sm:gap-7 lg:grid-cols-2 sm:pb-24",
      id: "mock-video-shop-grid-section",
      position: 1,
      sizingMode: "boxed",
      type: "default",
    },
  ],
  type: "page",
};
