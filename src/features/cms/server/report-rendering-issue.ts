import "server-only";

import type { CmsContractIssue } from "@/features/cms/contracts/result";
import type { CmsSlot } from "@/features/cms/model/page";

export type CmsRenderingIssue = Readonly<{
  cause?: string;
  code: "invalid-element-data" | "rendering-failed" | "unsupported-element";
  issues?: readonly CmsContractIssue[];
  message: string;
  slot: Pick<CmsSlot, "id" | "slot" | "type">;
}>;

export function reportCmsRenderingIssue(issue: CmsRenderingIssue): void {
  console.error("CMS rendering issue.", {
    ...(issue.cause ? { cause: issue.cause } : {}),
    code: issue.code,
    ...(issue.issues?.length ? { issues: issue.issues } : {}),
    message: issue.message,
    slot: {
      id: issue.slot.id,
      name: issue.slot.slot,
      type: issue.slot.type,
    },
  });
}

export function reportCmsContractIssues(
  slot: CmsRenderingIssue["slot"],
  issues: readonly CmsContractIssue[],
): void {
  if (issues.length === 0) {
    return;
  }

  reportCmsRenderingIssue({
    code: "invalid-element-data",
    issues,
    message: "CMS element data does not match its rendering contract.",
    slot,
  });
}
