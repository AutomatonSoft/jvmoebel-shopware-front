import { describe, expect, test } from "bun:test";

import { parseCmsPromoBannerData } from "@/features/cms/contracts/promo-banner";

describe("parseCmsPromoBannerData", () => {
  test("parses a linked promo banner", () => {
    const result = parseCmsPromoBannerData({
      contentPosition: "left",
      description: "Wir helfen bei Material und Maß.",
      eyebrow: "Persönlich geplant",
      image: { url: "/images/offers/design-consultation.webp" },
      link: {
        label: "Beratung anfragen",
        size: "large",
        url: "mailto:info@example.com",
      },
      title: "Unsicher bei Material oder Maß?",
    });

    expect(result.data).toEqual({
      contentPosition: "left",
      description: "Wir helfen bei Material und Maß.",
      eyebrow: "Persönlich geplant",
      image: {
        alt: "Unsicher bei Material oder Maß?",
        url: "/images/offers/design-consultation.webp",
      },
      link: {
        label: "Beratung anfragen",
        size: "large",
        url: "mailto:info@example.com",
      },
      title: "Unsicher bei Material oder Maß?",
    });
    expect(result.issues).toEqual([]);
  });

  test("omits an incomplete optional link", () => {
    const result = parseCmsPromoBannerData({
      image: { alt: "Beratung", url: "/banner.webp" },
      link: { label: "Beratung" },
      title: "Beratung",
    });

    expect(result.data?.contentPosition).toBe("right");
    expect(result.data?.link).toBeUndefined();
    expect(result.issues.map((issue) => issue.path)).toEqual(["link"]);
  });

  test("rejects missing required content", () => {
    const result = parseCmsPromoBannerData({ image: {}, title: "" });

    expect(result.data).toBeNull();
    expect(result.issues.map((issue) => issue.path)).toEqual([
      "image.url",
      "title",
    ]);
  });
});
