import { getCmsRecord } from "@/features/cms/contracts/parsing";
import { addRequiredString } from "@/features/cms/contracts/reference-shared";
import type {
  CmsContractIssue,
  CmsContractResult,
} from "@/features/cms/contracts/result";

export type CmsExpertTipData = Readonly<{
  body: string;
  label: string;
  title: string;
}>;

export function parseCmsExpertTipData(
  value: unknown,
): CmsContractResult<CmsExpertTipData> {
  const record = getCmsRecord(value);
  const issues: CmsContractIssue[] = [];
  const label = addRequiredString(record, "label", "label", issues);
  const title = addRequiredString(record, "title", "title", issues);
  const body = addRequiredString(record, "body", "body", issues);

  if (!label || !title || !body) {
    return { data: null, issues };
  }

  return {
    data: { body, label, title },
    issues,
  };
}
