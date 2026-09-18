import { afterEach, describe, expect, test } from "bun:test";

import { shopProductListingMock } from "@/features/catalog/fixtures/product-listing";
import {
  getWishlistRecommendations,
  getWishlistProducts,
  normalizeWishlistProductIds,
} from "@/features/wishlist/server/wishlist-products";

const originalNodeEnv = process.env.NODE_ENV;
const originalShopwareUseMocks = process.env.SHOPWARE_USE_MOCKS;

function setEnvironmentVariable(name: string, value: string | undefined) {
  if (value === undefined) {
    delete process.env[name];
  } else {
    process.env[name] = value;
  }
}

afterEach(() => {
  setEnvironmentVariable("NODE_ENV", originalNodeEnv);
  setEnvironmentVariable("SHOPWARE_USE_MOCKS", originalShopwareUseMocks);
});

describe("wishlist products", () => {
  test("normalizes duplicate and invalid product IDs", () => {
    expect(
      normalizeWishlistProductIds(["product-1", "product-1", "", 5]),
    ).toEqual(["product-1"]);
  });

  test("returns only selected mock products in saved order", async () => {
    setEnvironmentVariable("NODE_ENV", "development");
    setEnvironmentVariable("SHOPWARE_USE_MOCKS", "true");
    const [firstProduct, secondProduct] = shopProductListingMock.products;

    const response = await getWishlistProducts([
      secondProduct.id,
      "missing-product",
      firstProduct.id,
    ]);

    expect(response.products.map((product) => product.id)).toEqual([
      secondProduct.id,
      firstProduct.id,
    ]);
  });

  test("returns the latest products except saved favorites", async () => {
    setEnvironmentVariable("NODE_ENV", "development");
    setEnvironmentVariable("SHOPWARE_USE_MOCKS", "true");
    const excludedProduct = shopProductListingMock.products.toSorted(
      (first, second) => second.createdAt.localeCompare(first.createdAt),
    )[0];

    const response = await getWishlistRecommendations([excludedProduct.id]);

    expect(response.products).toHaveLength(6);
    expect(response.products.map((product) => product.id)).not.toContain(
      excludedProduct.id,
    );
    expect(response.products).toEqual(
      [...response.products].toSorted((first, second) =>
        second.createdAt.localeCompare(first.createdAt),
      ),
    );
  });
});
