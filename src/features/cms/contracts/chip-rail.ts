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

export type CmsChipRailItem = Readonly<{
  id: string;
  label: string;
  position: number;
  url: string;
}>;

export type CmsChipRailData = Readonly<{
  chips: readonly CmsChipRailItem[];
  eyebrow?: string;
  title: string;
}>;

function parseChips(
  value: unknown,
  issues: CmsContractIssue[],
): CmsChipRailItem[] {
  return getCmsEntries(value)
    .flatMap(([key, itemValue], index) => {
      const item = getCmsRecord(itemValue);
      const path = `chips.${key}`;
      const label = addRequiredString(item, "label", `${path}.label`, issues);
      const url = addRequiredString(item, "url", `${path}.url`, issues);

      if (!label || !url) {
        return [];
      }

      return [
        {
          id: getCmsString(item, "id") || `${label}-${index}`,
          label,
          position: getCmsPosition(item, index),
          url,
        },
      ];
    })
    .sort((first, second) => first.position - second.position);
}

export function parseCmsChipRailData(
  value: unknown,
): CmsContractResult<CmsChipRailData> {
  const record = getCmsRecord(value);
  const issues: CmsContractIssue[] = [];
  const title = addRequiredString(record, "title", "title", issues);
  const chips = parseChips(record?.chips, issues);

  if (chips.length === 0) {
    issues.push({
      message: "At least one valid chip is required.",
      path: "chips",
    });
  }

  if (!title || chips.length === 0) {
    return { data: null, issues };
  }

  return {
    data: {
      chips,
      eyebrow: getCmsString(record, "eyebrow"),
      title,
    },
    issues,
  };
}
