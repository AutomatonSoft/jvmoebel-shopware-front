import "server-only";

import type { CmsSlot } from "@/features/cms/model/page";

export type CmsRenderingIssue = Readonly<{
  code: "unsupported-element";
  message: string;
  slot: Pick<CmsSlot, "id" | "slot" | "type">;
}>;

export function reportCmsRenderingIssue(issue: CmsRenderingIssue): void {
  console.error("CMS rendering issue.", {
    code: issue.code,
    message: issue.message,
    slot: {
      id: issue.slot.id,
      name: issue.slot.slot,
      type: issue.slot.type,
    },
  });
}
