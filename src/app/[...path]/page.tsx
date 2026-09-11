import type { Metadata, Route } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { cache } from "react";

import { CategoryPage } from "@/features/catalog/components/category-page";
import { getCategoryPageByPath } from "@/features/catalog/server/category-page";

type CategoryRoutePageProps = Readonly<{
  params: Promise<{ path: string[] }>;
}>;

const loadCategoryPage = cache(getCategoryPageByPath);

async function getPath(params: CategoryRoutePageProps["params"]) {
  const { path } = await params;

  return `/${path.join("/")}/`;
}

export async function generateMetadata({
  params,
}: CategoryRoutePageProps): Promise<Metadata> {
  const result = await loadCategoryPage(await getPath(params));

  if (!result) {
    return {};
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
  const result = await loadCategoryPage(await getPath(params));

  if (!result) {
    notFound();
  }

  if (result.route.shouldRedirect) {
    permanentRedirect(result.route.canonicalPath as Route);
  }

  return <CategoryPage page={result.page} />;
}
