import { describe, expect, test } from "bun:test";

import {
  toggleCatalogPropertyValue,
  toggleCatalogQueryValue,
} from "@/features/catalog/model/catalog-query";

describe("catalog query toggles", () => {
  test("keeps earlier selections while toggling another category", () => {
    const parameters = new URLSearchParams("category=first");

    expect(toggleCatalogQueryValue(parameters, "category", "second")).toEqual([
      "first",
      "second",
    ]);
  });

  test("supports repeated and comma-separated values", () => {
    const parameters = new URLSearchParams(
      "manufacturer=first,second&manufacturer=third",
    );

    expect(
      toggleCatalogQueryValue(parameters, "manufacturer", "second"),
    ).toEqual(["first", "third"]);
  });

  test("preserves other property groups and ungrouped properties", () => {
    const parameters = new URLSearchParams(
      "property=color%3Ared&property=size%3Alarge&property=legacy",
    );

    expect(toggleCatalogPropertyValue(parameters, "color", "blue")).toEqual([
      "color:red",
      "size:large",
      "legacy",
      "color:blue",
    ]);
  });
});
