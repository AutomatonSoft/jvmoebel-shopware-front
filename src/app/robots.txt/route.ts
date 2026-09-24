import { getRobotsTxtResponse } from "@/features/sitemap/server/sitemap-public";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET(request: Request): Promise<Response> {
  return getRobotsTxtResponse(request);
}
