import { getCmsRecord, getCmsString } from "@/lib/cms/contracts/parsing";

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

function parseCategories(value: unknown): CmsCategoryRailItem[] {
  const categoriesRecord = getCmsRecord(value);
  const categoryValues = Array.isArray(value)
    ? value
    : categoriesRecord
      ? Object.values(categoriesRecord)
      : [];

  return categoryValues
    .flatMap((categoryValue, index) => {
      const category = getCmsRecord(categoryValue);
      const image = getCmsRecord(category?.image);
      const imageUrl = getCmsString(image, "url");
      const label = getCmsString(category, "label");
      const url = getCmsString(category, "url");

      if (!imageUrl || !label || !url) {
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
}

function parseLink(value: unknown): CmsCategoryRailLink | undefined {
  const link = getCmsRecord(value);
  const label = getCmsString(link, "label");
  const url = getCmsString(link, "url");

  return label && url ? { label, url } : undefined;
}

export function parseCmsCategoryRailData(
  value: unknown,
): CmsCategoryRailData | null {
  const data = getCmsRecord(value);
  const categories = parseCategories(data?.categories);
  const title = getCmsString(data, "title");

  if (!title || categories.length === 0) {
    return null;
  }

  return {
    categories,
    description: getCmsString(data, "description"),
    eyebrow: getCmsString(data, "eyebrow"),
    title,
    viewAll: parseLink(data?.viewAll),
  };
}
