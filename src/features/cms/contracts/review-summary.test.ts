import { describe, expect, test } from "bun:test";

import { parseCmsReviewSummaryData } from "@/features/cms/contracts/review-summary";

describe("parseCmsReviewSummaryData", () => {
  test("parses the Store API review summary contract", () => {
    const result = parseCmsReviewSummaryData({
      rating: 4.7,
      sourceLabel: "Kundenstimmen",
      summary: "Sehr zufrieden",
    });

    expect(result.data).toEqual({
      rating: 4.7,
      sourceLabel: "Kundenstimmen",
      summary: "Sehr zufrieden",
    });
    expect(result.issues).toEqual([]);
  });

  test("rejects ratings outside the supported range", () => {
    const result = parseCmsReviewSummaryData({
      rating: 5.5,
      sourceLabel: "Kundenstimmen",
      summary: "Sehr zufrieden",
    });

    expect(result.data).toBeNull();
    expect(result.issues).toEqual([
      { message: "rating must be between 0 and 5.", path: "rating" },
    ]);
  });
});
