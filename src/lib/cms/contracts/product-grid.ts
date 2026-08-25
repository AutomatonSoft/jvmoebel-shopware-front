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

function getRecord(value: unknown): Record<string, unknown> | undefined {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return undefined;
  }

  return value as Record<string, unknown>;
}

function getString(record: Record<string, unknown> | undefined, key: string) {
  const value = record?.[key];

  return typeof value === "string" && value.trim() ? value : undefined;
}

function getNumber(record: Record<string, unknown> | undefined, key: string) {
  const value = record?.[key];

  return typeof value === "number" && Number.isFinite(value)
    ? value
    : undefined;
}

function parseProducts(value: unknown): CmsProductGridProduct[] {
  const productsRecord = getRecord(value);
  const productValues = Array.isArray(value)
    ? value
    : productsRecord
      ? Object.values(productsRecord)
      : [];

  return productValues
    .flatMap((productValue, index) => {
      const product = getRecord(productValue);
      const translated = getRecord(product?.translated);
      const cover = getRecord(product?.cover);
      const media = getRecord(cover?.media);
      const calculatedPrice = getRecord(product?.calculatedPrice);
      const listPrice = getRecord(calculatedPrice?.listPrice);
      const id = getString(product, "id");
      const imageUrl = getString(media, "url");
      const name = getString(translated, "name") || getString(product, "name");
      const unitPrice = getNumber(calculatedPrice, "unitPrice");
      const url = getString(product, "url");

      if (!id || !imageUrl || !name || unitPrice === undefined || !url) {
        return [];
      }

      const position = product?.position;

      return [
        {
          badge: getString(product, "badge"),
          description:
            getString(translated, "description") ||
            getString(product, "description"),
          id,
          image: {
            alt: getString(media, "alt") || name,
            url: imageUrl,
          },
          name,
          position:
            typeof position === "number" && Number.isFinite(position)
              ? position
              : index,
          previousPrice: getNumber(listPrice, "price"),
          rating: getNumber(product, "ratingAverage"),
          reviewCount: getNumber(product, "reviewCount"),
          unitPrice,
          url,
        },
      ];
    })
    .sort((first, second) => first.position - second.position);
}

function parseLink(value: unknown): CmsProductGridLink | undefined {
  const link = getRecord(value);
  const label = getString(link, "label");
  const url = getString(link, "url");

  return label && url ? { label, url } : undefined;
}

export function parseCmsProductGridData(
  value: unknown,
): CmsProductGridData | null {
  const data = getRecord(value);
  const currency = getString(data, "currency");
  const locale = getString(data, "locale");
  const products = parseProducts(data?.products);
  const title = getString(data, "title");

  if (!currency || !locale || products.length === 0 || !title) {
    return null;
  }

  return {
    currency,
    eyebrow: getString(data, "eyebrow"),
    locale,
    products,
    title,
    viewAll: parseLink(data?.viewAll),
  };
}
