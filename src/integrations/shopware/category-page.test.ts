import { describe, expect, test } from "bun:test";

import { getShopwareCategoryPageContent } from "@/integrations/shopware/category-page";
import type { ShopwareClient } from "@/integrations/shopware/client";

describe("getShopwareCategoryPageContent", () => {
  test("loads stable content for the selected category", async () => {
    const requests: Array<{ operation: string; request: unknown }> = [];
    const client = {
      invoke: async (operation: string, request: unknown) => {
        requests.push({ operation, request });

        if (operation === "readCategory post /category/{navigationId}") {
          return {
            data: {
              cmsPage: {
                id: "category-cms-page-id",
                sections: [],
                type: "product_list",
              },
              description: "Möbel &amp; Wohnen",
              id: "category-id",
              name: "Möbel & Wohnen",
              path: "|root-category-id|parent-category-id|",
              seoUrl: "/Moebel-Wohnen/",
              translated: {
                description: "Möbel &amp; Wohnen",
                name: "Möbel & Wohnen",
              },
              type: "page",
            },
          };
        }

        if (
          operation === "readNavigation post /navigation/{activeId}/{rootId}"
        ) {
          return { data: [] };
        }

        throw new Error(`Unexpected operation: ${operation}`);
      },
    } as unknown as ShopwareClient;

    const page = await getShopwareCategoryPageContent(client, "category-id", [
      {
        children: [],
        href: "/Wohnen/",
        id: "parent-category-id",
        label: "Wohnen",
        type: "page",
      },
    ]);

    expect(page).toMatchObject({
      breadcrumbs: [
        {
          href: "/Wohnen/",
          id: "parent-category-id",
          label: "Wohnen",
        },
      ],
      category: {
        canonicalPath: "/Moebel-Wohnen/",
        description: "Möbel & Wohnen",
        id: "category-id",
        name: "Möbel & Wohnen",
      },
      children: [],
      cmsPage: {
        id: "category-cms-page-id",
        sections: [],
        type: "product_list",
      },
      hasProductListing: true,
    });
    expect(requests.map(({ operation }) => operation)).toEqual([
      "readCategory post /category/{navigationId}",
      "readNavigation post /navigation/{activeId}/{rootId}",
    ]);
  });
});
