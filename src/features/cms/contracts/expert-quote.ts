import { getCmsRecord } from "@/features/cms/contracts/parsing";
import { addRequiredString } from "@/features/cms/contracts/reference-shared";
import type {
  CmsContractIssue,
  CmsContractResult,
} from "@/features/cms/contracts/result";

export type CmsExpertQuoteData = Readonly<{
  authorName: string;
  authorRole: string;
  quote: string;
}>;

export function parseCmsExpertQuoteData(
  value: unknown,
): CmsContractResult<CmsExpertQuoteData> {
  const record = getCmsRecord(value);
  const issues: CmsContractIssue[] = [];
  const quote = addRequiredString(record, "quote", "quote", issues);
  const authorName = addRequiredString(
    record,
    "authorName",
    "authorName",
    issues,
  );
  const authorRole = addRequiredString(
    record,
    "authorRole",
    "authorRole",
    issues,
  );

  if (!quote || !authorName || !authorRole) {
    return { data: null, issues };
  }

  return {
    data: { authorName, authorRole, quote },
    issues,
  };
}
