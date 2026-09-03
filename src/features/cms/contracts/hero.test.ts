import { describe, expect, test } from "bun:test";

import { parseCmsHeroData } from "@/features/cms/contracts/hero";

describe("parseCmsHeroData", () => {
  test("keeps the legacy single-slide payload compatible", () => {
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
        ariaLabel: undefined,
        autoplay: true,
        autoplayIntervalMs: 7000,
        slides: [
          {
            description: "Furniture for everyday living.",
            eyebrow: "New collection",
            id: "hero-slide-1",
            image: {
              alt: "Contemporary living room",
              url: "/images/hero.webp",
            },
            layout: "featured",
            position: 0,
            primaryLink: {
              label: "Shop now",
              size: "large",
              url: "/shop",
            },
            promotion: undefined,
            secondaryLink: undefined,
            title: "A home that feels like you.",
          },
        ],
      },
      issues: [],
    });
  });

  test("parses, sorts and configures multiple slides", () => {
    const result = parseCmsHeroData({
      ariaLabel: "Seasonal highlights",
      autoplay: 0,
      autoplayIntervalMs: 2000,
      slides: {
        product: {
          image: { url: "/images/product.webp" },
          position: 1,
          title: "Featured product",
        },
        sale: {
          id: "sale-slide",
          image: { alt: "Dining room", url: "/images/sale.webp" },
          layout: "caption",
          position: 0,
          promotion: { label: "This week", value: "-20%" },
          title: "Dining sale",
        },
      },
    });

    expect(result.issues).toEqual([]);
    expect(result.data?.ariaLabel).toBe("Seasonal highlights");
    expect(result.data?.autoplay).toBe(false);
    expect(result.data?.autoplayIntervalMs).toBe(4000);
    expect(result.data?.slides.map((slide) => slide.id)).toEqual([
      "sale-slide",
      "hero-slide-1",
    ]);
    expect(result.data?.slides[0]?.promotion).toEqual({
      label: "This week",
      value: "-20%",
    });
    expect(result.data?.slides.map((slide) => slide.layout)).toEqual([
      "caption",
      "featured",
    ]);
  });

  test("omits incomplete optional values without rejecting a valid slide", () => {
    const result = parseCmsHeroData({
      autoplayIntervalMs: 20000,
      slides: [
        {
          image: { url: "/hero.webp" },
          primaryLink: { label: "Missing URL" },
          promotion: { label: "Missing value" },
          secondaryLink: {
            label: "Learn more",
            size: "unexpected",
            url: "/learn-more",
          },
          title: "Hero",
        },
      ],
    });

    expect(result.data?.autoplayIntervalMs).toBe(15000);
    expect(result.data?.slides[0]?.primaryLink).toBeUndefined();
    expect(result.data?.slides[0]?.promotion).toBeUndefined();
    expect(result.data?.slides[0]?.secondaryLink).toEqual({
      label: "Learn more",
      size: "medium",
      url: "/learn-more",
    });
    expect(result.issues).toEqual([
      {
        message: "Link URL is missing or empty.",
        path: "slides.0.primaryLink.url",
      },
      {
        message: "Promotion value is missing or empty.",
        path: "slides.0.promotion.value",
      },
    ]);
  });

  test("rejects a carousel without a valid slide", () => {
    const result = parseCmsHeroData({
      slides: [{ image: {}, title: "" }],
    });

    expect(result.data).toBeNull();
    expect(result.issues.map((issue) => issue.path)).toEqual([
      "slides.0.title",
      "slides.0.image.url",
      "slides",
    ]);
  });
});
