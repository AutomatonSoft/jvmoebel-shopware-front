import { afterEach, describe, expect, test } from "bun:test";

import { searchProducts } from "@/features/search/server/product-search";

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

describe("searchProducts", () => {
  test("returns matching mock products", async () => {
    setEnvironmentVariable("NODE_ENV", "development");
    process.env.SHOPWARE_USE_MOCKS = "true";

    const response = await searchProducts("Alba");

    expect(response.results.map((product) => product.id)).toEqual(["alba"]);
    expect(response.currency).toBe("EUR");
    expect(response.locale).toBe("de-DE");
  });

  test("limits mock results to five products", async () => {
    setEnvironmentVariable("NODE_ENV", "development");
    process.env.SHOPWARE_USE_MOCKS = "true";

    const response = await searchProducts("a");

    expect(response.results).toHaveLength(5);
  });
});
