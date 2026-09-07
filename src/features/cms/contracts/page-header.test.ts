import { describe, expect, test } from "bun:test";

import { parseCmsPageHeaderData } from "@/features/cms/contracts/page-header";

describe("parseCmsPageHeaderData", () => {
  test("parses the page heading content", () => {
    const result = parseCmsPageHeaderData({
      description: "Entdecke reduzierte Möbel und Wohnaccessoires.",
      eyebrow: "Preisvorteile für dein Zuhause",
      title: "Sale im Überblick",
    });

    expect(result.data).toEqual({
      description: "Entdecke reduzierte Möbel und Wohnaccessoires.",
      eyebrow: "Preisvorteile für dein Zuhause",
      title: "Sale im Überblick",
    });
    expect(result.issues).toEqual([]);
  });

  test("keeps optional copy optional", () => {
    const result = parseCmsPageHeaderData({ title: "Sale" });

    expect(result.data).toEqual({
      description: undefined,
      eyebrow: undefined,
      title: "Sale",
    });
    expect(result.issues).toEqual([]);
  });

  test("rejects content without a title", () => {
    const result = parseCmsPageHeaderData({
      description: "Beschreibung ohne Überschrift",
      title: "   ",
    });

    expect(result.data).toBeNull();
    expect(result.issues).toEqual([
      {
        message: "Page title is missing or empty.",
        path: "title",
      },
    ]);
  });
});
