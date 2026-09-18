import type { ShopProduct } from "@/features/catalog/model/product-listing";

export type ShopProductAccessory = Readonly<{
  description: string;
  id: string;
  name: string;
  price: number;
}>;

export type ShopProductDimension = Readonly<{
  id: string;
  label: string;
  value: string;
}>;

export type ShopProductDimensions = readonly ShopProductDimension[];

export type ShopProductSpecification = Readonly<{
  id: string;
  label: string;
  value: string;
}>;

export type ShopProductVariantOption = Readonly<{
  available: boolean;
  hex?: string;
  id: string;
  label: string;
  selected: boolean;
  selection: readonly string[];
}>;

export type ShopProductVariantGroup = Readonly<{
  id: string;
  label: string;
  options: readonly ShopProductVariantOption[];
}>;

export type ShopProductVariantSelection = Readonly<{
  currentProductId: string;
  optionIds: readonly string[];
  parentProductId: string;
  switchedGroupId: string;
}>;

export type ShopProductService = Readonly<{
  available: boolean;
  description: string;
  id: string;
  name: string;
  price: number;
}>;

export type ShopProductDetail = ShopProduct &
  Readonly<{
    accessories: readonly ShopProductAccessory[];
    articleNumber: string;
    availability: string;
    colorVariantGroups: readonly ShopProductVariantGroup[];
    deliveryEstimate: string;
    deliveryMethod?: string;
    dimensions: ShopProductDimensions;
    gallery: readonly [ShopProduct["image"], ...ShopProduct["image"][]];
    isAvailable?: boolean;
    longDescription: string;
    longDescriptionHtml: string;
    services: readonly ShopProductService[];
    shippingFree?: boolean;
    sizeVariantGroups: readonly ShopProductVariantGroup[];
    specifications: readonly ShopProductSpecification[];
    variantParentId: string;
  }>;

export type ShopProductPageData = Readonly<{
  currency: string;
  locale: string;
  product: ShopProductDetail;
  relatedProducts: readonly ShopProduct[];
}>;
