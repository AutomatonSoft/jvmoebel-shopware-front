import { describe, expect, test } from "bun:test";

import { findExactSearchCategory } from "@/features/search/model/match-search-category";

describe("findExactSearchCategory", () => {
  test("matches a category without considering case or surrounding spaces", () => {
    const category = findExactSearchCategory(" sofa ", [
      { count: 12, label: "Ecksofa", value: "corner-sofa-id" },
      { count: 8, label: "Sofa", value: "sofa-id" },
    ]);

    expect(category?.value).toBe("sofa-id");
  });

  test("does not select a partial or unavailable category", () => {
    expect(
      findExactSearchCategory("sofa", [
        { count: 12, label: "Ecksofa", value: "corner-sofa-id" },
        { count: 0, label: "Sofa", value: "sofa-id" },
      ]),
    ).toBeUndefined();
  });
});
