import { describe, expect, test } from "bun:test";

import { subscribeToShopwareNewsletter } from "@/integrations/shopware/newsletter";

describe("subscribeToShopwareNewsletter", () => {
  test("preserves the Shopware subscription status", async () => {
    const client = {
      invoke: async () => ({
        data: {
          status: "notSet",
          success: false,
        },
      }),
    } as unknown as Parameters<typeof subscribeToShopwareNewsletter>[0];

    await expect(
      subscribeToShopwareNewsletter(client, {
        email: "reader@example.com",
        storefrontUrl: "https://jvmoebel.de",
      }),
    ).resolves.toEqual({
      status: "notSet",
      success: false,
    });
  });
});
