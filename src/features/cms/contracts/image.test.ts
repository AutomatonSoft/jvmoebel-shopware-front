import { describe, expect, test } from "bun:test";

import { parseCmsImageData } from "@/features/cms/contracts/image";

describe("parseCmsImageData", () => {
  test("maps resolved Shopware media and image configuration", () => {
    const result = parseCmsImageData({
      data: {
        media: {
          metaData: { height: 800, width: 1200 },
          translated: { alt: "Showroom", title: "JVMöbel showroom" },
          url: "https://shop.example.com/media/showroom.webp",
        },
      },
      config: {
        ariaLabel: { source: "static", value: "Open showroom" },
        displayMode: { source: "static", value: "cover" },
        fetchPriorityHigh: { source: "static", value: true },
        horizontalAlign: { source: "static", value: "flex-end" },
        minHeight: { source: "static", value: "480px" },
        newTab: { source: "static", value: true },
        url: { source: "static", value: "/showroom" },
        verticalAlign: { source: "static", value: "flex-start" },
      },
    });

    expect(result).toEqual({
      data: {
        ariaLabel: "Open showroom",
        displayMode: "cover",
        fetchPriorityHigh: true,
        horizontalAlign: "flex-end",
        image: {
          alt: "Showroom",
          height: 800,
          title: "JVMöbel showroom",
          url: "https://shop.example.com/media/showroom.webp",
          width: 1200,
        },
        isDecorative: false,
        link: { newTab: true, url: "/showroom" },
        minHeight: "480px",
        verticalAlign: "flex-start",
      },
      issues: [],
    });
  });

  test("uses Shopware defaults and clears decorative text", () => {
    const result = parseCmsImageData({
      data: {
        media: {
          alt: "Ignored alt",
          title: "Ignored title",
          url: "/images/showroom.webp",
        },
      },
      config: {
        isDecorative: { source: "static", value: true },
      },
    });

    expect(result.data).toMatchObject({
      displayMode: "standard",
      fetchPriorityHigh: false,
      horizontalAlign: "center",
      image: { alt: "", url: "/images/showroom.webp" },
      isDecorative: true,
      verticalAlign: "center",
    });
    expect(result.data?.image.title).toBeUndefined();
    expect(result.issues).toEqual([]);
  });

  test("rejects missing resolved media", () => {
    expect(
      parseCmsImageData({
        config: {
          media: { source: "static", value: "media-id" },
        },
      }),
    ).toEqual({
      data: null,
      issues: [
        {
          message: "Resolved image URL is missing or unsupported.",
          path: "data.media.url",
        },
      ],
    });
  });

  test("omits unsafe image links", () => {
    const result = parseCmsImageData({
      data: { media: { url: "/images/showroom.webp" } },
      config: {
        url: { source: "static", value: "javascript:alert(1)" },
      },
    });

    expect(result.data?.link).toBeUndefined();
    expect(result.issues).toEqual([
      {
        message: "Image link URL uses an unsupported protocol.",
        path: "config.url.value",
      },
    ]);
  });
});
