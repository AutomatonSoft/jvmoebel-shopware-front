import { getSitemapIndexResponse } from "@/features/sitemap/server/sitemap-public";

export const runtime = "nodejs";

export function GET(request: Request): Promise<Response> {
  return getSitemapIndexResponse(request);
}
