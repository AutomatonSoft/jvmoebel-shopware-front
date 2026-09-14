import { getCmsRecord, getCmsString } from "@/features/cms/contracts/parsing";
import {
  addRequiredString,
  getCmsEntries,
  getCmsPosition,
} from "@/features/cms/contracts/reference-shared";
import type {
  CmsContractIssue,
  CmsContractResult,
} from "@/features/cms/contracts/result";

export type CmsTableOfContentsItem = Readonly<{
  anchorId: string;
  id: string;
  label: string;
  position: number;
}>;

export type CmsTableOfContentsData = Readonly<{
  items: readonly CmsTableOfContentsItem[];
  title: string;
}>;

const htmlIdPattern = /^[A-Za-z][A-Za-z0-9_:.-]*$/;

function parseItems(
  value: unknown,
  issues: CmsContractIssue[],
): CmsTableOfContentsItem[] {
  return getCmsEntries(value)
    .flatMap(([key, itemValue], index) => {
      const item = getCmsRecord(itemValue);
      const path = `items.${key}`;
      const label = addRequiredString(item, "label", `${path}.label`, issues);
      const anchorId = addRequiredString(
        item,
        "anchorId",
        `${path}.anchorId`,
        issues,
      );
      const hasValidAnchorId = anchorId ? htmlIdPattern.test(anchorId) : false;

      if (anchorId && !hasValidAnchorId) {
        issues.push({
          message: "anchorId must be a valid HTML id.",
          path: `${path}.anchorId`,
        });
      }

      if (!label || !anchorId || !hasValidAnchorId) {
        return [];
      }

      return [
        {
          anchorId,
          id: getCmsString(item, "id") || `${anchorId}-${index}`,
          label,
          position: getCmsPosition(item, index),
        },
      ];
    })
    .sort((first, second) => first.position - second.position);
}

export function parseCmsTableOfContentsData(
  value: unknown,
): CmsContractResult<CmsTableOfContentsData> {
  const record = getCmsRecord(value);
  const issues: CmsContractIssue[] = [];
  const title = addRequiredString(record, "title", "title", issues);
  const items = parseItems(record?.items, issues);

  if (items.length === 0) {
    issues.push({
      message: "At least one valid table of contents item is required.",
      path: "items",
    });
  }

  if (!title || items.length === 0) {
    return { data: null, issues };
  }

  return {
    data: { items, title },
    issues,
  };
}
