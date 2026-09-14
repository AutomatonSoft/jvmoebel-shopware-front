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

export type CmsLookSceneProduct = Readonly<{
  id: string;
  name: string;
  position: number;
  url: string;
}>;

export type CmsLookSceneData = Readonly<{
  description?: string;
  image: CmsReferenceImage;
  products: readonly CmsLookSceneProduct[];
  title: string;
  viewAll?: CmsReferenceLink;
}>;

function parseProducts(
  value: unknown,
  issues: CmsContractIssue[],
): CmsLookSceneProduct[] {
  return getCmsEntries(value)
    .flatMap(([key, itemValue], index) => {
      const item = getCmsRecord(itemValue);
      const path = `products.${key}`;
      const name = addRequiredString(item, "name", `${path}.name`, issues);
      const url = addRequiredString(item, "url", `${path}.url`, issues);

      if (!name || !url) {
        return [];
      }

      return [
        {
          id: getCmsString(item, "id") || `${name}-${index}`,
          name,
          position: getCmsPosition(item, index),
          url,
        },
      ];
    })
    .sort((first, second) => first.position - second.position);
}

export function parseCmsLookSceneData(
  value: unknown,
): CmsContractResult<CmsLookSceneData> {
  const record = getCmsRecord(value);
  const issues: CmsContractIssue[] = [];
  const title = addRequiredString(record, "title", "title", issues);
  const image = parseReferenceImage(
    record?.image,
    "image",
    title || "",
    issues,
  );
  const products = parseProducts(record?.products, issues);
  const viewAll =
    record?.viewAll === undefined || record.viewAll === null
      ? undefined
      : parseReferenceLink(record.viewAll, "viewAll", issues);

  if (products.length === 0) {
    issues.push({
      message: "At least one valid product link is required.",
      path: "products",
    });
  }

  if (!title || !image || products.length === 0) {
    return { data: null, issues };
  }

  return {
    data: {
      description: getCmsString(record, "description"),
      image,
      products,
      title,
      viewAll,
    },
    issues,
  };
}
