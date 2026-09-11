import {
  getCmsNumber,
  getCmsRecord,
  getCmsString,
} from "@/features/cms/contracts/parsing";
import type {
  CmsContractIssue,
  CmsContractResult,
} from "@/features/cms/contracts/result";

export type CmsProductGridImage = Readonly<{
  alt: string;
  url: string;
}>;

export type CmsProductGridProduct = Readonly<{
  badge?: string;
  description?: string;
  id: string;
  image: CmsProductGridImage;
  name: string;
  position: number;
  previousPrice?: number;
  rating?: number;
  reviewCount?: number;
  unitPrice: number;
  url: string;
}>;

export type CmsProductGridLink = Readonly<{
  label: string;
  url: string;
}>;

export type CmsProductGridLayout = "grid" | "rail";

export type CmsProductGridData = Readonly<{
  anchorId?: string;
  currency: string;
  eyebrow?: string;
  layout: CmsProductGridLayout;
  locale: string;
  products: readonly CmsProductGridProduct[];
  title: string;
  viewAll?: CmsProductGridLink;
}>;

const anchorIdPattern = /^[A-Za-z][A-Za-z0-9:._-]*$/;

function parseProducts(value: unknown): Readonly<{
  data: CmsProductGridProduct[];
  issues: readonly CmsContractIssue[];
}> {
  const productsRecord = getCmsRecord(value);
  const productEntries = Array.isArray(value)
    ? value.map((product, index) => [String(index), product] as const)
    : productsRecord
      ? Object.entries(productsRecord)
      : [];
  const issues: CmsContractIssue[] = [];

  const products = productEntries
    .flatMap(([key, productValue], index) => {
      const product = getCmsRecord(productValue);
      const translated = getCmsRecord(product?.translated);
      const cover = getCmsRecord(product?.cover);
      const media = getCmsRecord(cover?.media);
      const calculatedPrice = getCmsRecord(product?.calculatedPrice);
      const listPrice = getCmsRecord(calculatedPrice?.listPrice);
      const id = getCmsString(product, "id");
      const imageUrl = getCmsString(media, "url");
      const name =
        getCmsString(translated, "name") || getCmsString(product, "name");
      const unitPrice = getCmsNumber(calculatedPrice, "unitPrice");
      const url = getCmsString(product, "url");
      const missingFields = [
        !id && "id",
        !imageUrl && "cover.media.url",
        !name && "name",
        unitPrice === undefined && "calculatedPrice.unitPrice",
        !url && "url",
      ].filter((field): field is string => Boolean(field));

      if (!id || !imageUrl || !name || unitPrice === undefined || !url) {
        issues.push({
          message: `Product is missing required fields: ${missingFields.join(", ")}.`,
          path: `products.${key}`,
        });

        return [];
      }

      const position = product?.position;

      return [
        {
          badge: getCmsString(product, "badge"),
          description:
            getCmsString(translated, "description") ||
            getCmsString(product, "description"),
          id,
          image: {
            alt: getCmsString(media, "alt") || name,
            url: imageUrl,
          },
          name,
          position:
            typeof position === "number" && Number.isFinite(position)
              ? position
              : index,
          previousPrice: getCmsNumber(listPrice, "price"),
          rating: getCmsNumber(product, "ratingAverage"),
          reviewCount: getCmsNumber(product, "reviewCount"),
          unitPrice,
          url,
        },
      ];
    })
    .sort((first, second) => first.position - second.position);

  return { data: products, issues };
}

function parseLink(value: unknown): Readonly<{
  data?: CmsProductGridLink;
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

export function parseCmsProductGridData(
  value: unknown,
): CmsContractResult<CmsProductGridData> {
  const data = getCmsRecord(value);
  const currency = getCmsString(data, "currency");
  const anchorIdValue = data?.anchorId;
  const configuredAnchorId = getCmsString(data, "anchorId");
  const anchorId =
    configuredAnchorId && anchorIdPattern.test(configuredAnchorId)
      ? configuredAnchorId
      : undefined;
  const locale = getCmsString(data, "locale");
  const products = parseProducts(data?.products);
  const title = getCmsString(data, "title");
  const viewAll = parseLink(data?.viewAll);
  const issues: CmsContractIssue[] = [...products.issues, ...viewAll.issues];

  if (anchorIdValue !== undefined && !anchorId) {
    issues.push({
      message: "Anchor ID must be a valid HTML identifier.",
      path: "anchorId",
    });
  }

  if (!currency) {
    issues.push({
      message: "Currency is missing or empty.",
      path: "currency",
    });
  }

  if (!locale) {
    issues.push({ message: "Locale is missing or empty.", path: "locale" });
  }

  if (products.data.length === 0) {
    issues.push({
      message: "At least one valid product is required.",
      path: "products",
    });
  }

  if (!title) {
    issues.push({ message: "Title is missing or empty.", path: "title" });
  }

  if (!currency || !locale || products.data.length === 0 || !title) {
    return { data: null, issues };
  }

  return {
    data: {
      anchorId,
      currency,
      eyebrow: getCmsString(data, "eyebrow"),
      layout: data?.layout === "rail" ? "rail" : "grid",
      locale,
      products: products.data,
      title,
      viewAll: viewAll.data,
    },
    issues,
  };
}
