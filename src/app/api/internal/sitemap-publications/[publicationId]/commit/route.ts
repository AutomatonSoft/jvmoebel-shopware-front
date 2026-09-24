import {
  getSitemapArtifactStorage,
  isAuthorizedSitemapPublisher,
  SitemapArtifactStorageError,
} from "@/features/sitemap/server/sitemap-artifact-storage";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ publicationId: string }> };

export async function POST(
  request: Request,
  { params }: RouteContext,
): Promise<Response> {
  if (!isAuthorizedSitemapPublisher(request))
    return privateError("unauthorized", 401);

  try {
    const { publicationId } = await params;
    const manifest =
      await getSitemapArtifactStorage().commitPublication(publicationId);
    return Response.json(
      {
        destinationVersion: manifest.publicationId,
        publicationId: manifest.publicationId,
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof SitemapArtifactStorageError) {
      return privateError(
        error.code,
        error.code === "publication_not_found"
          ? 404
          : error.code === "storage_configuration_invalid"
            ? 503
            : 409,
      );
    }
    return privateError("commit_unavailable", 503);
  }
}

function privateError(code: string, status: number): Response {
  return Response.json({ error: code }, { status });
}
