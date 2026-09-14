import { describe, expect, test } from "bun:test";

import { parseCmsTrendLookGridData } from "@/features/cms/contracts/trend-look-grid";

describe("parseCmsTrendLookGridData", () => {
  test("parses and sorts the Store API trend cards", () => {
    const result = parseCmsTrendLookGridData({
      cards: [
        {
          description: "Klare Linien",
          id: "modern",
          image: { url: "/media/trend-modern.webp" },
          position: 1,
          title: "Modern",
          url: "/trends/modern",
        },
        {
          description: "Erdige Töne",
          id: "warm",
          image: {
            alt: "Warm minimalism",
            url: "/media/trend-warm.webp",
          },
          position: 0,
          title: "Warm minimalism",
          url: "/trends/warm",
        },
      ],
      eyebrow: "Inspiration",
      title: "Trends",
    });

    expect(result.data?.cards.map((card) => card.id)).toEqual([
      "warm",
      "modern",
    ]);
    expect(result.data?.eyebrow).toBe("Inspiration");
    expect(result.issues).toEqual([]);
  });

  test("rejects a grid without valid cards", () => {
    const result = parseCmsTrendLookGridData({
      cards: [{ image: {}, title: "Warm minimalism" }],
      title: "Trends",
    });

    expect(result.data).toBeNull();
    expect(result.issues.map((issue) => issue.path)).toEqual([
      "cards.0.url",
      "cards.0.image.url",
      "cards",
    ]);
  });
});
