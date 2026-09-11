import { describe, expect, test } from "bun:test";

import { parseCmsFaqData } from "@/features/cms/contracts/faq";

describe("parseCmsFaqData", () => {
  test("parses and sorts FAQ items", () => {
    const result = parseCmsFaqData({
      eyebrow: "Gut zu wissen",
      items: {
        duration: {
          answer: "Die Gültigkeit steht beim Angebot.",
          position: 2,
          question: "Wie lange ist ein Rabattcode gültig?",
        },
        redeem: {
          answer: "Gib den Code im Warenkorb ein.",
          id: "redeem-code",
          position: 0,
          question: "Wie löse ich einen Rabattcode ein?",
        },
      },
      title: "Häufige Fragen",
    });

    expect(result.data?.items.map((item) => item.id)).toEqual([
      "redeem-code",
      "Wie lange ist ein Rabattcode gültig?-0",
    ]);
    expect(result.issues).toEqual([]);
  });

  test("omits incomplete questions", () => {
    const result = parseCmsFaqData({
      items: [
        { answer: "Missing question" },
        { answer: "Valid answer", question: "Valid question" },
      ],
      title: "FAQ",
    });

    expect(result.data?.items).toHaveLength(1);
    expect(result.issues.map((issue) => issue.path)).toEqual(["items.0"]);
  });

  test("rejects missing title and items", () => {
    const result = parseCmsFaqData({ items: [] });

    expect(result.data).toBeNull();
    expect(result.issues.map((issue) => issue.path)).toEqual([
      "items",
      "title",
    ]);
  });
});
