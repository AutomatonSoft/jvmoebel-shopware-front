import { describe, expect, test } from "bun:test";

import {
  getShopProductDetailMock,
  shopProductDetailsMock,
} from "@/lib/shopware/mocks/product-detail";
import { shopProductListingMock } from "@/lib/shopware/mocks/product-listing";

describe("shop product detail mock", () => {
  test("provides detail data for every product listing card", () => {
    expect(shopProductDetailsMock.map((product) => product.id)).toEqual(
      shopProductListingMock.products.map((product) => product.id),
    );
  });

  test("resolves a product detail page by slug", () => {
    const page = getShopProductDetailMock("alba");

    expect(page?.product.name).toBe("Alba Modular Sofa");
    expect(page?.product.gallery[0]).toEqual(page?.product.image);
    expect(page?.product.optionGroups.map((group) => group.id)).toEqual([
      "colour",
      "fabric",
      "configuration",
    ]);
    expect(page?.product.specifications).toContainEqual({
      id: "material",
      label: "Material",
      value: "Bouclé",
    });
    expect(page?.product.dimensions).toEqual({
      height: 82,
      length: 178,
      unit: "cm",
      width: 286,
    });
  });

  test("does not recommend the active product", () => {
    const page = getShopProductDetailMock("alba");

    expect(
      page?.recommendations.some(
        (recommendation) => recommendation.id === page.product.id,
      ),
    ).toBe(false);
  });

  test("prioritizes products from the same category", () => {
    const page = getShopProductDetailMock("alba");

    expect(
      page?.recommendations
        .slice(0, 2)
        .every((recommendation) => recommendation.category === "sofas"),
    ).toBe(true);
  });

  test("returns undefined for an unknown slug", () => {
    expect(getShopProductDetailMock("missing-product")).toBeUndefined();
  });
});
