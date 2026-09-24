import { getRobotsTxtResponse } from "@/features/sitemap/server/sitemap-public";

export function GET(request: Request): Promise<Response> {
  return getRobotsTxtResponse(request);
}
