export type ProductSearchResult = Readonly<{
  categoryLabel: string;
  description: string;
  id: string;
  image: Readonly<{
    alt: string;
    url: string;
  }>;
  name: string;
  unitPrice: number;
  url: string;
}>;

export type ProductSearchResponse = Readonly<{
  currency: string;
  locale: string;
  results: readonly ProductSearchResult[];
}>;
