import type { Metadata, Route } from "next";
import { notFound, permanentRedirect } from "next/navigation";

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
    alternates: { canonical: pageData.product.url },
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

  const legacyPath = `/produkt/${encodeURIComponent(productId)}`;

  if (pageData.product.url !== legacyPath) {
    permanentRedirect(pageData.product.url as Route);
  }

  return <ProductDetail {...pageData} />;
}
