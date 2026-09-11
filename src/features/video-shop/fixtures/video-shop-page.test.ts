import { describe, expect, test } from "bun:test";

import { parseCmsPageHeaderData } from "@/features/cms/contracts/page-header";
import { parseCmsYoutubeVideoData } from "@/features/cms/contracts/youtube-video";
import { videoShopCmsPageMock } from "@/features/video-shop/fixtures/video-shop-page";

describe("videoShopCmsPageMock", () => {
  test("contains the source videos with valid CMS contracts", () => {
    const slots = videoShopCmsPageMock.sections.flatMap((section) =>
      section.blocks.flatMap((block) => block.slots),
    );
    const header = slots.find((slot) => slot.type === "jv-page-header");
    const videos = slots.filter((slot) => slot.type === "youtube-video");

    expect(header).toBeDefined();
    expect(parseCmsPageHeaderData(header?.data).issues).toEqual([]);
    expect(videos).toHaveLength(10);

    const videoIds = videos.map((slot) => {
      const result = parseCmsYoutubeVideoData(slot);

      expect(result.issues).toEqual([]);
      expect(result.data).not.toBeNull();

      return result.data?.videoId;
    });

    expect(new Set(videoIds).size).toBe(10);
  });
});
