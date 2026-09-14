import { describe, expect, test } from "bun:test";

import { parseCmsTrustRatingData } from "@/features/cms/contracts/trust-rating";

describe("parseCmsTrustRatingData", () => {
  test("parses the Store API trust rating contract", () => {
    const result = parseCmsTrustRatingData({
      link: { label: "Bewertungen", url: "https://example.com/reviews" },
      providerLabel: "Review provider",
      rating: 4.8,
      reviewCount: 12_500,
    });

    expect(result.data).toEqual({
      link: {
        label: "Bewertungen",
        size: "medium",
        url: "https://example.com/reviews",
      },
      providerLabel: "Review provider",
      rating: 4.8,
      reviewCount: 12_500,
    });
    expect(result.issues).toEqual([]);
  });

  test("rejects invalid rating values", () => {
    const result = parseCmsTrustRatingData({
      link: { label: "Bewertungen", url: "https://example.com/reviews" },
      providerLabel: "Review provider",
      rating: 6,
      reviewCount: 2.5,
    });

    expect(result.data).toBeNull();
    expect(result.issues).toEqual([
      { message: "rating must be between 0 and 5.", path: "rating" },
      {
        message: "reviewCount must be a non-negative integer.",
        path: "reviewCount",
      },
    ]);
  });
});
