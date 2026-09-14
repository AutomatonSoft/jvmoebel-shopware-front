import { describe, expect, test } from "bun:test";

import { parseCmsGuideHubCardsData } from "@/features/cms/contracts/guide-hub-cards";

describe("parseCmsGuideHubCardsData", () => {
  test("parses and sorts the Store API guide cards", () => {
    const result = parseCmsGuideHubCardsData({
      cards: [
        {
          description: "Materialien richtig kombinieren",
          id: "materials",
          image: { url: "/media/guide-materials.webp" },
          position: 2,
          title: "Materialguide",
          url: "/guides/materials",
        },
        {
          description: "Einrichten leicht gemacht",
          id: "living",
          image: {
            alt: "Wohnzimmer",
            url: "/media/guide-living.webp",
          },
          position: 0,
          title: "Wohnzimmer",
          url: "/guides/living",
        },
      ],
      eyebrow: "Guides",
      title: "Ratgeber",
    });

    expect(result.data?.cards.map((card) => card.id)).toEqual([
      "living",
      "materials",
    ]);
    expect(result.data?.cards[0]?.image.alt).toBe("Wohnzimmer");
    expect(result.data?.eyebrow).toBe("Guides");
    expect(result.issues).toEqual([]);
  });

  test("rejects a guide hub without valid cards", () => {
    const result = parseCmsGuideHubCardsData({
      cards: [{ image: {}, title: "Wohnzimmer" }],
      title: "Ratgeber",
    });

    expect(result.data).toBeNull();
    expect(result.issues.map((issue) => issue.path)).toEqual([
      "cards.0.url",
      "cards.0.image.url",
      "cards",
    ]);
  });
});
