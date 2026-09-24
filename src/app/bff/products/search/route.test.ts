import { afterEach, describe, expect, test } from "bun:test";
import { NextRequest } from "next/server";

import { GET } from "@/app/bff/products/search/route";
import { productSearchCacheTtlSeconds } from "@/features/search/model/product-search";

const originalShopwareUseMocks = process.env.SHOPWARE_USE_MOCKS;

afterEach(() => {
  if (originalShopwareUseMocks === undefined) {
    delete process.env.SHOPWARE_USE_MOCKS;
  } else {
    process.env.SHOPWARE_USE_MOCKS = originalShopwareUseMocks;
  }
});

describe("GET /bff/products/search", () => {
  test("allows only private browser caching of successful results", async () => {
    process.env.SHOPWARE_USE_MOCKS = "true";

    const response = await GET(
      new NextRequest("http://localhost/bff/products/search?query=Alba"),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe(
      `private, max-age=${productSearchCacheTtlSeconds}`,
    );
    expect((await response.json()).results).toHaveLength(1);
  });
});
