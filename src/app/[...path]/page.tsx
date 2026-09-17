import type { Metadata, Route } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { cache } from "react";

import {
  getProductPageRequest,
  type ProductListingSearchParams,
} from "@/app/_lib/product-listing-search-params";
import { CategoryPage } from "@/features/catalog/components/category-page";
import type { ShopProductPageRequest } from "@/features/catalog/model/product-listing-page";
import { ProductDetail } from "@/features/catalog/components/product-detail";
import { CmsLandingPageView } from "@/features/cms/components/cms-landing-page-view";
import { getStorefrontPageByPath } from "@/features/storefront-shell/server/storefront-page";

type CategoryRoutePageProps = Readonly<{
  params: Promise<{ path: string[] }>;
  searchParams: Promise<
    ProductListingSearchParams & { fehler?: string | string[] }
  >;
}>;

const loadStorefrontPage = cache(
  (pathname: string, productRequestKey: string) =>
    getStorefrontPageByPath(
      pathname,
      JSON.parse(productRequestKey) as ShopProductPageRequest,
    ),
);

async function getPath(params: CategoryRoutePageProps["params"]) {
  const { path } = await params;

  return `/${path.join("/")}`;
}

async function getPageResult({ params, searchParams }: CategoryRoutePageProps) {
  const [pathname, parameters] = await Promise.all([
    getPath(params),
    searchParams,
  ]);
  const productRequest = getProductPageRequest(parameters);
  const result = await loadStorefrontPage(
    pathname,
    JSON.stringify(productRequest),
  );

  return { parameters, result };
}

export async function generateMetadata({
  params,
  searchParams,
}: CategoryRoutePageProps): Promise<Metadata> {
  const { result } = await getPageResult({ params, searchParams });

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

  if (result.kind === "landing-page") {
    return {
      alternates: { canonical: result.route.canonicalPath },
      description: result.page.metaDescription,
      title: result.page.metaTitle || `${result.page.name} | JVMöbel`,
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
  searchParams,
}: CategoryRoutePageProps) {
  const { parameters, result } = await getPageResult({ params, searchParams });
  const { fehler } = parameters;
  const variantSelectionFailed =
    (Array.isArray(fehler) ? fehler[0] : fehler) === "variante";

  if (!result) {
    notFound();
  }

  if (result.route.shouldRedirect) {
    const errorQuery =
      result.kind === "product" && variantSelectionFailed
        ? "?fehler=variante"
        : "";

    permanentRedirect(`${result.route.canonicalPath}${errorQuery}` as Route);
  }

  if (result.kind === "product") {
    return (
      <ProductDetail
        {...result.page}
        variantSelectionFailed={variantSelectionFailed}
      />
    );
  }

  if (result.kind === "landing-page") {
    return <CmsLandingPageView page={result.page} />;
  }

  return <CategoryPage page={result.page} />;
}
