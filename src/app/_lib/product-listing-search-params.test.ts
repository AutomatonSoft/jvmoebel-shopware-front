import { describe, expect, test } from "bun:test";

import { getProductPageRequest } from "@/app/_lib/product-listing-search-params";

describe("getProductPageRequest", () => {
  test("keeps property options grouped for dynamic facet counts", () => {
    const request = getProductPageRequest({
      property: [
        "color-group:red-option",
        "color-group:blue-option",
        "size-group:large-option",
      ],
    });

    expect(request.propertyIds).toEqual([
      "red-option",
      "blue-option",
      "large-option",
    ]);
    expect(request.propertyGroups).toEqual({
      "color-group": ["red-option", "blue-option"],
      "size-group": ["large-option"],
    });
  });

  test("continues to accept existing ungrouped property parameters", () => {
    const request = getProductPageRequest({ property: "legacy-option" });

    expect(request.propertyIds).toEqual(["legacy-option"]);
    expect(request.propertyGroups).toEqual({});
  });
});
