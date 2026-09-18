import { describe, expect, test } from "bun:test";

import type { ShopwareClient } from "@/integrations/shopware/client";
import {
  getShopwareCanonicalProductPath,
  resolveShopwareStorefrontRoute,
} from "@/integrations/shopware/storefront-route";

function createClient(
  responses: Array<
    Array<{
      foreignKey: string;
      isCanonical: boolean;
      isDeleted?: boolean;
      routeName:
        | "frontend.detail.page"
        | "frontend.landing.page"
        | "frontend.navigation.page";
      seoPathInfo: string;
    }>
  >,
) {
  const client = {
    invoke: async () => ({ data: { elements: responses.shift() ?? [] } }),
  } as unknown as ShopwareClient;

  return client;
}

describe("resolveShopwareStorefrontRoute", () => {
  test("finds the canonical SEO path for a product ID", async () => {
    const client = createClient([
      [
        {
          foreignKey: "product-id",
          isCanonical: false,
          routeName: "frontend.detail.page",
          seoPathInfo: "Altes-Sofa/JV-100",
        },
        {
          foreignKey: "product-id",
          isCanonical: true,
          routeName: "frontend.detail.page",
          seoPathInfo: "Sofa-Alba/JV-100",
        },
      ],
    ]);

    await expect(
      getShopwareCanonicalProductPath(client, "product-id"),
    ).resolves.toBe("/Sofa-Alba/JV-100");
  });

  test("resolves a canonical product SEO path without a trailing slash", async () => {
    const client = createClient([
      [
        {
          foreignKey: "product-id",
          isCanonical: true,
          routeName: "frontend.detail.page",
          seoPathInfo: "Sofa-Alba/JV-100",
        },
      ],
    ]);

    await expect(
      resolveShopwareStorefrontRoute(client, "/Sofa-Alba/JV-100"),
    ).resolves.toEqual({
      canonicalPath: "/Sofa-Alba/JV-100",
      entityId: "product-id",
      kind: "product",
      shouldRedirect: false,
    });
  });

  test("returns the canonical product path for an outdated SEO URL", async () => {
    const client = createClient([
      [
        {
          foreignKey: "product-id",
          isCanonical: false,
          routeName: "frontend.detail.page",
          seoPathInfo: "Altes-Sofa/JV-100",
        },
      ],
      [
        {
          foreignKey: "product-id",
          isCanonical: true,
          routeName: "frontend.detail.page",
          seoPathInfo: "Neues-Sofa/JV-100",
        },
      ],
    ]);

    await expect(
      resolveShopwareStorefrontRoute(client, "/Altes-Sofa/JV-100"),
    ).resolves.toMatchObject({
      canonicalPath: "/Neues-Sofa/JV-100",
      entityId: "product-id",
      kind: "product",
      shouldRedirect: true,
    });
  });

  test("resolves a Shopware landing page SEO path", async () => {
    const client = createClient([
      [
        {
          foreignKey: "landing-page-id",
          isCanonical: true,
          routeName: "frontend.landing.page",
          seoPathInfo: "ueber-uns",
        },
      ],
    ]);

    await expect(
      resolveShopwareStorefrontRoute(client, "/ueber-uns"),
    ).resolves.toEqual({
      canonicalPath: "/ueber-uns",
      entityId: "landing-page-id",
      kind: "landing-page",
      shouldRedirect: false,
    });
  });
});
