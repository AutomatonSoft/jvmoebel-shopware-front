import { describe, expect, test } from "bun:test";

import { resolveShopwareCategoryRoute } from "@/integrations/shopware/category-route";
import type { ShopwareClient } from "@/integrations/shopware/client";

function createClient(
  responses: Array<{
    foreignKey: string;
    isCanonical: boolean;
    isDeleted?: boolean;
    routeName: "frontend.detail.page" | "frontend.navigation.page";
    seoPathInfo: string;
  }>[],
) {
  const requests: unknown[] = [];
  const client = {
    invoke: async (_operation: string, request: unknown) => {
      requests.push(request);

      return { data: { elements: responses.shift() ?? [] } };
    },
  } as unknown as ShopwareClient;

  return { client, requests };
}

describe("resolveShopwareCategoryRoute", () => {
  test("resolves a canonical category SEO path", async () => {
    const { client, requests } = createClient([
      [
        {
          foreignKey: "category-id",
          isCanonical: true,
          routeName: "frontend.navigation.page",
          seoPathInfo: "Moebel-Wohnen/Wohnzimmer/",
        },
      ],
    ]);

    await expect(
      resolveShopwareCategoryRoute(
        client,
        "/Moebel-Wohnen/Wohnzimmer?order=price",
      ),
    ).resolves.toEqual({
      canonicalPath: "/Moebel-Wohnen/Wohnzimmer/",
      categoryId: "category-id",
      shouldRedirect: false,
    });
    expect(requests[0]).toMatchObject({
      body: {
        filter: [
          {
            field: "seoPathInfo",
            type: "equals",
            value: "Moebel-Wohnen/Wohnzimmer/",
          },
        ],
      },
    });
  });

  test("returns the canonical path for an outdated SEO URL", async () => {
    const { client } = createClient([
      [
        {
          foreignKey: "category-id",
          isCanonical: false,
          routeName: "frontend.navigation.page",
          seoPathInfo: "Alte-Kategorie/",
        },
      ],
      [
        {
          foreignKey: "category-id",
          isCanonical: true,
          routeName: "frontend.navigation.page",
          seoPathInfo: "Neue-Kategorie/",
        },
      ],
    ]);

    await expect(
      resolveShopwareCategoryRoute(client, "/Alte-Kategorie/"),
    ).resolves.toEqual({
      canonicalPath: "/Neue-Kategorie/",
      categoryId: "category-id",
      shouldRedirect: true,
    });
  });

  test("ignores unknown and non-category SEO paths", async () => {
    const unknown = createClient([[]]);
    const product = createClient([
      [
        {
          foreignKey: "product-id",
          isCanonical: true,
          routeName: "frontend.detail.page",
          seoPathInfo: "Produkt/",
        },
      ],
    ]);

    await expect(
      resolveShopwareCategoryRoute(unknown.client, "/Unbekannt/"),
    ).resolves.toBeNull();
    await expect(
      resolveShopwareCategoryRoute(product.client, "/Produkt/"),
    ).resolves.toBeNull();
  });
});
