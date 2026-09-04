import { getCmsRecord, getCmsString } from "@/features/cms/contracts/parsing";
import type {
  CmsContractIssue,
  CmsContractResult,
} from "@/features/cms/contracts/result";

export type CmsCategoryRailImage = Readonly<{
  alt: string;
  url: string;
}>;

export type CmsCategoryRailItem = Readonly<{
  id: string;
  image: CmsCategoryRailImage;
  label: string;
  position: number;
  url: string;
}>;

export type CmsCategoryRailLink = Readonly<{
  label: string;
  url: string;
}>;

export type CmsCategoryRailData = Readonly<{
  categories: readonly CmsCategoryRailItem[];
  description?: string;
  eyebrow?: string;
  title: string;
  viewAll?: CmsCategoryRailLink;
}>;

function parseCategories(value: unknown): Readonly<{
  data: CmsCategoryRailItem[];
  issues: readonly CmsContractIssue[];
}> {
  const categoriesRecord = getCmsRecord(value);
  const categoryEntries = Array.isArray(value)
    ? value.map((category, index) => [String(index), category] as const)
    : categoriesRecord
      ? Object.entries(categoriesRecord)
      : [];
  const issues: CmsContractIssue[] = [];

  const categories = categoryEntries
    .flatMap(([key, categoryValue], index) => {
      const category = getCmsRecord(categoryValue);
      const image = getCmsRecord(category?.image);
      const imageUrl = getCmsString(image, "url");
      const label = getCmsString(category, "label");
      const url = getCmsString(category, "url");
      const missingFields = [
        !imageUrl && "image.url",
        !label && "label",
        !url && "url",
      ].filter((field): field is string => Boolean(field));

      if (!imageUrl || !label || !url) {
        issues.push({
          message: `Category is missing required fields: ${missingFields.join(", ")}.`,
          path: `categories.${key}`,
        });

        return [];
      }

      const position = category?.position;

      return [
        {
          id: getCmsString(category, "id") || `${label}-${index}`,
          image: {
            alt: getCmsString(image, "alt") || label,
            url: imageUrl,
          },
          label,
          position:
            typeof position === "number" && Number.isFinite(position)
              ? position
              : index,
          url,
        },
      ];
    })
    .sort((first, second) => first.position - second.position);

  return { data: categories, issues };
}

function parseLink(value: unknown): Readonly<{
  data?: CmsCategoryRailLink;
  issues: readonly CmsContractIssue[];
}> {
  if (value === undefined || value === null) {
    return { issues: [] };
  }

  const link = getCmsRecord(value);
  const label = getCmsString(link, "label");
  const url = getCmsString(link, "url");

  if (!label || !url) {
    return {
      issues: [
        {
          message: `View-all link is missing required fields: ${[
            !label && "label",
            !url && "url",
          ]
            .filter(Boolean)
            .join(", ")}.`,
          path: "viewAll",
        },
      ],
    };
  }

  return { data: { label, url }, issues: [] };
}

export function parseCmsCategoryRailData(
  value: unknown,
): CmsContractResult<CmsCategoryRailData> {
  const data = getCmsRecord(value);
  const categories = parseCategories(data?.categories);
  const title = getCmsString(data, "title");
  const viewAll = parseLink(data?.viewAll);
  const issues: CmsContractIssue[] = [...categories.issues, ...viewAll.issues];

  if (categories.data.length === 0) {
    issues.push({
      message: "At least one valid category is required.",
      path: "categories",
    });
  }

  if (!title) {
    issues.push({ message: "Title is missing or empty.", path: "title" });
  }

  if (!title || categories.data.length === 0) {
    return { data: null, issues };
  }

  return {
    data: {
      categories: categories.data,
      description: getCmsString(data, "description"),
      eyebrow: getCmsString(data, "eyebrow"),
      title,
      viewAll: viewAll.data,
    },
    issues,
  };
}
