import "server-only";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { createShopwareClient } from "@/integrations/shopware/client";
import {
  getShopwareLegacyRedirect,
  type ShopwareLegacyRedirectDecision,
} from "@/integrations/shopware/legacy-redirect";
import { shouldUseShopwareMocks } from "@/integrations/shopware/mock-mode";

type LegacyRedirectLookup = (
  sourceUrl: string,
) => Promise<ShopwareLegacyRedirectDecision | null>;

const excludedPathPrefixes = ["/_next", "/api", "/bff", "/store-api"];
const excludedPaths = new Set(["/favicon.ico"]);

function shouldLookUpRedirect(request: NextRequest): boolean {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return false;
  }

  const { pathname } = request.nextUrl;

  return (
    !excludedPaths.has(pathname) &&
    !excludedPathPrefixes.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    )
  );
}

async function lookupWithCurrentShopwareConfig(sourceUrl: string) {
  if (shouldUseShopwareMocks()) {
    return null;
  }

  return getShopwareLegacyRedirect(createShopwareClient(), sourceUrl);
}

export async function handleLegacyRedirectProxyRequest(
  request: NextRequest,
  lookup: LegacyRedirectLookup = lookupWithCurrentShopwareConfig,
) {
  if (!shouldLookUpRedirect(request)) {
    return NextResponse.next();
  }

  try {
    const redirect = await lookup(request.url);

    if (!redirect) {
      return NextResponse.next();
    }

    const targetUrl = new URL(redirect.targetUrl);
    if (targetUrl.href === request.nextUrl.href) {
      console.error("JvSeo returned a redirect to the requested URL.");

      return NextResponse.next();
    }

    return NextResponse.redirect(targetUrl, redirect.statusCode);
  } catch {
    // Redirect lookup must not make current storefront routes unavailable.
    console.error("JvSeo redirect lookup failed.");

    return NextResponse.next();
  }
}
