import { getCmsRecord, getCmsString } from "@/features/cms/contracts/parsing";
import {
  addRequiredString,
  getCmsEntries,
  getCmsPosition,
  parseReferenceImage,
  type CmsReferenceImage,
} from "@/features/cms/contracts/reference-shared";
import type {
  CmsContractIssue,
  CmsContractResult,
} from "@/features/cms/contracts/result";

export type CmsColorWorld = Readonly<{
  hex: string;
  id: string;
  image: CmsReferenceImage;
  name: string;
  position: number;
  url: string;
}>;

export type CmsColorWorldPickerData = Readonly<{
  colors: readonly CmsColorWorld[];
  description?: string;
  title: string;
}>;

const hexColorPattern = /^#(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i;

function parseColors(
  value: unknown,
  issues: CmsContractIssue[],
): CmsColorWorld[] {
  return getCmsEntries(value)
    .flatMap(([key, itemValue], index) => {
      const item = getCmsRecord(itemValue);
      const path = `colors.${key}`;
      const name = addRequiredString(item, "name", `${path}.name`, issues);
      const url = addRequiredString(item, "url", `${path}.url`, issues);
      const hex = addRequiredString(item, "hex", `${path}.hex`, issues);
      const image = parseReferenceImage(
        item?.image,
        `${path}.image`,
        name || "",
        issues,
      );
      const hasValidHex = hex ? hexColorPattern.test(hex) : false;

      if (hex && !hasValidHex) {
        issues.push({
          message: "hex must be a valid hexadecimal color.",
          path: `${path}.hex`,
        });
      }

      if (!name || !url || !hex || !hasValidHex || !image) {
        return [];
      }

      return [
        {
          hex,
          id: getCmsString(item, "id") || `${name}-${index}`,
          image,
          name,
          position: getCmsPosition(item, index),
          url,
        },
      ];
    })
    .sort((first, second) => first.position - second.position);
}

export function parseCmsColorWorldPickerData(
  value: unknown,
): CmsContractResult<CmsColorWorldPickerData> {
  const record = getCmsRecord(value);
  const issues: CmsContractIssue[] = [];
  const title = addRequiredString(record, "title", "title", issues);
  const colors = parseColors(record?.colors, issues);

  if (colors.length === 0) {
    issues.push({
      message: "At least one valid color world is required.",
      path: "colors",
    });
  }

  if (!title || colors.length === 0) {
    return { data: null, issues };
  }

  return {
    data: {
      colors,
      description: getCmsString(record, "description"),
      title,
    },
    issues,
  };
}
