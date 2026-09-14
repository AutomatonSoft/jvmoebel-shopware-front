import { getCmsRecord, getCmsString } from "@/features/cms/contracts/parsing";
import {
  addRequiredString,
  getCmsEntries,
  getCmsPosition,
  parseReferenceImage,
  parseReferenceLink,
  type CmsReferenceImage,
  type CmsReferenceLink,
} from "@/features/cms/contracts/reference-shared";
import type {
  CmsContractIssue,
  CmsContractResult,
} from "@/features/cms/contracts/result";

export type CmsPromoDealTile = Readonly<{
  description?: string;
  discountLabel?: string;
  endsAt?: string;
  id: string;
  image: CmsReferenceImage;
  label: string;
  link: CmsReferenceLink;
  position: number;
}>;

export type CmsPromoDealTilesData = Readonly<{
  eyebrow?: string;
  tiles: readonly CmsPromoDealTile[];
  title: string;
}>;

function parseTiles(
  value: unknown,
  issues: CmsContractIssue[],
): CmsPromoDealTile[] {
  return getCmsEntries(value)
    .flatMap(([key, itemValue], index) => {
      const item = getCmsRecord(itemValue);
      const path = `tiles.${key}`;
      const label = addRequiredString(item, "label", `${path}.label`, issues);
      const image = parseReferenceImage(
        item?.image,
        `${path}.image`,
        label || "",
        issues,
      );
      const link = parseReferenceLink(item?.link, `${path}.link`, issues);
      const endsAt = getCmsString(item, "endsAt");
      const hasValidDeadline = endsAt
        ? Number.isFinite(Date.parse(endsAt))
        : true;

      if (endsAt && !hasValidDeadline) {
        issues.push({
          message: "endsAt must be a valid date-time string.",
          path: `${path}.endsAt`,
        });
      }

      if (!label || !image || !link) {
        return [];
      }

      return [
        {
          description: getCmsString(item, "description"),
          discountLabel: getCmsString(item, "discountLabel"),
          endsAt: hasValidDeadline ? endsAt : undefined,
          id: getCmsString(item, "id") || `${label}-${index}`,
          image,
          label,
          link,
          position: getCmsPosition(item, index),
        },
      ];
    })
    .sort((first, second) => first.position - second.position);
}

export function parseCmsPromoDealTilesData(
  value: unknown,
): CmsContractResult<CmsPromoDealTilesData> {
  const record = getCmsRecord(value);
  const issues: CmsContractIssue[] = [];
  const title = addRequiredString(record, "title", "title", issues);
  const tiles = parseTiles(record?.tiles, issues);

  if (tiles.length === 0) {
    issues.push({
      message: "At least one valid deal tile is required.",
      path: "tiles",
    });
  }

  if (!title || tiles.length === 0) {
    return { data: null, issues };
  }

  return {
    data: {
      eyebrow: getCmsString(record, "eyebrow"),
      tiles,
      title,
    },
    issues,
  };
}
