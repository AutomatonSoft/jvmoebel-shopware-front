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

export type CmsSubcategoryLink = Readonly<{
  id: string;
  label: string;
  position: number;
  url: string;
}>;

export type CmsSubcategoryLinksData = Readonly<{
  links: readonly CmsSubcategoryLink[];
  title: string;
}>;

function parseLinks(
  value: unknown,
  issues: CmsContractIssue[],
): CmsSubcategoryLink[] {
  return getCmsEntries(value)
    .flatMap(([key, linkValue], index) => {
      const link = getCmsRecord(linkValue);
      const path = `links.${key}`;
      const label = addRequiredString(link, "label", `${path}.label`, issues);
      const url = addRequiredString(link, "url", `${path}.url`, issues);

      if (!label || !url) {
        return [];
      }

      return [
        {
          id: getCmsString(link, "id") || `${label}-${index}`,
          label,
          position: getCmsPosition(link, index),
          url,
        },
      ];
    })
    .sort((first, second) => first.position - second.position);
}

export function parseCmsSubcategoryLinksData(
  value: unknown,
): CmsContractResult<CmsSubcategoryLinksData> {
  const record = getCmsRecord(value);
  const issues: CmsContractIssue[] = [];
  const title = addRequiredString(record, "title", "title", issues);
  const links = parseLinks(record?.links, issues);

  if (links.length === 0) {
    issues.push({
      message: "At least one valid subcategory link is required.",
      path: "links",
    });
  }

  if (!title || links.length === 0) {
    return { data: null, issues };
  }

  return { data: { links, title }, issues };
}
