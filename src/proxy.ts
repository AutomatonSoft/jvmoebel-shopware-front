import type { NextRequest } from "next/server";

import { handleLegacyRedirectProxyRequest } from "@/features/seo/server/legacy-redirect-proxy";

export function proxy(request: NextRequest) {
  return handleLegacyRedirectProxyRequest(request);
}

export const config = {
  matcher: "/:path*",
};
