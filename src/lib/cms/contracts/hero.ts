import {
  resolveCmsButtonSize,
  type CmsButtonSize,
} from "@/lib/cms/button-size";

export type CmsHeroImage = Readonly<{
  alt: string;
  url: string;
}>;

export type CmsHeroLink = Readonly<{
  label: string;
  size: CmsButtonSize;
  url: string;
}>;

export type CmsHeroData = Readonly<{
  description?: string;
  eyebrow?: string;
  image: CmsHeroImage;
  primaryLink?: CmsHeroLink;
  secondaryLink?: CmsHeroLink;
  title: string;
}>;

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

function parseLink(value: unknown): CmsHeroLink | undefined {
  const link = getRecord(value);
  const label = getString(link, "label");
  const url = getString(link, "url");

  if (!label || !url) {
    return undefined;
  }

  return {
    label,
    size: resolveCmsButtonSize(link?.size),
    url,
  };
}

export function parseCmsHeroData(value: unknown): CmsHeroData | null {
  const data = getRecord(value);
  const image = getRecord(data?.image);
  const title = getString(data, "title");
  const imageUrl = getString(image, "url");

  if (!title || !imageUrl) {
    return null;
  }

  return {
    description: getString(data, "description"),
    eyebrow: getString(data, "eyebrow"),
    image: {
      alt: getString(image, "alt") || "",
      url: imageUrl,
    },
    primaryLink: parseLink(data?.primaryLink),
    secondaryLink: parseLink(data?.secondaryLink),
    title,
  };
}
