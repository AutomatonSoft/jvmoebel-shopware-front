import "server-only";

import type { components } from "@shopware/api-client/store-api-types";

import type { ShopwareClient } from "@/integrations/shopware/client";

type ShopwareSeoUrl = components["schemas"]["SeoUrl"];

export type ShopwareStorefrontRoute = Readonly<{
  canonicalPath: string;
  entityId: string;
  kind: "category" | "landing-page" | "product";
  shouldRedirect: boolean;
}>;

function normalizeSeoPath(pathname: string) {
  return pathname.split(/[?#]/, 1)[0]?.replace(/^\/+|\/+$/g, "");
}

function getPublicPath(seoPath: string) {
  return `/${seoPath.replace(/^\/+/, "")}`;
}

function getRouteKind(routeName: string) {
  if (routeName === "frontend.navigation.page") {
    return "category";
  }

  if (routeName === "frontend.detail.page") {
    return "product";
  }

  if (routeName === "frontend.landing.page") {
    return "landing-page";
  }
}

function isSupportedSeoUrl(seoUrl: ShopwareSeoUrl) {
  return (
    !seoUrl.isDeleted &&
    Boolean(seoUrl.foreignKey) &&
    Boolean(getRouteKind(seoUrl.routeName))
  );
}

async function findSeoUrls(
  client: ShopwareClient,
  field: "foreignKey" | "seoPathInfo",
  value: string | string[],
) {
  const response = await client.invoke("readSeoUrl post /seo-url", {
    body: {
      filter: [
        {
          field,
          type: Array.isArray(value) ? "equalsAny" : "equals",
          value: value as string,
        },
      ],
      limit: 25,
    },
    fetchOptions: { cache: "no-store" },
  });

  return response.data.elements;
}

export async function getShopwareCanonicalProductPath(
  client: ShopwareClient,
  productId: string,
) {
  const canonicalSeoUrl = (
    await findSeoUrls(client, "foreignKey", productId)
  ).find(
    (seoUrl) =>
      isSupportedSeoUrl(seoUrl) &&
      seoUrl.routeName === "frontend.detail.page" &&
      seoUrl.isCanonical,
  );

  return canonicalSeoUrl ? getPublicPath(canonicalSeoUrl.seoPathInfo) : null;
}

export async function resolveShopwareStorefrontRoute(
  client: ShopwareClient,
  pathname: string,
): Promise<ShopwareStorefrontRoute | null> {
  const requestedPath = normalizeSeoPath(pathname);

  if (!requestedPath) {
    return null;
  }

  const requestedSeoUrl = (
    await findSeoUrls(client, "seoPathInfo", [
      requestedPath,
      `${requestedPath}/`,
    ])
  ).find(isSupportedSeoUrl);

  if (!requestedSeoUrl) {
    return null;
  }

  const kind = getRouteKind(requestedSeoUrl.routeName);

  if (!kind) {
    return null;
  }

  if (requestedSeoUrl.isCanonical) {
    return {
      canonicalPath: getPublicPath(requestedSeoUrl.seoPathInfo),
      entityId: requestedSeoUrl.foreignKey,
      kind,
      shouldRedirect: false,
    };
  }

  const canonicalSeoUrl = (
    await findSeoUrls(client, "foreignKey", requestedSeoUrl.foreignKey)
  ).find(
    (seoUrl) =>
      isSupportedSeoUrl(seoUrl) &&
      seoUrl.routeName === requestedSeoUrl.routeName &&
      seoUrl.isCanonical,
  );
  const canonicalPath = getPublicPath(
    canonicalSeoUrl?.seoPathInfo ?? requestedSeoUrl.seoPathInfo,
  );

  return {
    canonicalPath,
    entityId: requestedSeoUrl.foreignKey,
    kind,
    shouldRedirect:
      canonicalPath !== getPublicPath(requestedSeoUrl.seoPathInfo),
  };
}
