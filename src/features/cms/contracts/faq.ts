import { getCmsRecord, getCmsString } from "@/features/cms/contracts/parsing";
import type {
  CmsContractIssue,
  CmsContractResult,
} from "@/features/cms/contracts/result";

export type CmsFaqItem = Readonly<{
  answer: string;
  id: string;
  position: number;
  question: string;
}>;

export type CmsFaqData = Readonly<{
  description?: string;
  eyebrow?: string;
  items: readonly CmsFaqItem[];
  title: string;
}>;

function parseItems(
  value: unknown,
): Readonly<{ data: CmsFaqItem[]; issues: CmsContractIssue[] }> {
  const itemsRecord = getCmsRecord(value);
  const entries = Array.isArray(value)
    ? value.map((item, index) => [String(index), item] as const)
    : itemsRecord
      ? Object.entries(itemsRecord)
      : [];
  const issues: CmsContractIssue[] = [];
  const data = entries
    .flatMap(([key, itemValue], index) => {
      const item = getCmsRecord(itemValue);
      const answer = getCmsString(item, "answer");
      const question = getCmsString(item, "question");

      if (!answer || !question) {
        issues.push({
          message: "FAQ item requires a non-empty question and answer.",
          path: `items.${key}`,
        });

        return [];
      }

      const position = item?.position;

      return [
        {
          answer,
          id: getCmsString(item, "id") || `${question}-${index}`,
          position:
            typeof position === "number" && Number.isFinite(position)
              ? position
              : index,
          question,
        },
      ];
    })
    .sort((first, second) => first.position - second.position);

  return { data, issues };
}

export function parseCmsFaqData(value: unknown): CmsContractResult<CmsFaqData> {
  const data = getCmsRecord(value);
  const items = parseItems(data?.items);
  const title = getCmsString(data, "title");
  const issues = [...items.issues];

  if (items.data.length === 0) {
    issues.push({
      message: "At least one valid FAQ item is required.",
      path: "items",
    });
  }

  if (!title) {
    issues.push({
      message: "FAQ title is missing or empty.",
      path: "title",
    });
  }

  if (!title || items.data.length === 0) {
    return { data: null, issues };
  }

  return {
    data: {
      description: getCmsString(data, "description"),
      eyebrow: getCmsString(data, "eyebrow"),
      items: items.data,
      title,
    },
    issues,
  };
}
