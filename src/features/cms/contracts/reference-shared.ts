import {
  getCmsNumber,
  getCmsRecord,
  getCmsString,
} from "@/features/cms/contracts/parsing";
import type { CmsContractIssue } from "@/features/cms/contracts/result";
import {
  resolveCmsButtonSize,
  type CmsButtonSize,
} from "@/features/cms/model/button-size";

export type CmsReferenceLink = Readonly<{
  label: string;
  size: CmsButtonSize;
  url: string;
}>;

export type CmsReferenceImage = Readonly<{
  alt: string;
  url: string;
}>;

export type CmsReferenceCard = Readonly<{
  description?: string;
  id: string;
  image: CmsReferenceImage;
  position: number;
  title: string;
  url: string;
}>;

export function addRequiredString(
  record: ReturnType<typeof getCmsRecord>,
  key: string,
  path: string,
  issues: CmsContractIssue[],
): string | undefined {
  const value = getCmsString(record, key);

  if (!value) {
    issues.push({
      message: `${key} must be a non-empty string.`,
      path,
    });
  }

  return value;
}

export function parseReferenceLink(
  value: unknown,
  path: string,
  issues: CmsContractIssue[],
): CmsReferenceLink | undefined {
  const link = getCmsRecord(value);
  const label = getCmsString(link, "label");
  const url = getCmsString(link, "url");

  if (!label || !url) {
    issues.push({
      message: "Link requires a non-empty label and URL.",
      path,
    });
    return undefined;
  }

  return {
    label,
    size: resolveCmsButtonSize(link?.size),
    url,
  };
}

export function getCmsEntries(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item, index) => [String(index), item] as const);
  }

  const record = getCmsRecord(value);

  return record ? Object.entries(record) : [];
}

export function getCmsPosition(
  record: ReturnType<typeof getCmsRecord>,
  fallback: number,
) {
  return getCmsNumber(record, "position") ?? fallback;
}

export function parseReferenceImage(
  value: unknown,
  path: string,
  fallbackAlt: string,
  issues: CmsContractIssue[],
): CmsReferenceImage | undefined {
  const image = getCmsRecord(value);
  const url = getCmsString(image, "url");

  if (!url) {
    issues.push({
      message: "Image requires a non-empty URL.",
      path: `${path}.url`,
    });
    return undefined;
  }

  return {
    alt: getCmsString(image, "alt") || fallbackAlt,
    url,
  };
}

export function parseReferenceCards(
  value: unknown,
  path: string,
  issues: CmsContractIssue[],
): CmsReferenceCard[] {
  return getCmsEntries(value)
    .flatMap(([key, itemValue], index) => {
      const item = getCmsRecord(itemValue);
      const itemPath = `${path}.${key}`;
      const title = addRequiredString(
        item,
        "title",
        `${itemPath}.title`,
        issues,
      );
      const url = addRequiredString(item, "url", `${itemPath}.url`, issues);
      const image = parseReferenceImage(
        item?.image,
        `${itemPath}.image`,
        title || "",
        issues,
      );

      if (!title || !url || !image) {
        return [];
      }

      return [
        {
          description: getCmsString(item, "description"),
          id: getCmsString(item, "id") || `${title}-${index}`,
          image,
          position: getCmsPosition(item, index),
          title,
          url,
        },
      ];
    })
    .sort((first, second) => first.position - second.position);
}
