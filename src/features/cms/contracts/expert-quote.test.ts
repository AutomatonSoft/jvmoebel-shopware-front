import { describe, expect, test } from "bun:test";

import { parseCmsExpertQuoteData } from "@/features/cms/contracts/expert-quote";

describe("parseCmsExpertQuoteData", () => {
  test("parses the Store API expert quote contract", () => {
    const result = parseCmsExpertQuoteData({
      apiAlias: "cms_jv_expert_quote",
      authorName: "Anna",
      authorRole: "Interior Expert",
      quote: "Qualität zahlt sich aus.",
    });

    expect(result.data).toEqual({
      authorName: "Anna",
      authorRole: "Interior Expert",
      quote: "Qualität zahlt sich aus.",
    });
    expect(result.issues).toEqual([]);
  });

  test("rejects incomplete expert quotes", () => {
    const result = parseCmsExpertQuoteData({
      authorName: "Anna",
      quote: "Qualität zahlt sich aus.",
    });

    expect(result.data).toBeNull();
    expect(result.issues.map((issue) => issue.path)).toEqual(["authorRole"]);
  });
});
