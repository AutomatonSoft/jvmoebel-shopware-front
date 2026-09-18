import { getCmsRecord, getCmsString } from "@/features/cms/contracts/parsing";
import type {
  CmsContractIssue,
  CmsContractResult,
} from "@/features/cms/contracts/result";
import { sanitizeCmsHtml } from "@/features/cms/lib/sanitize-html";
import type { CmsSlot } from "@/features/cms/model/page";

export type CmsTextData = Readonly<{
  html: string;
}>;

export function getCmsTextContent(
  slot: Pick<CmsSlot, "config" | "data">,
): string | null {
  const resolvedContent = getCmsString(getCmsRecord(slot.data), "content");

  if (resolvedContent) {
    return resolvedContent;
  }

  const config = getCmsRecord(slot.config);
  const contentConfig = getCmsRecord(config?.content);

  return contentConfig?.source === "static"
    ? (getCmsString(contentConfig, "value") ?? null)
    : null;
}

export function parseCmsTextData(
  slot: Pick<CmsSlot, "config" | "data">,
): CmsContractResult<CmsTextData> {
  const content = getCmsTextContent(slot);
  const issues: CmsContractIssue[] = [];

  if (!content) {
    issues.push({
      message: "Resolved or static text content is missing or empty.",
      path: "content",
    });

    return { data: null, issues };
  }

  const html = sanitizeCmsHtml(content);

  if (!html.trim()) {
    issues.push({
      message: "Text content is empty after sanitization.",
      path: "content",
    });

    return { data: null, issues };
  }

  return { data: { html }, issues };
}
