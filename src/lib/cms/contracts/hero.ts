import {
  resolveCmsButtonSize,
  type CmsButtonSize,
} from "@/lib/cms/button-size";
import { getCmsRecord, getCmsString } from "@/lib/cms/contracts/parsing";

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

function parseLink(value: unknown): CmsHeroLink | undefined {
  const link = getCmsRecord(value);
  const label = getCmsString(link, "label");
  const url = getCmsString(link, "url");

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
  const data = getCmsRecord(value);
  const image = getCmsRecord(data?.image);
  const title = getCmsString(data, "title");
  const imageUrl = getCmsString(image, "url");

  if (!title || !imageUrl) {
    return null;
  }

  return {
    description: getCmsString(data, "description"),
    eyebrow: getCmsString(data, "eyebrow"),
    image: {
      alt: getCmsString(image, "alt") || "",
      url: imageUrl,
    },
    primaryLink: parseLink(data?.primaryLink),
    secondaryLink: parseLink(data?.secondaryLink),
    title,
  };
}
