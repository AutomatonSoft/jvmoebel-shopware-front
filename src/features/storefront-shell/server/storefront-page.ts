import "server-only";

import {
  defaultShopProductPageRequest,
  type ShopProductPageRequest,
} from "@/features/catalog/model/product-listing-page";
import type { CmsLandingPage } from "@/features/cms/model/landing-page";
import { getShopCategoryPage } from "@/features/catalog/server/category-page";
import { getShopProductPageData } from "@/features/catalog/server/product-detail";
import { getMockLandingPageRoute } from "@/features/storefront-shell/fixtures/landing-pages";
import { getStorefrontRoute } from "@/features/storefront-shell/server/storefront-route";
import { getShopwareLandingPage } from "@/integrations/shopware/landing-page";
import { shouldUseShopwareMocks } from "@/integrations/shopware/mock-mode";
import { getShopwareRequestSession } from "@/integrations/shopware/session";
import type { ShopwareStorefrontRoute } from "@/integrations/shopware/storefront-route";

export type ResolvedStorefrontRoute = Readonly<{
  mockLandingPage?: CmsLandingPage;
  route: ShopwareStorefrontRoute;
}>;

export type StorefrontPageResult =
  | Readonly<{
      kind: "category";
      page: Awaited<ReturnType<typeof getShopCategoryPage>>;
      route: ShopwareStorefrontRoute;
    }>
  | Readonly<{
      kind: "landing-page";
      page: CmsLandingPage;
      route: ShopwareStorefrontRoute;
    }>
  | Readonly<{
      kind: "product";
      page: NonNullable<Awaited<ReturnType<typeof getShopProductPageData>>>;
      route: ShopwareStorefrontRoute;
    }>;

export async function resolveStorefrontRoute(
  pathname: string,
): Promise<ResolvedStorefrontRoute | null> {
  if (shouldUseShopwareMocks()) {
    const mockRoute = getMockLandingPageRoute(pathname);

    if (!mockRoute) {
      return null;
    }

    return {
      mockLandingPage: mockRoute.page,
      route: {
        canonicalPath: mockRoute.canonicalPath,
        entityId: mockRoute.page.id,
        kind: "landing-page",
        shouldRedirect: pathname !== mockRoute.canonicalPath,
      } satisfies ShopwareStorefrontRoute,
    };
  }

  const route = await getStorefrontRoute(pathname);

  if (!route) {
    return null;
  }

  return { route };
}

export async function getStorefrontPage(
  resolvedRoute: ResolvedStorefrontRoute,
  productRequest: ShopProductPageRequest = defaultShopProductPageRequest,
): Promise<StorefrontPageResult | null> {
  const { route } = resolvedRoute;

  if (route.kind === "product") {
    const page = await getShopProductPageData(route.entityId);

    return page
      ? ({ kind: "product", page, route } satisfies {
          kind: "product";
          page: NonNullable<Awaited<ReturnType<typeof getShopProductPageData>>>;
          route: ShopwareStorefrontRoute;
        })
      : null;
  }

  if (route.kind === "landing-page") {
    const page =
      resolvedRoute.mockLandingPage ??
      (await getShopwareLandingPage(
        getShopwareRequestSession().client,
        route.entityId,
      ));

    return page
      ? ({ kind: "landing-page", page, route } satisfies {
          kind: "landing-page";
          page: NonNullable<Awaited<ReturnType<typeof getShopwareLandingPage>>>;
          route: ShopwareStorefrontRoute;
        })
      : null;
  }

  return {
    kind: "category",
    page: await getShopCategoryPage(route.entityId, productRequest),
    route,
  };
}

export async function getStorefrontPageByPath(
  pathname: string,
  productRequest: ShopProductPageRequest = defaultShopProductPageRequest,
) {
  const resolvedRoute = await resolveStorefrontRoute(pathname);

  return resolvedRoute
    ? getStorefrontPage(resolvedRoute, productRequest)
    : null;
}
