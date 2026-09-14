import { getCmsRecord } from "@/features/cms/contracts/parsing";
import {
  addRequiredNumber,
  addRequiredString,
  parseReferenceLink,
  type CmsReferenceLink,
} from "@/features/cms/contracts/reference-shared";
import type {
  CmsContractIssue,
  CmsContractResult,
} from "@/features/cms/contracts/result";

export type CmsTrustRatingData = Readonly<{
  link: CmsReferenceLink;
  providerLabel: string;
  rating: number;
  reviewCount: number;
}>;

export function parseCmsTrustRatingData(
  value: unknown,
): CmsContractResult<CmsTrustRatingData> {
  const record = getCmsRecord(value);
  const issues: CmsContractIssue[] = [];
  const rating = addRequiredNumber(record, "rating", "rating", issues);
  const reviewCount = addRequiredNumber(
    record,
    "reviewCount",
    "reviewCount",
    issues,
  );
  const providerLabel = addRequiredString(
    record,
    "providerLabel",
    "providerLabel",
    issues,
  );
  const link = parseReferenceLink(record?.link, "link", issues);
  const hasValidRating = rating !== undefined && rating >= 0 && rating <= 5;
  const hasValidReviewCount =
    reviewCount !== undefined &&
    Number.isInteger(reviewCount) &&
    reviewCount >= 0;

  if (rating !== undefined && !hasValidRating) {
    issues.push({
      message: "rating must be between 0 and 5.",
      path: "rating",
    });
  }

  if (reviewCount !== undefined && !hasValidReviewCount) {
    issues.push({
      message: "reviewCount must be a non-negative integer.",
      path: "reviewCount",
    });
  }

  if (!hasValidRating || !hasValidReviewCount || !providerLabel || !link) {
    return { data: null, issues };
  }

  return {
    data: { link, providerLabel, rating, reviewCount },
    issues,
  };
}
