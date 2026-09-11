import { getCmsRecord, getCmsString } from "@/features/cms/contracts/parsing";
import type {
  CmsContractIssue,
  CmsContractResult,
} from "@/features/cms/contracts/result";

export type CmsPageHeaderData = Readonly<{
  description?: string;
  eyebrow?: string;
  title: string;
}>;

export function parseCmsPageHeaderData(
  value: unknown,
): CmsContractResult<CmsPageHeaderData> {
  const data = getCmsRecord(value);
  const title = getCmsString(data, "title");
  const issues: CmsContractIssue[] = [];

  if (!title) {
    issues.push({
      message: "Page title is missing or empty.",
      path: "title",
    });

    return { data: null, issues };
  }

  return {
    data: {
      description: getCmsString(data, "description"),
      eyebrow: getCmsString(data, "eyebrow"),
      title,
    },
    issues,
  };
}
