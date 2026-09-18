import { describe, expect, test } from "bun:test";

import type { ShopwareClient } from "@/integrations/shopware/client";
import { getShopwareLandingPage } from "@/integrations/shopware/landing-page";

describe("getShopwareLandingPage", () => {
  test("loads a landing page through the dedicated Store API route", async () => {
    const requests: Array<{ operation: string; request: unknown }> = [];
    const client = {
      invoke: async (operation: string, request: unknown) => {
        requests.push({ operation, request });

        return {
          data: {
            active: true,
            cmsPage: {
              id: "cms-page-id",
              sections: [],
              type: "landingpage",
            },
            id: "landing-page-id",
            name: "Über uns",
            translated: {
              metaDescription: "Über JVMoebel",
              metaTitle: "Über uns",
              name: "Über uns",
            },
          },
        };
      },
    } as unknown as ShopwareClient;

    await expect(
      getShopwareLandingPage(client, "landing-page-id"),
    ).resolves.toMatchObject({
      id: "landing-page-id",
      name: "Über uns",
    });
    expect(requests).toEqual([
      {
        operation: "readLandingPage post /landing-page/{landingPageId}",
        request: {
          body: {},
          fetchOptions: { cache: "no-store" },
          pathParams: { landingPageId: "landing-page-id" },
        },
      },
    ]);
  });
});
