import { describe, expect, test } from "bun:test";

import { getSearchUrl } from "@/features/search/model/search-url";

describe("getSearchUrl", () => {
  test("trims and encodes the search query", () => {
    expect(getSearchUrl(" sofa & bett ")).toBe(
      "/suche?query=sofa%20%26%20bett",
    );
  });
});
