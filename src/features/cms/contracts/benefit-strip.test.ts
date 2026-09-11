import { describe, expect, test } from "bun:test";

import { parseCmsBenefitStripData } from "@/features/cms/contracts/benefit-strip";

describe("parseCmsBenefitStripData", () => {
  test("parses and sorts benefits", () => {
    const result = parseCmsBenefitStripData({
      items: {
        delivery: {
          description: "Lieferung bis zum Wunschort.",
          icon: "delivery",
          position: 2,
          title: "Möbelspedition",
        },
        price: {
          id: "fair-price",
          description: "Transparente Preisvorteile.",
          icon: "price",
          position: 0,
          title: "Faire Preise",
        },
      },
    });

    expect(result.data?.items.map((item) => item.id)).toEqual([
      "fair-price",
      "Möbelspedition-0",
    ]);
    expect(result.issues).toEqual([]);
  });

  test("omits invalid benefits", () => {
    const result = parseCmsBenefitStripData({
      items: [
        { description: "Invalid", icon: "unknown", title: "Invalid" },
        { description: "Valid", icon: "returns", title: "Rückgabe" },
      ],
    });

    expect(result.data?.items).toHaveLength(1);
    expect(result.issues.map((issue) => issue.path)).toEqual(["items.0"]);
  });

  test("rejects an empty benefit strip", () => {
    const result = parseCmsBenefitStripData({ items: [] });

    expect(result.data).toBeNull();
    expect(result.issues.map((issue) => issue.path)).toEqual(["items"]);
  });
});
