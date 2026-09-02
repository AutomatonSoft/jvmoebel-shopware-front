import { afterEach, describe, expect, test } from "bun:test";

import {
  getShopwareDataMode,
  shouldAllowShopwareMockWrites,
  shouldUseShopwareMocks,
} from "@/integrations/shopware/mock-mode";

const originalNodeEnv = process.env.NODE_ENV;
const originalShopwareAllowMockWrites = process.env.SHOPWARE_ALLOW_MOCK_WRITES;
const originalShopwareUseMocks = process.env.SHOPWARE_USE_MOCKS;

function setEnvironmentVariable(name: string, value: string | undefined) {
  if (value === undefined) {
    delete process.env[name];
  } else {
    process.env[name] = value;
  }
}

function setEnvironment(nodeEnv: string, shopwareUseMocks?: string) {
  setEnvironmentVariable("NODE_ENV", nodeEnv);
  setEnvironmentVariable("SHOPWARE_USE_MOCKS", shopwareUseMocks);
}

afterEach(() => {
  setEnvironmentVariable("NODE_ENV", originalNodeEnv);
  setEnvironmentVariable(
    "SHOPWARE_ALLOW_MOCK_WRITES",
    originalShopwareAllowMockWrites,
  );
  setEnvironmentVariable("SHOPWARE_USE_MOCKS", originalShopwareUseMocks);
});

describe("shouldUseShopwareMocks", () => {
  test("enables mocks by default in development", () => {
    setEnvironment("development");

    expect(shouldUseShopwareMocks()).toBe(true);
  });

  test("enables mocks when explicitly enabled in development", () => {
    setEnvironment("development", "true");

    expect(shouldUseShopwareMocks()).toBe(true);
  });

  test("disables mocks when explicitly disabled in development", () => {
    setEnvironment("development", "false");

    expect(shouldUseShopwareMocks()).toBe(false);
  });

  test("disables mocks by default in production", () => {
    setEnvironment("production");

    expect(shouldUseShopwareMocks()).toBe(false);
  });

  test("enables mocks when explicitly enabled in production", () => {
    setEnvironment("production", "true");

    expect(shouldUseShopwareMocks()).toBe(true);
  });

  test("disables mocks when explicitly disabled in production", () => {
    setEnvironment("production", "false");

    expect(shouldUseShopwareMocks()).toBe(false);
  });

  test("normalizes explicit flag casing and whitespace", () => {
    setEnvironment("production", "  TrUe  ");

    expect(shouldUseShopwareMocks()).toBe(true);
  });

  test("rejects an unsupported explicit flag", () => {
    setEnvironment("production", "yes");

    expect(() => getShopwareDataMode()).toThrow(
      'SHOPWARE_USE_MOCKS must be either "true" or "false".',
    );
  });
});

describe("shouldAllowShopwareMockWrites", () => {
  test("allows mock writes by default in development", () => {
    setEnvironment("development", "true");
    delete process.env.SHOPWARE_ALLOW_MOCK_WRITES;

    expect(shouldAllowShopwareMockWrites()).toBe(true);
  });

  test("rejects mock writes by default outside development", () => {
    setEnvironment("production", "true");
    delete process.env.SHOPWARE_ALLOW_MOCK_WRITES;

    expect(shouldAllowShopwareMockWrites()).toBe(false);
  });

  test("allows explicitly enabled mock writes", () => {
    setEnvironment("production", "true");
    process.env.SHOPWARE_ALLOW_MOCK_WRITES = "true";

    expect(shouldAllowShopwareMockWrites()).toBe(true);
  });

  test("rejects an unsupported explicit flag", () => {
    process.env.SHOPWARE_ALLOW_MOCK_WRITES = "simulate";

    expect(() => shouldAllowShopwareMockWrites()).toThrow(
      'SHOPWARE_ALLOW_MOCK_WRITES must be either "true" or "false".',
    );
  });
});
