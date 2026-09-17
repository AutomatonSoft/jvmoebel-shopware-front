import type { Metadata, Route } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { ProductDetail } from "@/features/catalog/components/product-detail";
import { getShopProductPageData } from "@/features/catalog/server/product-detail";

export type ProductPageProps = {
  params: Promise<{ productId: string }>;
  searchParams: Promise<{ fehler?: string | string[] }>;
};

function hasVariantSelectionError(value?: string | string[]) {
  return (Array.isArray(value) ? value[0] : value) === "variante";
}

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

export default async function ProductPage({
  params,
  searchParams,
}: ProductPageProps) {
  const { productId } = await params;
  const { fehler } = await searchParams;
  const variantSelectionFailed = hasVariantSelectionError(fehler);
  const pageData = await getShopProductPageData(productId);

  if (!pageData) {
    notFound();
  }

  const legacyPath = `/produkt/${encodeURIComponent(productId)}`;

  if (pageData.product.url !== legacyPath) {
    const errorQuery = variantSelectionFailed ? "?fehler=variante" : "";

    permanentRedirect(`${pageData.product.url}${errorQuery}` as Route);
  }

  return (
    <ProductDetail
      {...pageData}
      variantSelectionFailed={variantSelectionFailed}
    />
  );
}
