import { describe, expect, test } from "bun:test";

import { getShopwareFooterNavigation } from "@/integrations/shopware/navigation";

describe("getShopwareFooterNavigation", () => {
  test("returns an empty navigation when Shopware responds without content", async () => {
    const client = {
      invoke: async () => ({
        data: undefined,
      }),
    } as unknown as Parameters<typeof getShopwareFooterNavigation>[0];

    await expect(getShopwareFooterNavigation(client)).resolves.toEqual([]);
  });
});
