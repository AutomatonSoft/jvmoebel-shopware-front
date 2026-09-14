import { getCmsRecord, getCmsString } from "@/features/cms/contracts/parsing";
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
