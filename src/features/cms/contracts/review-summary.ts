import { getCmsRecord } from "@/features/cms/contracts/parsing";
import {
  addRequiredNumber,
  addRequiredString,
} from "@/features/cms/contracts/reference-shared";
import type {
  CmsContractIssue,
  CmsContractResult,
} from "@/features/cms/contracts/result";

export type CmsReviewSummaryData = Readonly<{
  rating: number;
  sourceLabel: string;
  summary: string;
}>;

export function parseCmsReviewSummaryData(
  value: unknown,
): CmsContractResult<CmsReviewSummaryData> {
  const record = getCmsRecord(value);
  const issues: CmsContractIssue[] = [];
  const summary = addRequiredString(record, "summary", "summary", issues);
  const sourceLabel = addRequiredString(
    record,
    "sourceLabel",
    "sourceLabel",
    issues,
  );
  const rating = addRequiredNumber(record, "rating", "rating", issues);
  const hasValidRating = rating !== undefined && rating >= 0 && rating <= 5;

  if (rating !== undefined && !hasValidRating) {
    issues.push({
      message: "rating must be between 0 and 5.",
      path: "rating",
    });
  }

  if (!summary || !sourceLabel || !hasValidRating) {
    return { data: null, issues };
  }

  return { data: { rating, sourceLabel, summary }, issues };
}
