import type { ShopProduct } from "@/lib/shopware/product-listing";

export type ShopProductDetailMedia = Readonly<{
  alt: string;
  url: string;
}>;

export type ShopProductDetailOption = Readonly<{
  available: boolean;
  id: string;
  label: string;
  priceDifference?: number;
  swatch?: string;
}>;

export type ShopProductDetailOptionGroup = Readonly<{
  displayType: "button" | "select" | "swatch";
  id: string;
  label: string;
  options: readonly ShopProductDetailOption[];
  selectedOptionId: string;
}>;

export type ShopProductPurchaseNote = Readonly<{
  id: string;
  kind: "delivery" | "returns" | "warranty";
  text: string;
}>;

export type ShopProductDetail = ShopProduct &
  Readonly<{
    gallery: readonly [ShopProductDetailMedia, ...ShopProductDetailMedia[]];
    longDescription: string;
    optionGroups: readonly ShopProductDetailOptionGroup[];
    productNumber: string;
    purchaseNotes: readonly ShopProductPurchaseNote[];
    slug: string;
  }>;

export type ShopProductDetailPage = Readonly<{
  currency: string;
  locale: string;
  product: ShopProductDetail;
  recommendations: readonly ShopProduct[];
}>;

export function findShopProductDetailBySlug(
  products: readonly ShopProductDetail[],
  slug: string,
) {
  return products.find((product) => product.slug === slug);
}
