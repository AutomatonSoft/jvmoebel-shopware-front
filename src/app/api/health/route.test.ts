import { afterEach, describe, expect, spyOn, test } from "bun:test";

import { GET } from "@/app/api/health/route";

const originalShopwareEndpoint = process.env.SHOPWARE_ENDPOINT;
const originalShopwareAccessToken = process.env.SHOPWARE_ACCESS_TOKEN;
const originalNodeEnv = process.env.NODE_ENV;
const originalShopwareUseMocks = process.env.SHOPWARE_USE_MOCKS;

function setEnvironmentVariable(name: string, value: string | undefined) {
  if (value === undefined) {
    delete process.env[name];
  } else {
    process.env[name] = value;
  }
}

afterEach(() => {
  setEnvironmentVariable("NODE_ENV", originalNodeEnv);
  setEnvironmentVariable("SHOPWARE_ENDPOINT", originalShopwareEndpoint);
  setEnvironmentVariable("SHOPWARE_ACCESS_TOKEN", originalShopwareAccessToken);
  setEnvironmentVariable("SHOPWARE_USE_MOCKS", originalShopwareUseMocks);
});

describe("GET /api/health", () => {
  test("accepts mock mode without Shopware credentials", async () => {
    setEnvironmentVariable("NODE_ENV", "development");
    process.env.SHOPWARE_USE_MOCKS = "true";
    delete process.env.SHOPWARE_ENDPOINT;
    delete process.env.SHOPWARE_ACCESS_TOKEN;

    const response = GET();

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      shopwareMode: "mock",
      status: "ok",
    });
  });

  test("accepts live mode with valid Shopware credentials", async () => {
    process.env.SHOPWARE_USE_MOCKS = "false";
    process.env.SHOPWARE_ENDPOINT = "https://shop.example.com/store-api";
    process.env.SHOPWARE_ACCESS_TOKEN = "sales-channel-token";

    const response = GET();

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      shopwareMode: "live",
      status: "ok",
    });
  });

  test("accepts explicitly enabled mock mode with production Node runtime", async () => {
    setEnvironmentVariable("NODE_ENV", "production");
    process.env.SHOPWARE_USE_MOCKS = "true";
    delete process.env.SHOPWARE_ENDPOINT;
    delete process.env.SHOPWARE_ACCESS_TOKEN;

    const response = GET();

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      shopwareMode: "mock",
      status: "ok",
    });
  });

  test("rejects live mode without Shopware credentials", async () => {
    process.env.SHOPWARE_USE_MOCKS = "false";
    delete process.env.SHOPWARE_ENDPOINT;
    delete process.env.SHOPWARE_ACCESS_TOKEN;
    const consoleError = spyOn(console, "error").mockImplementation(() => {});

    try {
      const response = GET();

      expect(response.status).toBe(503);
      expect(await response.json()).toEqual({ status: "error" });
      expect(consoleError).toHaveBeenCalledTimes(1);
    } finally {
      consoleError.mockRestore();
    }
  });
});
