import { getSitemapArtifactResponse } from "@/features/sitemap/server/sitemap-public";

type RouteContext = { params: Promise<{ artifactPath: string[] }> };

export async function GET(
  request: Request,
  { params }: RouteContext,
): Promise<Response> {
  const { artifactPath } = await params;
  if (artifactPath.length !== 1) return new Response(null, { status: 404 });
  return getSitemapArtifactResponse(request, artifactPath[0]);
}
