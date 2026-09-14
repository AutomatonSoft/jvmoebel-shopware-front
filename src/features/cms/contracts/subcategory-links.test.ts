import { describe, expect, test } from "bun:test";

import { parseCmsSubcategoryLinksData } from "@/features/cms/contracts/subcategory-links";

describe("parseCmsSubcategoryLinksData", () => {
  test("parses and sorts the Store API subcategory links", () => {
    const result = parseCmsSubcategoryLinksData({
      links: [
        {
          id: "schlafsofas",
          label: "Schlafsofas",
          position: 2,
          url: "/sofas/schlafsofas",
        },
        {
          id: "ecksofas",
          label: "Ecksofas",
          position: 0,
          url: "/sofas/eck",
        },
      ],
      title: "Unterkategorien",
    });

    expect(result.data?.links.map((link) => link.id)).toEqual([
      "ecksofas",
      "schlafsofas",
    ]);
    expect(result.issues).toEqual([]);
  });

  test("rejects a collection without valid links", () => {
    const result = parseCmsSubcategoryLinksData({
      links: [{ label: "Ecksofas" }],
      title: "Unterkategorien",
    });

    expect(result.data).toBeNull();
    expect(result.issues.map((issue) => issue.path)).toEqual([
      "links.0.url",
      "links",
    ]);
  });
});
