import { afterEach, describe, expect, test } from "bun:test";
import { NextRequest } from "next/server";

import { GET } from "@/app/bff/products/search/route";

const originalShopwareUseMocks = process.env.SHOPWARE_USE_MOCKS;

afterEach(() => {
  if (originalShopwareUseMocks === undefined) {
    delete process.env.SHOPWARE_USE_MOCKS;
  } else {
    process.env.SHOPWARE_USE_MOCKS = originalShopwareUseMocks;
  }
});

describe("GET /bff/products/search", () => {
  test("T01: never caches a successful response containing prices", async () => {
    process.env.SHOPWARE_USE_MOCKS = "true";

    const response = await GET(
      new NextRequest("http://localhost/bff/products/search?query=Alba"),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toMatch(
      /(?:^|,)\s*no-store\s*(?:,|$)/,
    );
    expect(response.headers.get("Cache-Control")).not.toMatch(
      /(?:s-maxage|max-age)=[1-9]/,
    );
    expect((await response.json()).results).toHaveLength(1);
  });
});
