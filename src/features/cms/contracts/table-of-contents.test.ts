import { describe, expect, test } from "bun:test";

import { parseCmsTableOfContentsData } from "@/features/cms/contracts/table-of-contents";

describe("parseCmsTableOfContentsData", () => {
  test("parses and sorts table of contents items", () => {
    const result = parseCmsTableOfContentsData({
      items: [
        { anchorId: "tipps", id: "tips", label: "Tipps", position: 2 },
        {
          anchorId: "einleitung",
          id: "intro",
          label: "Einleitung",
          position: 0,
        },
      ],
      title: "Inhalt",
    });

    expect(result.data?.items.map((item) => item.anchorId)).toEqual([
      "einleitung",
      "tipps",
    ]);
    expect(result.issues).toEqual([]);
  });

  test("rejects unsafe or incomplete anchors", () => {
    const result = parseCmsTableOfContentsData({
      items: [{ anchorId: "bad anchor", label: "Ungültig" }],
      title: "Inhalt",
    });

    expect(result.data).toBeNull();
    expect(result.issues.map((issue) => issue.path)).toEqual([
      "items.0.anchorId",
      "items",
    ]);
  });
});
