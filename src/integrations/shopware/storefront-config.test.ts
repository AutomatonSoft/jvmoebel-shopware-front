import { describe, expect, test } from "bun:test";

import { getShopwareStorefrontConfig } from "@/integrations/shopware/storefront-config";

describe("getShopwareStorefrontConfig", () => {
  test("requests and maps the custom Store API configuration", async () => {
    const requests: Array<{ operation: string; options: unknown }> = [];
    const client = {
      invoke: async (operation: string, options: unknown) => {
        requests.push({ operation, options });

        return { data: null };
      },
    } as unknown as Parameters<typeof getShopwareStorefrontConfig>[0];

    const result = await getShopwareStorefrontConfig(client);

    expect(requests).toEqual([
      {
        operation: "readStorefrontConfig get /storefront-config",
        options: { fetchOptions: { cache: "no-store" } },
      },
    ]);
    expect(result.issues).toContainEqual({
      message: "Storefront configuration must be an object.",
      path: "storefrontConfig",
    });
  });
});
