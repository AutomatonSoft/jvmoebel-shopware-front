import { getCmsRecord, getCmsString } from "@/features/cms/contracts/parsing";
import type {
  CmsContractIssue,
  CmsContractResult,
} from "@/features/cms/contracts/result";
import {
  resolveCmsButtonSize,
  type CmsButtonSize,
} from "@/features/cms/model/button-size";

export type CmsPromoBannerData = Readonly<{
  contentPosition: "left" | "right";
  description?: string;
  eyebrow?: string;
  image: Readonly<{ alt: string; url: string }>;
  link?: Readonly<{ label: string; size: CmsButtonSize; url: string }>;
  title: string;
}>;

function parseLink(
  value: unknown,
): Readonly<{ data?: CmsPromoBannerData["link"]; issues: CmsContractIssue[] }> {
  if (value === undefined || value === null) {
    return { issues: [] };
  }

  const link = getCmsRecord(value);
  const label = getCmsString(link, "label");
  const url = getCmsString(link, "url");

  if (!label || !url) {
    return {
      issues: [
        {
          message: "Promo link requires a non-empty label and URL.",
          path: "link",
        },
      ],
    };
  }

  return {
    data: { label, size: resolveCmsButtonSize(link?.size), url },
    issues: [],
  };
}

export function parseCmsPromoBannerData(
  value: unknown,
): CmsContractResult<CmsPromoBannerData> {
  const data = getCmsRecord(value);
  const image = getCmsRecord(data?.image);
  const imageUrl = getCmsString(image, "url");
  const link = parseLink(data?.link);
  const title = getCmsString(data, "title");
  const issues = [...link.issues];

  if (!imageUrl) {
    issues.push({
      message: "Promo image URL is missing or empty.",
      path: "image.url",
    });
  }

  if (!title) {
    issues.push({
      message: "Promo title is missing or empty.",
      path: "title",
    });
  }

  if (!imageUrl || !title) {
    return { data: null, issues };
  }

  return {
    data: {
      contentPosition: data?.contentPosition === "left" ? "left" : "right",
      description: getCmsString(data, "description"),
      eyebrow: getCmsString(data, "eyebrow"),
      image: {
        alt: getCmsString(image, "alt") || title,
        url: imageUrl,
      },
      link: link.data,
      title,
    },
    issues,
  };
}
