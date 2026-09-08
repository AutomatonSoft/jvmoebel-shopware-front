import { describe, expect, test } from "bun:test";

import {
  buildYoutubeEmbedUrl,
  parseCmsYoutubeVideoData,
} from "@/features/cms/contracts/youtube-video";

describe("parseCmsYoutubeVideoData", () => {
  test("parses the standard Shopware YouTube configuration", () => {
    const result = parseCmsYoutubeVideoData({
      config: {
        advancedPrivacyMode: { source: "static", value: true },
        autoPlay: { source: "static", value: true },
        displayMode: { source: "static", value: "cover" },
        end: { source: "static", value: 90 },
        iframeTitle: { source: "static", value: "Wohnzimmer Inspiration" },
        loop: { source: "static", value: true },
        needsConfirmation: { source: "static", value: true },
        showControls: { source: "static", value: false },
        start: { source: "static", value: 15 },
        videoID: { source: "static", value: "1MQxaMMG4a8" },
      },
    });

    expect(result.issues).toEqual([]);
    expect(result.data).toEqual({
      advancedPrivacyMode: true,
      autoPlay: true,
      displayMode: "cover",
      end: 90,
      iframeTitle: "Wohnzimmer Inspiration",
      loop: true,
      needsConfirmation: true,
      showControls: false,
      start: 15,
      videoId: "1MQxaMMG4a8",
    });

    const url = new URL(buildYoutubeEmbedUrl(result.data!));

    expect(url.hostname).toBe("www.youtube-nocookie.com");
    expect(url.pathname).toBe("/embed/1MQxaMMG4a8");
    expect(url.searchParams.get("autoplay")).toBe("1");
    expect(url.searchParams.get("playlist")).toBe("1MQxaMMG4a8");
    expect(url.searchParams.get("controls")).toBe("0");
    expect(url.searchParams.get("start")).toBe("15");
    expect(url.searchParams.get("end")).toBe("90");
  });

  test("uses safe defaults for optional settings", () => {
    const result = parseCmsYoutubeVideoData({
      config: {
        videoID: { source: "static", value: "BrAtCRDwYhI" },
      },
      data: { title: "Moderne Luxusmöbel" },
    });

    expect(result.data).toEqual({
      advancedPrivacyMode: true,
      autoPlay: false,
      displayMode: "standard",
      end: undefined,
      iframeTitle: "Moderne Luxusmöbel",
      loop: false,
      needsConfirmation: false,
      showControls: true,
      start: undefined,
      videoId: "BrAtCRDwYhI",
    });
  });

  test("rejects malformed video IDs", () => {
    const result = parseCmsYoutubeVideoData({
      config: {
        videoID: {
          source: "static",
          value: "https://www.youtube.com/watch?v=BrAtCRDwYhI",
        },
      },
    });

    expect(result.data).toBeNull();
    expect(result.issues).toEqual([
      {
        message: "YouTube video ID must contain exactly 11 valid characters.",
        path: "config.videoID.value",
      },
    ]);
  });
});
