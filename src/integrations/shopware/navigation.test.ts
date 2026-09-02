import { describe, expect, test } from "bun:test";

import {
  getShopwareCategoryChildren,
  getShopwareFooterNavigation,
} from "@/integrations/shopware/navigation";

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

describe("getShopwareCategoryChildren", () => {
  test("requests the direct children of a Shopware category", async () => {
    const requests: Array<{
      body?: unknown;
      pathParams?: unknown;
    }> = [];
    const client = {
      invoke: async (
        _operation: string,
        request: { body?: unknown; pathParams?: unknown },
      ) => {
        requests.push(request);

        return { data: undefined };
      },
    } as unknown as Parameters<typeof getShopwareCategoryChildren>[0];
    const categoryId = "0123456789abcdef0123456789abcdef";

    await expect(
      getShopwareCategoryChildren(client, categoryId),
    ).resolves.toEqual([]);
    expect(requests).toHaveLength(1);
    expect(requests[0]).toMatchObject({
      body: { depth: 0 },
      pathParams: {
        activeId: categoryId,
        rootId: categoryId,
      },
    });
  });
});
