import { afterAll, describe, expect, test } from "bun:test";

import { getShopwareConfig } from "@/integrations/shopware/config";

const originalEndpoint = process.env.SHOPWARE_ENDPOINT;
const originalAccessToken = process.env.SHOPWARE_ACCESS_TOKEN;

function restoreEnvironmentVariable(
  name: "SHOPWARE_ENDPOINT" | "SHOPWARE_ACCESS_TOKEN",
  value: string | undefined,
) {
  if (value === undefined) {
    delete process.env[name];
    return;
  }

  process.env[name] = value;
}

afterAll(() => {
  restoreEnvironmentVariable("SHOPWARE_ENDPOINT", originalEndpoint);
  restoreEnvironmentVariable("SHOPWARE_ACCESS_TOKEN", originalAccessToken);
});

describe("getShopwareConfig", () => {
  test("returns a valid Store API configuration", () => {
    process.env.SHOPWARE_ENDPOINT = "https://shop.example.com/store-api";
    process.env.SHOPWARE_ACCESS_TOKEN = "  sales-channel-token  ";

    expect(getShopwareConfig()).toEqual({
      endpoint: "https://shop.example.com/store-api",
      accessToken: "sales-channel-token",
    });
  });

  test("normalizes Store API endpoints", () => {
    process.env.SHOPWARE_ACCESS_TOKEN = "sales-channel-token";
    process.env.SHOPWARE_ENDPOINT =
      "https://shop.example.com/de///?preview=true#content";

    expect(getShopwareConfig().endpoint).toBe(
      "https://shop.example.com/de/store-api",
    );

    process.env.SHOPWARE_ENDPOINT = "https://shop.example.com/store-api/";

    expect(getShopwareConfig().endpoint).toBe(
      "https://shop.example.com/store-api",
    );
  });

  test("rejects a malformed endpoint", () => {
    process.env.SHOPWARE_ENDPOINT = "not-a-url";
    process.env.SHOPWARE_ACCESS_TOKEN = "sales-channel-token";

    expect(() => getShopwareConfig()).toThrow(
      "SHOPWARE_ENDPOINT must be a valid absolute URL.",
    );
  });

  test("rejects missing environment variables", () => {
    delete process.env.SHOPWARE_ENDPOINT;
    delete process.env.SHOPWARE_ACCESS_TOKEN;

    expect(() => getShopwareConfig()).toThrow("Missing SHOPWARE_ENDPOINT.");

    process.env.SHOPWARE_ENDPOINT = "https://shop.example.com";

    expect(() => getShopwareConfig()).toThrow("Missing SHOPWARE_ACCESS_TOKEN.");
  });
});
