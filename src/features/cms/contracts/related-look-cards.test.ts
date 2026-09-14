import { describe, expect, test } from "bun:test";

import { parseCmsRelatedLookCardsData } from "@/features/cms/contracts/related-look-cards";

describe("parseCmsRelatedLookCardsData", () => {
  test("parses and sorts related look cards", () => {
    const result = parseCmsRelatedLookCardsData({
      cards: [
        {
          description: "Helle Töne",
          id: "skandi",
          image: { alt: "Skandinavisch", url: "/media/skandi.webp" },
          position: 2,
          title: "Skandinavisch",
          url: "/looks/skandi",
        },
        {
          id: "modern",
          image: { url: "/media/modern.webp" },
          position: 0,
          title: "Modern",
          url: "/looks/modern",
        },
      ],
      title: "Verwandte Looks",
    });

    expect(result.data?.cards.map((card) => card.id)).toEqual([
      "modern",
      "skandi",
    ]);
    expect(result.data?.cards[0]?.image.alt).toBe("Modern");
    expect(result.issues).toEqual([]);
  });

  test("rejects a collection without valid cards", () => {
    const result = parseCmsRelatedLookCardsData({
      cards: [{ image: {}, title: "Skandinavisch" }],
      title: "Verwandte Looks",
    });

    expect(result.data).toBeNull();
    expect(result.issues.map((issue) => issue.path)).toEqual([
      "cards.0.url",
      "cards.0.image.url",
      "cards",
    ]);
  });
});
