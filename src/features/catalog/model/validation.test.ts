import { describe, expect, test } from "bun:test";

import { parseProductVariantSelection } from "@/features/catalog/model/validation";

describe("product variant validation", () => {
  test("normalizes required identifiers and preserves selected option IDs", () => {
    const formData = new FormData();

    formData.set("currentProductId", " current-product ");
    formData.set("parentProductId", " parent-product ");
    formData.set("switchedGroupId", " group-id ");
    formData.append("optionId", "option-one");
    formData.append("optionId", " option-two ");

    expect(parseProductVariantSelection(formData)).toEqual({
      currentProductId: "current-product",
      optionIds: ["option-one", " option-two "],
      parentProductId: "parent-product",
      switchedGroupId: "group-id",
    });
  });

  test("requires a selected option", () => {
    const formData = new FormData();

    formData.set("currentProductId", "current-product");
    formData.set("parentProductId", "parent-product");
    formData.set("switchedGroupId", "group-id");

    expect(parseProductVariantSelection(formData)).toBeNull();
  });
});
