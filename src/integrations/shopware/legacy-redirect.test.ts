import { describe, expect, test } from "bun:test";

import type { ShopwareClient } from "@/integrations/shopware/client";
import {
  getShopwareLegacyRedirect,
  parseShopwareLegacyRedirectDecision,
} from "@/integrations/shopware/legacy-redirect";

describe("JvSeo legacy redirect integration", () => {
  test("requests a redirect decision from the current Store API", async () => {
    let operation = "";
    let parameters: unknown;
    const client = {
      invoke: async (
        requestedOperation: string,
        requestedParameters: unknown,
      ) => {
        operation = requestedOperation;
        parameters = requestedParameters;

        return {
          data: {
            data: {
              categoryId: null,
              mediaId: null,
              productId: "product-id",
              statusCode: 301,
              targetUrl: "https://www.jvmoebel.de/New-Product/100",
              type: "product",
            },
          },
        };
      },
    } as unknown as ShopwareClient;

    await expect(
      getShopwareLegacyRedirect(
        client,
        "https://www.jvmoebel.de/Old+Product.htm",
      ),
    ).resolves.toEqual({
      categoryId: null,
      mediaId: null,
      productId: "product-id",
      statusCode: 301,
      targetUrl: "https://www.jvmoebel.de/New-Product/100",
      type: "product",
    });
    expect(operation).toBe("readJvSeoRedirect post /jv-seo/redirect");
    expect(parameters).toMatchObject({
      body: { url: "https://www.jvmoebel.de/Old+Product.htm" },
      fetchOptions: { cache: "no-store", retry: 0, timeout: 2_000 },
    });
  });

  test("preserves a missing redirect decision", () => {
    expect(parseShopwareLegacyRedirectDecision(null)).toBeNull();
  });

  test("accepts a category redirect decision", () => {
    expect(
      parseShopwareLegacyRedirectDecision({
        categoryId: "category-id",
        mediaId: null,
        productId: null,
        statusCode: 301,
        targetUrl: "https://www.jvmoebel.de/sofas/chesterfield",
        type: "category",
      }),
    ).toEqual({
      categoryId: "category-id",
      mediaId: null,
      productId: null,
      statusCode: 301,
      targetUrl: "https://www.jvmoebel.de/sofas/chesterfield",
      type: "category",
    });
  });

  test("accepts an image redirect decision", () => {
    expect(
      parseShopwareLegacyRedirectDecision({
        categoryId: null,
        mediaId: "media-id",
        productId: null,
        statusCode: 301,
        targetUrl: "https://media.jvmoebel.de/media/new-sofa.jpg",
        type: "image",
      }),
    ).toEqual({
      categoryId: null,
      mediaId: "media-id",
      productId: null,
      statusCode: 301,
      targetUrl: "https://media.jvmoebel.de/media/new-sofa.jpg",
      type: "image",
    });
  });

  test("rejects malformed or unsafe redirect decisions", () => {
    expect(() =>
      parseShopwareLegacyRedirectDecision({
        categoryId: null,
        mediaId: null,
        productId: null,
        statusCode: 302,
        targetUrl: "https://www.jvmoebel.de/new",
        type: "general",
      }),
    ).toThrow("JvSeo returned an invalid redirect decision.");

    expect(() =>
      parseShopwareLegacyRedirectDecision({
        categoryId: null,
        mediaId: null,
        productId: null,
        statusCode: 301,
        targetUrl: "javascript:alert(1)",
        type: "general",
      }),
    ).toThrow("JvSeo returned an invalid redirect decision.");

    expect(() =>
      parseShopwareLegacyRedirectDecision({
        categoryId: null,
        mediaId: null,
        productId: null,
        statusCode: 301,
        targetUrl: "https://www.jvmoebel.de/sofas",
        type: "category",
      }),
    ).toThrow("JvSeo returned an invalid redirect decision.");

    expect(() =>
      parseShopwareLegacyRedirectDecision({
        categoryId: null,
        mediaId: null,
        productId: null,
        statusCode: 301,
        targetUrl: "https://media.jvmoebel.de/media/new-sofa.jpg",
        type: "image",
      }),
    ).toThrow("JvSeo returned an invalid redirect decision.");
  });
});
