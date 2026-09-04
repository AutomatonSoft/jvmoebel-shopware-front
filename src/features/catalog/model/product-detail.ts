import type { ShopProduct } from "@/features/catalog/model/product-listing";

export type ShopProductAccessory = Readonly<{
  description: string;
  id: string;
  name: string;
  price: number;
}>;

export type ShopProductDimensions = Readonly<{
  height: number;
  length: number;
  unit: string;
  width: number;
}>;

export type ShopProductSpecification = Readonly<{
  id: string;
  label: string;
  value: string;
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
    deliveryEstimate: string;
    deliveryMethod: string;
    dimensions: ShopProductDimensions;
    gallery: readonly [ShopProduct["image"], ...ShopProduct["image"][]];
    longDescription: string;
    services: readonly ShopProductService[];
    specifications: readonly ShopProductSpecification[];
  }>;

export type ShopProductPageData = Readonly<{
  currency: string;
  locale: string;
  product: ShopProductDetail;
  relatedProducts: readonly ShopProduct[];
}>;
