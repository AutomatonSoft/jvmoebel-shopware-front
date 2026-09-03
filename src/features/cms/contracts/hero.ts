import {
  resolveCmsButtonSize,
  type CmsButtonSize,
} from "@/features/cms/model/button-size";
import { getCmsRecord, getCmsString } from "@/features/cms/contracts/parsing";
import type {
  CmsContractIssue,
  CmsContractResult,
} from "@/features/cms/contracts/result";

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

function parseLink(
  value: unknown,
  path: string,
): Readonly<{
  data?: CmsHeroLink;
  issues: readonly CmsContractIssue[];
}> {
  if (value === undefined || value === null) {
    return { issues: [] };
  }

  const link = getCmsRecord(value);
  const label = getCmsString(link, "label");
  const url = getCmsString(link, "url");
  const issues: CmsContractIssue[] = [];

  if (!label) {
    issues.push({
      message: "Link label is missing or empty.",
      path: `${path}.label`,
    });
  }

  if (!url) {
    issues.push({
      message: "Link URL is missing or empty.",
      path: `${path}.url`,
    });
  }

  if (!label || !url) {
    return { issues };
  }

  return {
    data: {
      label,
      size: resolveCmsButtonSize(link?.size),
      url,
    },
    issues,
  };
}

export function parseCmsHeroData(
  value: unknown,
): CmsContractResult<CmsHeroData> {
  const data = getCmsRecord(value);
  const image = getCmsRecord(data?.image);
  const title = getCmsString(data, "title");
  const imageUrl = getCmsString(image, "url");
  const primaryLink = parseLink(data?.primaryLink, "primaryLink");
  const secondaryLink = parseLink(data?.secondaryLink, "secondaryLink");
  const issues: CmsContractIssue[] = [
    ...primaryLink.issues,
    ...secondaryLink.issues,
  ];

  if (!title) {
    issues.push({
      message: "Hero title is missing or empty.",
      path: "title",
    });
  }

  if (!imageUrl) {
    issues.push({
      message: "Hero image URL is missing or empty.",
      path: "image.url",
    });
  }

  if (!title || !imageUrl) {
    return { data: null, issues };
  }

  return {
    data: {
      description: getCmsString(data, "description"),
      eyebrow: getCmsString(data, "eyebrow"),
      image: {
        alt: getCmsString(image, "alt") || "",
        url: imageUrl,
      },
      primaryLink: primaryLink.data,
      secondaryLink: secondaryLink.data,
      title,
    },
    issues,
  };
}
