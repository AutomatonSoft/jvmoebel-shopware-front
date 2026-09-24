import {
  getSitemapArtifactStorage,
  isAuthorizedSitemapPublisher,
  SitemapArtifactStorageError,
} from "@/features/sitemap/server/sitemap-artifact-storage";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ artifactPath: string[]; publicationId: string }>;
};

export async function PUT(
  request: Request,
  { params }: RouteContext,
): Promise<Response> {
  if (!isAuthorizedSitemapPublisher(request))
    return privateError("unauthorized", 401);

  const { artifactPath, publicationId } = await params;
  const contentType = request.headers.get("content-type")?.toLowerCase();
  const expectedContentType =
    artifactPath[0] === "robots.txt"
      ? "text/plain; charset=utf-8"
      : "application/gzip";
  if (artifactPath.length !== 1 || contentType !== expectedContentType) {
    return privateError("invalid_artifact", 400);
  }

  try {
    const contents = Buffer.from(await request.arrayBuffer());
    const contentLength = request.headers.get("content-length");
    if (
      contentLength === null ||
      Number(contentLength) !== contents.byteLength
    ) {
      return privateError("invalid_artifact", 400);
    }
    await getSitemapArtifactStorage().uploadArtifact(
      publicationId,
      artifactPath[0],
      contents,
      request.headers.get("x-checksum-sha256"),
      contentType,
    );
    return new Response(null, { status: 204 });
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
    return privateError("artifact_unavailable", 503);
  }
}

function privateError(code: string, status: number): Response {
  return Response.json({ error: code }, { status });
}
