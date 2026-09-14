import { getCmsRecord, getCmsString } from "@/features/cms/contracts/parsing";
import {
  addRequiredNumber,
  addRequiredString,
  parseReferenceImage,
  type CmsReferenceImage,
} from "@/features/cms/contracts/reference-shared";
import type {
  CmsContractIssue,
  CmsContractResult,
} from "@/features/cms/contracts/result";

export type CmsArticleHeroData = Readonly<{
  description?: string;
  eyebrow?: string;
  image: CmsReferenceImage;
  publishedAt: string;
  readTimeMinutes: number;
  title: string;
}>;

export function parseCmsArticleHeroData(
  value: unknown,
): CmsContractResult<CmsArticleHeroData> {
  const record = getCmsRecord(value);
  const issues: CmsContractIssue[] = [];
  const title = addRequiredString(record, "title", "title", issues);
  const publishedAt = addRequiredString(
    record,
    "publishedAt",
    "publishedAt",
    issues,
  );
  const readTimeMinutes = addRequiredNumber(
    record,
    "readTimeMinutes",
    "readTimeMinutes",
    issues,
  );
  const image = parseReferenceImage(
    record?.image,
    "image",
    title || "",
    issues,
  );
  const hasValidPublishedAt = publishedAt
    ? Number.isFinite(Date.parse(publishedAt))
    : false;
  const hasValidReadTime =
    readTimeMinutes !== undefined &&
    Number.isInteger(readTimeMinutes) &&
    readTimeMinutes > 0;

  if (publishedAt && !hasValidPublishedAt) {
    issues.push({
      message: "publishedAt must be a valid date-time string.",
      path: "publishedAt",
    });
  }

  if (readTimeMinutes !== undefined && !hasValidReadTime) {
    issues.push({
      message: "readTimeMinutes must be a positive integer.",
      path: "readTimeMinutes",
    });
  }

  if (
    !title ||
    !publishedAt ||
    !hasValidPublishedAt ||
    !hasValidReadTime ||
    !image
  ) {
    return { data: null, issues };
  }

  return {
    data: {
      description: getCmsString(record, "description"),
      eyebrow: getCmsString(record, "eyebrow"),
      image,
      publishedAt,
      readTimeMinutes,
      title,
    },
    issues,
  };
}
