import {
  getCmsNumber,
  getCmsRecord,
  getCmsString,
} from "@/lib/cms/contracts/parsing";

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

export type CmsProductGridData = Readonly<{
  currency: string;
  eyebrow?: string;
  locale: string;
  products: readonly CmsProductGridProduct[];
  title: string;
  viewAll?: CmsProductGridLink;
}>;

function parseProducts(value: unknown): CmsProductGridProduct[] {
  const productsRecord = getCmsRecord(value);
  const productValues = Array.isArray(value)
    ? value
    : productsRecord
      ? Object.values(productsRecord)
      : [];

  return productValues
    .flatMap((productValue, index) => {
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

      if (!id || !imageUrl || !name || unitPrice === undefined || !url) {
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
}

function parseLink(value: unknown): CmsProductGridLink | undefined {
  const link = getCmsRecord(value);
  const label = getCmsString(link, "label");
  const url = getCmsString(link, "url");

  return label && url ? { label, url } : undefined;
}

export function parseCmsProductGridData(
  value: unknown,
): CmsProductGridData | null {
  const data = getCmsRecord(value);
  const currency = getCmsString(data, "currency");
  const locale = getCmsString(data, "locale");
  const products = parseProducts(data?.products);
  const title = getCmsString(data, "title");

  if (!currency || !locale || products.length === 0 || !title) {
    return null;
  }

  return {
    currency,
    eyebrow: getCmsString(data, "eyebrow"),
    locale,
    products,
    title,
    viewAll: parseLink(data?.viewAll),
  };
}
