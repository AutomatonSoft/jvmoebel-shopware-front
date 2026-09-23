import "server-only";

import type { ShopwareClient } from "@/integrations/shopware/client";

const redirectLookupTimeoutMilliseconds = 2_000;

export type ShopwareLegacyRedirectDecision = Readonly<{
  categoryId: string | null;
  mediaId: string | null;
  productId: string | null;
  statusCode: 301;
  targetUrl: string;
  type: "category" | "general" | "image" | "product";
}>;

export type ShopwareLegacyRedirectLookupResponse = Readonly<{
  data: ShopwareLegacyRedirectDecision | null;
}>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isAbsoluteHttpUrl(value: unknown): value is string {
  if (typeof value !== "string") {
    return false;
  }

  try {
    const url = new URL(value);

    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      Boolean(url.hostname) &&
      !url.username &&
      !url.password &&
      !url.hash
    );
  } catch {
    return false;
  }
}

export function parseShopwareLegacyRedirectDecision(
  value: unknown,
): ShopwareLegacyRedirectDecision | null {
  if (value === null) {
    return null;
  }

  const productId = isRecord(value) ? (value.productId ?? null) : null;
  const categoryId = isRecord(value) ? (value.categoryId ?? null) : null;
  const mediaId = isRecord(value) ? (value.mediaId ?? null) : null;

  if (
    !isRecord(value) ||
    value.statusCode !== 301 ||
    (value.type !== "category" &&
      value.type !== "general" &&
      value.type !== "image" &&
      value.type !== "product") ||
    !isAbsoluteHttpUrl(value.targetUrl) ||
    (productId !== null && typeof productId !== "string") ||
    (categoryId !== null && typeof categoryId !== "string") ||
    (mediaId !== null && typeof mediaId !== "string") ||
    (value.type === "product" &&
      (typeof productId !== "string" ||
        categoryId !== null ||
        mediaId !== null)) ||
    (value.type === "category" &&
      (typeof categoryId !== "string" ||
        productId !== null ||
        mediaId !== null)) ||
    (value.type === "image" &&
      (typeof mediaId !== "string" ||
        productId !== null ||
        categoryId !== null)) ||
    (value.type === "general" &&
      (productId !== null || categoryId !== null || mediaId !== null))
  ) {
    throw new Error("JvSeo returned an invalid redirect decision.");
  }

  return {
    categoryId,
    mediaId,
    productId,
    statusCode: value.statusCode,
    targetUrl: value.targetUrl,
    type: value.type,
  };
}

export async function getShopwareLegacyRedirect(
  client: ShopwareClient,
  sourceUrl: string,
): Promise<ShopwareLegacyRedirectDecision | null> {
  const response = await client.invoke(
    "readJvSeoRedirect post /jv-seo/redirect",
    {
      body: { url: sourceUrl },
      fetchOptions: {
        cache: "no-store",
        retry: 0,
        timeout: redirectLookupTimeoutMilliseconds,
      },
    },
  );

  return parseShopwareLegacyRedirectDecision(response.data.data);
}
