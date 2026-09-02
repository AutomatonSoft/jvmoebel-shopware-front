import { afterEach, describe, expect, test } from "bun:test";

import {
  getShopwareDataMode,
  shouldUseShopwareMocks,
} from "@/integrations/shopware/mock-mode";

const originalNodeEnv = process.env.NODE_ENV;
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

  test("rejects mocks when explicitly enabled in production", () => {
    setEnvironment("production", "true");

    expect(() => shouldUseShopwareMocks()).toThrow(
      "SHOPWARE_USE_MOCKS=true is not allowed when NODE_ENV=production.",
    );
  });

  test("disables mocks when explicitly disabled in production", () => {
    setEnvironment("production", "false");

    expect(shouldUseShopwareMocks()).toBe(false);
  });

  test("normalizes explicit flag casing and whitespace", () => {
    setEnvironment("development", "  TrUe  ");

    expect(shouldUseShopwareMocks()).toBe(true);
  });

  test("rejects an unsupported explicit flag", () => {
    setEnvironment("production", "yes");

    expect(() => getShopwareDataMode()).toThrow(
      'SHOPWARE_USE_MOCKS must be either "true" or "false".',
    );
  });
});
