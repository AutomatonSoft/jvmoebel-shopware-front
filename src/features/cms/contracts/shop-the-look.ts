import {
  getCmsNumber,
  getCmsRecord,
  getCmsString,
} from "@/features/cms/contracts/parsing";
import type {
  CmsContractIssue,
  CmsContractResult,
} from "@/features/cms/contracts/result";

export type CmsShopTheLookImage = Readonly<{
  alt: string;
  url: string;
}>;

export type CmsShopTheLookHotspot = Readonly<{
  x: number;
  y: number;
}>;

export type CmsShopTheLookItem = Readonly<{
  description?: string;
  hotspot: CmsShopTheLookHotspot;
  id: string;
  name: string;
  position: number;
  url: string;
}>;

export type CmsShopTheLookLink = Readonly<{
  label: string;
  url: string;
}>;

export type CmsShopTheLookData = Readonly<{
  description?: string;
  eyebrow?: string;
  image: CmsShopTheLookImage;
  items: readonly CmsShopTheLookItem[];
  title: string;
  viewAll?: CmsShopTheLookLink;
}>;

function isPercentage(value: number | undefined): value is number {
  return value !== undefined && value >= 0 && value <= 100;
}

function parseItems(value: unknown): Readonly<{
  data: CmsShopTheLookItem[];
  issues: readonly CmsContractIssue[];
}> {
  const itemsRecord = getCmsRecord(value);
  const itemEntries = Array.isArray(value)
    ? value.map((item, index) => [String(index), item] as const)
    : itemsRecord
      ? Object.entries(itemsRecord)
      : [];
  const issues: CmsContractIssue[] = [];

  const items = itemEntries
    .flatMap(([key, itemValue], index) => {
      const item = getCmsRecord(itemValue);
      const hotspot = getCmsRecord(item?.hotspot);
      const name = getCmsString(item, "name");
      const url = getCmsString(item, "url");
      const x = getCmsNumber(hotspot, "x");
      const y = getCmsNumber(hotspot, "y");
      const missingFields = [
        !name && "name",
        !url && "url",
        !isPercentage(x) && "hotspot.x",
        !isPercentage(y) && "hotspot.y",
      ].filter((field): field is string => Boolean(field));

      if (!name || !url || !isPercentage(x) || !isPercentage(y)) {
        issues.push({
          message: `Look item is missing or has invalid required fields: ${missingFields.join(", ")}.`,
          path: `items.${key}`,
        });

        return [];
      }

      const position = item?.position;

      return [
        {
          description: getCmsString(item, "description"),
          hotspot: { x, y },
          id: getCmsString(item, "id") || `${name}-${index}`,
          name,
          position:
            typeof position === "number" && Number.isFinite(position)
              ? position
              : index,
          url,
        },
      ];
    })
    .sort((first, second) => first.position - second.position);

  return { data: items, issues };
}

function parseLink(value: unknown): Readonly<{
  data?: CmsShopTheLookLink;
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

export function parseCmsShopTheLookData(
  value: unknown,
): CmsContractResult<CmsShopTheLookData> {
  const data = getCmsRecord(value);
  const image = getCmsRecord(data?.image);
  const imageUrl = getCmsString(image, "url");
  const items = parseItems(data?.items);
  const title = getCmsString(data, "title");
  const viewAll = parseLink(data?.viewAll);
  const issues: CmsContractIssue[] = [...items.issues, ...viewAll.issues];

  if (!imageUrl) {
    issues.push({
      message: "Look image URL is missing or empty.",
      path: "image.url",
    });
  }

  if (items.data.length === 0) {
    issues.push({
      message: "At least one valid look item is required.",
      path: "items",
    });
  }

  if (!title) {
    issues.push({ message: "Title is missing or empty.", path: "title" });
  }

  if (!imageUrl || items.data.length === 0 || !title) {
    return { data: null, issues };
  }

  return {
    data: {
      description: getCmsString(data, "description"),
      eyebrow: getCmsString(data, "eyebrow"),
      image: {
        alt: getCmsString(image, "alt") || title,
        url: imageUrl,
      },
      items: items.data,
      title,
      viewAll: viewAll.data,
    },
    issues,
  };
}
