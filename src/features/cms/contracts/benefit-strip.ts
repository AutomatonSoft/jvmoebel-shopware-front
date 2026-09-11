import { getCmsRecord, getCmsString } from "@/features/cms/contracts/parsing";
import type {
  CmsContractIssue,
  CmsContractResult,
} from "@/features/cms/contracts/result";

export type CmsBenefitStripIcon = "delivery" | "price" | "returns";

export type CmsBenefitStripItem = Readonly<{
  description: string;
  icon: CmsBenefitStripIcon;
  id: string;
  position: number;
  title: string;
}>;

export type CmsBenefitStripData = Readonly<{
  items: readonly CmsBenefitStripItem[];
}>;

function parseIcon(value: unknown): CmsBenefitStripIcon | undefined {
  return value === "delivery" || value === "price" || value === "returns"
    ? value
    : undefined;
}

export function parseCmsBenefitStripData(
  value: unknown,
): CmsContractResult<CmsBenefitStripData> {
  const data = getCmsRecord(value);
  const itemsRecord = getCmsRecord(data?.items);
  const entries = Array.isArray(data?.items)
    ? data.items.map((item, index) => [String(index), item] as const)
    : itemsRecord
      ? Object.entries(itemsRecord)
      : [];
  const issues: CmsContractIssue[] = [];
  const items = entries
    .flatMap(([key, itemValue], index) => {
      const item = getCmsRecord(itemValue);
      const description = getCmsString(item, "description");
      const icon = parseIcon(item?.icon);
      const title = getCmsString(item, "title");

      if (!description || !icon || !title) {
        issues.push({
          message: "Benefit requires a title, description, and supported icon.",
          path: `items.${key}`,
        });

        return [];
      }

      const position = item?.position;

      return [
        {
          description,
          icon,
          id: getCmsString(item, "id") || `${title}-${index}`,
          position:
            typeof position === "number" && Number.isFinite(position)
              ? position
              : index,
          title,
        },
      ];
    })
    .sort((first, second) => first.position - second.position);

  if (items.length === 0) {
    issues.push({
      message: "At least one valid benefit is required.",
      path: "items",
    });

    return { data: null, issues };
  }

  return { data: { items }, issues };
}
