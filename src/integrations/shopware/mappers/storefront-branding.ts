import {
  defaultStorefrontBranding,
  type StorefrontBrandingIssue,
  type StorefrontBrandingResult,
} from "@/features/storefront-shell/model/branding";

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
): StorefrontBrandingResult {
  const issues: StorefrontBrandingIssue[] = [];
  const root = getRecord(configuration);
  const brandingValue = root?.jvStorefrontBranding;
  const branding = getRecord(brandingValue);
  const logoSource = branding?.logo;
  const logoValue = getRecord(logoSource);

  if (configuration !== undefined && configuration !== null && !root) {
    issues.push({
      message: "Sales channel configuration must be an object.",
      path: "configuration",
    });
  }

  if (brandingValue !== undefined && brandingValue !== null && !branding) {
    issues.push({
      message: "Storefront branding configuration must be an object.",
      path: "jvStorefrontBranding",
    });
  }

  if (branding && "name" in branding && !getString(branding, "name")) {
    issues.push({
      message: "Configured storefront name must be a non-empty string.",
      path: "jvStorefrontBranding.name",
    });
  }

  if (logoSource !== undefined && logoSource !== null && !logoValue) {
    issues.push({
      message: "Configured storefront logo must be an object.",
      path: "jvStorefrontBranding.logo",
    });
  }

  const name =
    getString(branding, "name") ||
    (typeof fallbackName === "string" && fallbackName.trim()
      ? fallbackName
      : defaultStorefrontBranding.name);
  const logoUrl = getImageUrl(logoValue, "url");
  const logoWidth = getPositiveNumber(logoValue, "width");
  const logoHeight = getPositiveNumber(logoValue, "height");

  if (logoValue) {
    if (!logoUrl) {
      issues.push({
        message:
          "Configured logo URL must be root-relative or use HTTP or HTTPS.",
        path: "jvStorefrontBranding.logo.url",
      });
    }

    if (!logoWidth) {
      issues.push({
        message: "Configured logo width must be a positive finite number.",
        path: "jvStorefrontBranding.logo.width",
      });
    }

    if (!logoHeight) {
      issues.push({
        message: "Configured logo height must be a positive finite number.",
        path: "jvStorefrontBranding.logo.height",
      });
    }
  }

  return {
    data: {
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
    },
    issues,
  };
}
