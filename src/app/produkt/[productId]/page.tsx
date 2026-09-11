import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductDetail } from "@/features/catalog/components/product-detail";
import { getShopProductPageData } from "@/features/catalog/server/product-detail";

export type ProductPageProps = {
  params: Promise<{ productId: string }>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { productId } = await params;
  const pageData = await getShopProductPageData(productId);

  if (!pageData) {
    return { title: "Produkt nicht gefunden | JVMöbel" };
  }

  return {
    description: pageData.product.longDescription,
    title: `${pageData.product.name} | JVMöbel`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productId } = await params;
  const pageData = await getShopProductPageData(productId);

  if (!pageData) {
    notFound();
  }

  return <ProductDetail {...pageData} />;
}
