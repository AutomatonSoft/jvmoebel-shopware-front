import { describe, expect, test } from "bun:test";

import { getShopwareCategoryChildren } from "@/integrations/shopware/navigation";

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
