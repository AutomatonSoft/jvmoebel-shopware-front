import "server-only";

import type { components } from "@shopware/api-client/store-api-types";

import type { ShopwareClient } from "@/integrations/shopware/client";

type ShopwareSeoUrl = components["schemas"]["SeoUrl"];

export type ShopwareCategoryRoute = {
  canonicalPath: string;
  categoryId: string;
  shouldRedirect: boolean;
};

function normalizeSeoPath(pathname: string) {
  const path = pathname.split(/[?#]/, 1)[0]?.replace(/^\/+|\/+$/g, "");

  return path ? `${path}/` : undefined;
}

function getPublicPath(seoPath: string) {
  return `/${seoPath.replace(/^\/+/, "")}`;
}

function isCategorySeoUrl(seoUrl: ShopwareSeoUrl) {
  return (
    !seoUrl.isDeleted &&
    seoUrl.routeName === "frontend.navigation.page" &&
    Boolean(seoUrl.foreignKey)
  );
}

async function findSeoUrls(
  client: ShopwareClient,
  field: "foreignKey" | "seoPathInfo",
  value: string,
) {
  const response = await client.invoke("readSeoUrl post /seo-url", {
    body: {
      filter: [{ field, type: "equals", value }],
      limit: 25,
    },
    fetchOptions: { cache: "no-store" },
  });

  return response.data.elements;
}

export async function resolveShopwareCategoryRoute(
  client: ShopwareClient,
  pathname: string,
): Promise<ShopwareCategoryRoute | null> {
  const requestedSeoPath = normalizeSeoPath(pathname);

  if (!requestedSeoPath) {
    return null;
  }

  const requestedSeoUrl = (
    await findSeoUrls(client, "seoPathInfo", requestedSeoPath)
  ).find(isCategorySeoUrl);

  if (!requestedSeoUrl) {
    return null;
  }

  if (requestedSeoUrl.isCanonical) {
    return {
      canonicalPath: getPublicPath(requestedSeoUrl.seoPathInfo),
      categoryId: requestedSeoUrl.foreignKey,
      shouldRedirect: false,
    };
  }

  const canonicalSeoUrl = (
    await findSeoUrls(client, "foreignKey", requestedSeoUrl.foreignKey)
  ).find((seoUrl) => isCategorySeoUrl(seoUrl) && seoUrl.isCanonical);
  const canonicalPath = getPublicPath(
    canonicalSeoUrl?.seoPathInfo ?? requestedSeoUrl.seoPathInfo,
  );

  return {
    canonicalPath,
    categoryId: requestedSeoUrl.foreignKey,
    shouldRedirect: canonicalPath !== getPublicPath(requestedSeoPath),
  };
}
