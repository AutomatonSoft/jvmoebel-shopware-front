import { getCmsRecord, getCmsString } from "@/features/cms/contracts/parsing";
import type { CmsSlot } from "@/features/cms/model/page";

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
