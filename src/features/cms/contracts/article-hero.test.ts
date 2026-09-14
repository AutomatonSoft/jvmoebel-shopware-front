import { describe, expect, test } from "bun:test";

import { parseCmsArticleHeroData } from "@/features/cms/contracts/article-hero";

describe("parseCmsArticleHeroData", () => {
  test("parses the Store API article hero contract", () => {
    const result = parseCmsArticleHeroData({
      description: "Tipps für Zuhause",
      eyebrow: "Ratgeber",
      image: {
        alt: "Einrichten mit Stil",
        url: "/media/article-hero.webp",
      },
      publishedAt: "2026-03-01T10:00:00+01:00",
      readTimeMinutes: 5,
      title: "Einrichten mit Stil",
    });

    expect(result.data).toEqual({
      description: "Tipps für Zuhause",
      eyebrow: "Ratgeber",
      image: {
        alt: "Einrichten mit Stil",
        url: "/media/article-hero.webp",
      },
      publishedAt: "2026-03-01T10:00:00+01:00",
      readTimeMinutes: 5,
      title: "Einrichten mit Stil",
    });
    expect(result.issues).toEqual([]);
  });

  test("rejects invalid article metadata", () => {
    const result = parseCmsArticleHeroData({
      image: {},
      publishedAt: "not-a-date",
      readTimeMinutes: 0,
      title: "Einrichten mit Stil",
    });

    expect(result.data).toBeNull();
    expect(result.issues.map((issue) => issue.path)).toEqual([
      "image.url",
      "publishedAt",
      "readTimeMinutes",
    ]);
  });
});
