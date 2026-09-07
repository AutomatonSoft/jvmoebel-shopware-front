import "server-only";

export type ShopwareConfig = Readonly<{
  endpoint: string;
  accessToken: string;
}>;

function getRequiredEnvironmentVariable(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(
      `Missing ${name}. Copy .env.example to .env.local and provide the Shopware Store API value.`,
    );
  }

  return value;
}

function normalizeStoreApiEndpoint(value: string): string {
  let endpoint: URL;

  try {
    endpoint = new URL(value);
  } catch {
    throw new Error("SHOPWARE_ENDPOINT must be a valid absolute URL.");
  }

  if (endpoint.protocol !== "http:" && endpoint.protocol !== "https:") {
    throw new Error("SHOPWARE_ENDPOINT must use HTTP or HTTPS.");
  }

  const pathname = endpoint.pathname.replace(/\/+$/, "");

  endpoint.pathname = pathname.endsWith("/store-api")
    ? pathname
    : `${pathname}/store-api`;
  endpoint.search = "";
  endpoint.hash = "";

  return endpoint.toString().replace(/\/$/, "");
}

export function getShopwareConfig(): ShopwareConfig {
  return {
    endpoint: normalizeStoreApiEndpoint(
      getRequiredEnvironmentVariable("SHOPWARE_ENDPOINT"),
    ),
    accessToken: getRequiredEnvironmentVariable("SHOPWARE_ACCESS_TOKEN"),
  };
}
