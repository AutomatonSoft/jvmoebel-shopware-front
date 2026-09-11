import { existsSync } from "node:fs";
import path from "node:path";

import { describe, expect, test } from "bun:test";

import { shopProductListingMock } from "@/features/catalog/fixtures/product-listing";

const allowedSizes = new Set(["small", "medium", "large", "extra-large"]);
const cssHexColorPattern = /^#[0-9a-f]{6}$/i;

describe("shopProductListingMock", () => {
  test("has valid listing metadata and unique products", () => {
    const productIds = shopProductListingMock.products.map(
      (product) => product.id,
    );

    expect(shopProductListingMock.products.length).toBeGreaterThan(0);
    expect(new Set(productIds).size).toBe(productIds.length);
    expect(() =>
      new Intl.NumberFormat(shopProductListingMock.locale, {
        currency: shopProductListingMock.currency,
        style: "currency",
      }).format(0),
    ).not.toThrow();
  });

  test("contains products that satisfy runtime assumptions", () => {
    for (const product of shopProductListingMock.products) {
      expect(Number.isNaN(Date.parse(product.createdAt))).toBe(false);
      expect(Number.isFinite(product.featuredRank)).toBe(true);
      expect(Number.isFinite(product.unitPrice)).toBe(true);
      expect(product.unitPrice).toBeGreaterThanOrEqual(0);
      expect(product.url.startsWith("/")).toBe(true);
      expect(product.colors.length).toBeGreaterThan(0);

      for (const color of product.colors) {
        expect(cssHexColorPattern.test(color.hex)).toBe(true);
      }

      for (const size of product.sizes) {
        expect(allowedSizes.has(size)).toBe(true);
      }
    }
  });

  test("references existing local images", () => {
    for (const product of shopProductListingMock.products) {
      const publicPath = path.join(
        process.cwd(),
        "public",
        product.image.url.replace(/^\//, ""),
      );

      expect(product.image.url.startsWith("/images/")).toBe(true);
      expect(existsSync(publicPath)).toBe(true);
    }
  });

  test("provides reduced products for the offers page", () => {
    expect(
      shopProductListingMock.products.every(
        (product) =>
          product.previousPrice && product.previousPrice > product.unitPrice,
      ),
    ).toBe(true);
  });
});
