import { describe, expect, test } from "bun:test";

import { subscribeToShopwareNewsletter } from "@/integrations/shopware/newsletter";

describe("subscribeToShopwareNewsletter", () => {
  test("uses the sales channel domain and preserves the subscription status", async () => {
    const calls: Array<{ operation: string; options: unknown }> = [];
    const client = {
      invoke: async (operation: string, options: unknown) => {
        calls.push({ operation, options });

        if (operation === "readContext get /context") {
          return {
            data: {
              salesChannel: {
                hreflangDefaultDomain: { url: "https://jvmoebel.de" },
              },
            },
          };
        }

        return {
          data: {
            status: "notSet",
            success: false,
          },
        };
      },
    } as unknown as Parameters<typeof subscribeToShopwareNewsletter>[0];

    await expect(
      subscribeToShopwareNewsletter(client, {
        email: "reader@example.com",
      }),
    ).resolves.toEqual({
      status: "notSet",
      success: false,
    });

    expect(calls[1]).toEqual({
      operation: "subscribeToNewsletter post /newsletter/subscribe",
      options: {
        body: {
          email: "reader@example.com",
          option: "subscribe",
          storefrontUrl: "https://jvmoebel.de",
        },
      },
    });
  });
});
