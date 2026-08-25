import "server-only";

import type { ShopwareClient } from "@/lib/shopware/client";
import { getShopwareContext } from "@/lib/shopware/context";
import { shouldUseShopwareMocks } from "@/lib/shopware/mocks/config";

export type StorefrontLogo = Readonly<{
  alt: string;
  height: number;
  url: string;
  width: number;
}>;

export type StorefrontBranding = Readonly<{
  logo?: StorefrontLogo;
  name: string;
}>;

export const defaultStorefrontBranding: StorefrontBranding = {
  name: "JVMöbel",
};

function getRecord(value: unknown): Record<string, unknown> | undefined {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return undefined;
  }

  return value as Record<string, unknown>;
}

function getString(record: Record<string, unknown> | undefined, key: string) {
  const value = record?.[key];

  return typeof value === "string" && value.trim() ? value : undefined;
}

function getPositiveNumber(
  record: Record<string, unknown> | undefined,
  key: string,
) {
  const value = record?.[key];

  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? value
    : undefined;
}

function getImageUrl(record: Record<string, unknown> | undefined, key: string) {
  const value = getString(record, key);

  if (!value) {
    return undefined;
  }

  if (value.startsWith("/") && !value.startsWith("//")) {
    return value;
  }

  try {
    const url = new URL(value);

    return url.protocol === "http:" || url.protocol === "https:"
      ? value
      : undefined;
  } catch {
    return undefined;
  }
}

export function parseStorefrontBranding(
  configuration: unknown,
  fallbackName: unknown = defaultStorefrontBranding.name,
): StorefrontBranding {
  const root = getRecord(configuration);
  const branding = getRecord(root?.jvStorefrontBranding);
  const logoValue = getRecord(branding?.logo);
  const name =
    getString(branding, "name") ||
    (typeof fallbackName === "string" && fallbackName.trim()
      ? fallbackName
      : defaultStorefrontBranding.name);
  const logoUrl = getImageUrl(logoValue, "url");
  const logoWidth = getPositiveNumber(logoValue, "width");
  const logoHeight = getPositiveNumber(logoValue, "height");

  return {
    logo:
      logoUrl && logoWidth && logoHeight
        ? {
            alt: getString(logoValue, "alt") || name,
            height: logoHeight,
            url: logoUrl,
            width: logoWidth,
          }
        : undefined,
    name,
  };
}

export async function getStorefrontBranding(
  client: ShopwareClient,
): Promise<StorefrontBranding> {
  if (shouldUseShopwareMocks()) {
    return defaultStorefrontBranding;
  }

  const context = await getShopwareContext(client);

  return parseStorefrontBranding(
    context.salesChannel.configuration,
    context.salesChannel.name,
  );
}
