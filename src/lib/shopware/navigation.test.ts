import { describe, expect, test } from "bun:test";

import type { ShopwareClient } from "@/lib/shopware/client";
import { getFooterNavigation } from "@/lib/shopware/navigation";

describe("Shopware navigation", () => {
  test("maps a category without a children array as a leaf item", async () => {
    const client = {
      invoke: async () => ({
        data: [
          {
            children: undefined,
            id: "footer-category",
            name: "Information",
            translated: {
              name: "Information",
            },
          },
        ],
      }),
    } as unknown as ShopwareClient;

    const navigation = await getFooterNavigation(client);

    expect(navigation).toEqual([
      {
        children: [],
        href: "/navigation/footer-category",
        id: "footer-category",
        label: "Information",
      },
    ]);
  });

  test("returns an empty navigation when Shopware responds without content", async () => {
    const client = {
      invoke: async () => ({
        data: undefined,
      }),
    } as unknown as ShopwareClient;

    const navigation = await getFooterNavigation(client);

    expect(navigation).toEqual([]);
  });
});
