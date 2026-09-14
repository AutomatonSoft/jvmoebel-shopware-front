import { describe, expect, test } from "bun:test";

import { parseCmsPromoDealTilesData } from "@/features/cms/contracts/promo-deal-tiles";

describe("parseCmsPromoDealTilesData", () => {
  test("parses and sorts the Store API deal tiles", () => {
    const result = parseCmsPromoDealTilesData({
      eyebrow: "Diese Woche",
      tiles: [
        {
          description: "Bis -40 %",
          discountLabel: "-40 %",
          endsAt: "2026-09-14T23:59:59+02:00",
          id: "sofas",
          image: { alt: "Sofas", url: "/media/deal-sofas.webp" },
          label: "Sofas",
          link: {
            label: "Entdecken",
            size: "medium",
            url: "/sale/sofas",
          },
          position: 2,
        },
        {
          id: "beds",
          image: { url: "/media/deal-beds.webp" },
          label: "Betten",
          link: { label: "Entdecken", url: "/sale/betten" },
          position: 0,
        },
      ],
      title: "Deals",
    });

    expect(result.data?.tiles.map((tile) => tile.id)).toEqual([
      "beds",
      "sofas",
    ]);
    expect(result.data?.tiles[0]?.image.alt).toBe("Betten");
    expect(result.data?.tiles[0]?.link.size).toBe("medium");
    expect(result.issues).toEqual([]);
  });

  test("omits invalid tiles and reports their paths", () => {
    const result = parseCmsPromoDealTilesData({
      tiles: [
        {
          endsAt: "invalid",
          image: {},
          label: "Sofas",
          link: { label: "Entdecken" },
        },
      ],
      title: "Deals",
    });

    expect(result.data).toBeNull();
    expect(result.issues.map((issue) => issue.path)).toEqual([
      "tiles.0.image.url",
      "tiles.0.link",
      "tiles.0.endsAt",
      "tiles",
    ]);
  });
});
