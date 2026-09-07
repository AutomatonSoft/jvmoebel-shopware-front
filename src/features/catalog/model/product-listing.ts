export type ShopProductColor = Readonly<{
  hex: string;
  label: string;
  value: string;
}>;

export type ShopProductSize = "small" | "medium" | "large" | "extra-large";

export type ShopProductAttributeOption = Readonly<{
  hex?: string;
  label: string;
  value: string;
}>;

export type ShopProductAttributeGroup = Readonly<{
  id: string;
  label: string;
  options: readonly ShopProductAttributeOption[];
}>;

export type ShopProduct = Readonly<{
  attributes: readonly ShopProductAttributeGroup[];
  badge?: string;
  category: string;
  categoryLabel: string;
  colors: readonly ShopProductColor[];
  company: string;
  createdAt: string;
  description: string;
  featuredRank: number;
  id: string;
  image: Readonly<{
    alt: string;
    url: string;
  }>;
  material: string;
  name: string;
  previousPrice?: number;
  rating?: number;
  reviewCount?: number;
  sizes: readonly ShopProductSize[];
  unitPrice: number;
  url: string;
}>;

export type ShopProductListing = Readonly<{
  currency: string;
  description: string;
  eyebrow: string;
  locale: string;
  products: readonly ShopProduct[];
  title: string;
}>;
