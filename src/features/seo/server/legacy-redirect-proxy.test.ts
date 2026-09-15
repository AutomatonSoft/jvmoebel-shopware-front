import { describe, expect, spyOn, test } from "bun:test";
import { NextRequest } from "next/server";

import { handleLegacyRedirectProxyRequest } from "@/features/seo/server/legacy-redirect-proxy";

describe("handleLegacyRedirectProxyRequest", () => {
  test("returns the JvSeo decision as an HTTP 301 redirect", async () => {
    const response = await handleLegacyRedirectProxyRequest(
      new NextRequest("https://www.jvmoebel.de/Old+Product.htm"),
      async () => ({
        categoryId: null,
        mediaId: null,
        productId: "product-id",
        statusCode: 301,
        targetUrl: "https://www.jvmoebel.de/New-Product/100",
        type: "product",
      }),
    );

    expect(response.status).toBe(301);
    expect(response.headers.get("location")).toBe(
      "https://www.jvmoebel.de/New-Product/100",
    );
  });

  test("continues normal routing when JvSeo has no redirect", async () => {
    const response = await handleLegacyRedirectProxyRequest(
      new NextRequest("https://www.jvmoebel.de/current-category"),
      async () => null,
    );

    expect(response.headers.get("x-middleware-next")).toBe("1");
  });

  test("does not look up internal routes or non-navigation methods", async () => {
    let calls = 0;
    const lookup = async () => {
      calls += 1;

      return null;
    };

    await handleLegacyRedirectProxyRequest(
      new NextRequest("https://www.jvmoebel.de/_next/static/app.js"),
      lookup,
    );
    await handleLegacyRedirectProxyRequest(
      new NextRequest("https://www.jvmoebel.de/api/health"),
      lookup,
    );
    await handleLegacyRedirectProxyRequest(
      new NextRequest("https://www.jvmoebel.de/current-category", {
        method: "POST",
      }),
      lookup,
    );

    expect(calls).toBe(0);
  });

  test("continues normal routing when lookup fails", async () => {
    const consoleError = spyOn(console, "error").mockImplementation(() => {});

    try {
      const response = await handleLegacyRedirectProxyRequest(
        new NextRequest("https://www.jvmoebel.de/Old+Product.htm"),
        async () => {
          throw new Error("Shopware is unavailable");
        },
      );

      expect(response.headers.get("x-middleware-next")).toBe("1");
      expect(consoleError).toHaveBeenCalledWith(
        "JvSeo redirect lookup failed.",
      );
    } finally {
      consoleError.mockRestore();
    }
  });

  test("does not follow a redirect loop", async () => {
    const consoleError = spyOn(console, "error").mockImplementation(() => {});

    try {
      const response = await handleLegacyRedirectProxyRequest(
        new NextRequest("https://www.jvmoebel.de/current-category"),
        async () => ({
          categoryId: null,
          mediaId: null,
          productId: null,
          statusCode: 301,
          targetUrl: "https://www.jvmoebel.de/current-category",
          type: "general",
        }),
      );

      expect(response.headers.get("x-middleware-next")).toBe("1");
      expect(consoleError).toHaveBeenCalledWith(
        "JvSeo returned a redirect to the requested URL.",
      );
    } finally {
      consoleError.mockRestore();
    }
  });
});
