import type { Metadata, Route } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { cache, Suspense } from "react";

import {
  getProductPageRequest,
  type ProductListingSearchParams,
} from "@/app/_lib/product-listing-search-params";
import { CategoryPage } from "@/features/catalog/components/category-page";
import type { ShopProductPageRequest } from "@/features/catalog/model/product-listing-page";
import { ProductDetail } from "@/features/catalog/components/product-detail";
import { CmsLandingPageView } from "@/features/cms/components/cms-landing-page-view";
import { StorefrontPageLoading } from "@/features/storefront-shell/components/storefront-route-loading";
import {
  getStorefrontPage,
  resolveStorefrontRoute,
  type ResolvedStorefrontRoute,
} from "@/features/storefront-shell/server/storefront-page";

type CategoryRoutePageProps = Readonly<{
  params: Promise<{ path: string[] }>;
  searchParams: Promise<
    ProductListingSearchParams & { fehler?: string | string[] }
  >;
}>;

const loadStorefrontRoute = cache((pathname: string) =>
  resolveStorefrontRoute(pathname),
);
const loadStorefrontPage = cache(
  (resolvedRoute: ResolvedStorefrontRoute, productRequestKey: string) =>
    getStorefrontPage(
      resolvedRoute,
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
  const resolvedRoute = await loadStorefrontRoute(pathname);
  const result = resolvedRoute
    ? await loadStorefrontPage(
        resolvedRoute,
        JSON.stringify(getProductPageRequest(parameters)),
      )
    : null;

  return { parameters, result };
}

type StorefrontPageContentProps = Readonly<{
  productRequestKey: string;
  resolvedRoute: ResolvedStorefrontRoute;
  variantSelectionFailed: boolean;
}>;

async function StorefrontPageContent({
  productRequestKey,
  resolvedRoute,
  variantSelectionFailed,
}: StorefrontPageContentProps) {
  const result = await loadStorefrontPage(resolvedRoute, productRequestKey);

  if (!result) {
    notFound();
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
      title: `${result.page.product.name} | JVMoebel`,
    };
  }

  if (result.kind === "landing-page") {
    return {
      alternates: { canonical: result.route.canonicalPath },
      description: result.page.metaDescription,
      title: result.page.metaTitle || `${result.page.name} | JVMoebel`,
    };
  }

  const { category } = result.page;

  return {
    alternates: { canonical: result.route.canonicalPath },
    description: category.metaDescription || category.description,
    title: category.metaTitle || `${category.name} | JVMoebel`,
  };
}

export default async function CategoryRoutePage({
  params,
  searchParams,
}: CategoryRoutePageProps) {
  const [pathname, parameters] = await Promise.all([
    getPath(params),
    searchParams,
  ]);
  const { fehler } = parameters;
  const variantSelectionFailed =
    (Array.isArray(fehler) ? fehler[0] : fehler) === "variante";
  const resolvedRoute = await loadStorefrontRoute(pathname);

  if (!resolvedRoute) {
    notFound();
  }

  if (resolvedRoute.route.shouldRedirect) {
    const errorQuery =
      resolvedRoute.route.kind === "product" && variantSelectionFailed
        ? "?fehler=variante"
        : "";

    permanentRedirect(
      `${resolvedRoute.route.canonicalPath}${errorQuery}` as Route,
    );
  }

  return (
    <Suspense
      fallback={<StorefrontPageLoading kind={resolvedRoute.route.kind} />}
    >
      <StorefrontPageContent
        productRequestKey={JSON.stringify(getProductPageRequest(parameters))}
        resolvedRoute={resolvedRoute}
        variantSelectionFailed={variantSelectionFailed}
      />
    </Suspense>
  );
}
