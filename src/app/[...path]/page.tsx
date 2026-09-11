import type { Metadata, Route } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { cache } from "react";

import { CategoryPage } from "@/features/catalog/components/category-page";
import { ProductDetail } from "@/features/catalog/components/product-detail";
import { getStorefrontPageByPath } from "@/features/catalog/server/storefront-page";

type CategoryRoutePageProps = Readonly<{
  params: Promise<{ path: string[] }>;
}>;

const loadStorefrontPage = cache(getStorefrontPageByPath);

async function getPath(params: CategoryRoutePageProps["params"]) {
  const { path } = await params;

  return `/${path.join("/")}`;
}

export async function generateMetadata({
  params,
}: CategoryRoutePageProps): Promise<Metadata> {
  const result = await loadStorefrontPage(await getPath(params));

  if (!result) {
    return {};
  }

  if (result.kind === "product") {
    return {
      alternates: { canonical: result.route.canonicalPath },
      description: result.page.product.longDescription,
      title: `${result.page.product.name} | JVMöbel`,
    };
  }

  const { category } = result.page;

  return {
    alternates: { canonical: result.route.canonicalPath },
    description: category.metaDescription || category.description,
    title: category.metaTitle || `${category.name} | JVMöbel`,
  };
}

export default async function CategoryRoutePage({
  params,
}: CategoryRoutePageProps) {
  const result = await loadStorefrontPage(await getPath(params));

  if (!result) {
    notFound();
  }

  if (result.route.shouldRedirect) {
    permanentRedirect(result.route.canonicalPath as Route);
  }

  return result.kind === "product" ? (
    <ProductDetail {...result.page} />
  ) : (
    <CategoryPage page={result.page} />
  );
}
