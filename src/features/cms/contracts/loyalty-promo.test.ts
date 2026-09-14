import { describe, expect, test } from "bun:test";

import { parseCmsLoyaltyPromoData } from "@/features/cms/contracts/loyalty-promo";

describe("parseCmsLoyaltyPromoData", () => {
  test("parses and sorts the Store API loyalty promo benefits", () => {
    const result = parseCmsLoyaltyPromoData({
      benefits: [
        { id: "events", position: 2, text: "Exklusive Events" },
        { id: "shipping", position: 0, text: "Gratis Versand" },
      ],
      description: "Punkte sammeln",
      image: { alt: "Homie Club", url: "/media/loyalty.webp" },
      link: { label: "Mehr erfahren", size: "medium", url: "/club" },
      promoCode: "CLUB",
      title: "Homie Club",
    });

    expect(result.data?.benefits.map((benefit) => benefit.id)).toEqual([
      "shipping",
      "events",
    ]);
    expect(result.data?.promoCode).toBe("CLUB");
    expect(result.issues).toEqual([]);
  });

  test("rejects incomplete loyalty promo content", () => {
    const result = parseCmsLoyaltyPromoData({
      benefits: [{}],
      image: {},
      link: { label: "Mehr erfahren" },
      title: "Homie Club",
    });

    expect(result.data).toBeNull();
    expect(result.issues.map((issue) => issue.path)).toEqual([
      "benefits.0.text",
      "image.url",
      "link",
      "benefits",
    ]);
  });
});
