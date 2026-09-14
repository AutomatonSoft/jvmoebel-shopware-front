import { describe, expect, test } from "bun:test";

import type { ShopwareClient } from "@/integrations/shopware/client";
import { resolveShopwareStorefrontRoute } from "@/integrations/shopware/storefront-route";

function createClient(
  responses: Array<
    Array<{
      foreignKey: string;
      isCanonical: boolean;
      isDeleted?: boolean;
      routeName: "frontend.detail.page" | "frontend.navigation.page";
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
});
