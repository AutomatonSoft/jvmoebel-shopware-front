import { describe, expect, test } from "bun:test";

import { parseCmsHeroData } from "@/lib/cms/contracts/hero";

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
    });
  });

  test("rejects a hero without its required title or image URL", () => {
    expect(parseCmsHeroData({ image: { url: "/hero.webp" } })).toBeNull();
    expect(parseCmsHeroData({ title: "Hero", image: {} })).toBeNull();
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

    expect(data?.primaryLink).toBeUndefined();
    expect(data?.secondaryLink).toEqual({
      label: "Learn more",
      size: "medium",
      url: "/learn-more",
    });
  });
});
