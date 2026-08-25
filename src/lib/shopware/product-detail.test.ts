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
  });

  test("does not recommend the active product", () => {
    const page = getShopProductDetailMock("alba");

    expect(
      page?.recommendations.some(
        (recommendation) => recommendation.id === page.product.id,
      ),
    ).toBe(false);
  });

  test("returns undefined for an unknown slug", () => {
    expect(getShopProductDetailMock("missing-product")).toBeUndefined();
  });
});
