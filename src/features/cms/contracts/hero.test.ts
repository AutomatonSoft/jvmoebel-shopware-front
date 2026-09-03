import { describe, expect, test } from "bun:test";

import { parseCmsHeroData } from "@/features/cms/contracts/hero";

describe("parseCmsHeroData", () => {
  test("parses a valid hero contract", () => {
    expect(
      parseCmsHeroData({
        description: "Furniture for everyday living.",
        eyebrow: "New collection",
        image: {
          alt: "Contemporary living room",
          url: "/images/hero.webp",
        },
        primaryLink: {
          label: "Shop now",
          size: "large",
          url: "/shop",
        },
        title: "A home that feels like you.",
      }),
    ).toEqual({
      data: {
        description: "Furniture for everyday living.",
        eyebrow: "New collection",
        image: {
          alt: "Contemporary living room",
          url: "/images/hero.webp",
        },
        primaryLink: {
          label: "Shop now",
          size: "large",
          url: "/shop",
        },
        secondaryLink: undefined,
        title: "A home that feels like you.",
      },
      issues: [],
    });
  });

  test("rejects a hero without its required title or image URL", () => {
    expect(parseCmsHeroData({ image: { url: "/hero.webp" } }).data).toBeNull();
    expect(parseCmsHeroData({ title: "Hero", image: {} }).data).toBeNull();
  });

  test("omits incomplete links and normalizes an unknown button size", () => {
    const data = parseCmsHeroData({
      image: { url: "/hero.webp" },
      primaryLink: { label: "Missing URL" },
      secondaryLink: {
        label: "Learn more",
        size: "unexpected",
        url: "/learn-more",
      },
      title: "Hero",
    });

    expect(data.data?.primaryLink).toBeUndefined();
    expect(data.data?.secondaryLink).toEqual({
      label: "Learn more",
      size: "medium",
      url: "/learn-more",
    });
    expect(data.issues).toEqual([
      {
        message: "Link URL is missing or empty.",
        path: "primaryLink.url",
      },
    ]);
  });
});
