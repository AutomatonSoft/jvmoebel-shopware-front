import "server-only";

export type ShopwareDataMode = "live" | "mock";

export function getShopwareDataMode(): ShopwareDataMode {
  const value = process.env.SHOPWARE_USE_MOCKS?.trim().toLowerCase();

  if (!value) {
    return process.env.NODE_ENV === "development" ? "mock" : "live";
  }

  if (value === "true") {
    return "mock";
  }

  if (value === "false") {
    return "live";
  }

  throw new Error('SHOPWARE_USE_MOCKS must be either "true" or "false".');
}

export function shouldUseShopwareMocks(): boolean {
  return getShopwareDataMode() === "mock";
}
