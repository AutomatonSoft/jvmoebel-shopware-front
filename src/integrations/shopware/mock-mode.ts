import "server-only";

export type ShopwareDataMode = "live" | "mock";

function getBooleanEnvironmentFlag(
  name: string,
  defaultValue: boolean,
): boolean {
  const value = process.env[name]?.trim().toLowerCase();

  if (!value) {
    return defaultValue;
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  throw new Error(`${name} must be either "true" or "false".`);
}

export function getShopwareDataMode(): ShopwareDataMode {
  const useMocks = getBooleanEnvironmentFlag(
    "SHOPWARE_USE_MOCKS",
    process.env.NODE_ENV === "development",
  );

  return useMocks ? "mock" : "live";
}

export function shouldUseShopwareMocks(): boolean {
  return getShopwareDataMode() === "mock";
}
