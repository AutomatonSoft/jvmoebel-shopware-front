import { describe, expect, test } from "bun:test";

import { shopProductDetailsMock } from "@/features/catalog/fixtures/product-detail";
import { shopProductListingMock } from "@/features/catalog/fixtures/product-listing";

describe("shop product detail fixtures", () => {
  test("provides a detail page for every listing product", () => {
    expect(shopProductDetailsMock.map((product) => product.id)).toEqual(
      shopProductListingMock.products.map((product) => product.id),
    );
  });

  test("preserves the complete listing image", () => {
    for (const product of shopProductDetailsMock) {
      expect(product.gallery[0]).toBe(product.image);
    }
  });

  test("provides dimensions and specifications", () => {
    for (const product of shopProductDetailsMock) {
      expect(product.dimensions.width).toBeGreaterThan(0);
      expect(product.dimensions.height).toBeGreaterThan(0);
      expect(product.dimensions.length).toBeGreaterThan(0);
      expect(product.specifications.length).toBeGreaterThan(0);
    }
  });

  test("provides multiple unique gallery images for every mock product", () => {
    for (const product of shopProductDetailsMock) {
      expect(product.gallery.length).toBeGreaterThan(1);
      expect(new Set(product.gallery.map((image) => image.url)).size).toBe(
        product.gallery.length,
      );
    }
  });

  test("provides selectable services", () => {
    for (const product of shopProductDetailsMock) {
      expect(product.services.length).toBeGreaterThan(0);
      expect(product.services.every((service) => service.price > 0)).toBe(true);
      expect(product.services.some((service) => service.available)).toBe(true);
      expect(product.services.some((service) => !service.available)).toBe(true);
    }
  });

  test("provides suggested accessories", () => {
    for (const product of shopProductDetailsMock) {
      expect(product.accessories.length).toBeGreaterThan(0);
      expect(
        new Set(product.accessories.map((accessory) => accessory.id)).size,
      ).toBe(product.accessories.length);
      expect(
        product.accessories.every((accessory) => accessory.price > 0),
      ).toBe(true);
    }
  });
});
