import {
  getSitemapArtifactStorage,
  isAuthorizedSitemapPublisher,
  SitemapArtifactStorageError,
} from "@/features/sitemap/server/sitemap-artifact-storage";
import {
  parseSitemapPublicationDeclaration,
  SitemapPublicationValidationError,
} from "@/features/sitemap/model/publication";

export async function POST(request: Request): Promise<Response> {
  if (!isAuthorizedSitemapPublisher(request))
    return privateError("unauthorized", 401);

  try {
    const declaration = parseSitemapPublicationDeclaration(
      await request.json(),
    );
    await getSitemapArtifactStorage().createPublication(declaration);
    return Response.json(
      { publicationId: declaration.publicationId },
      { status: 201 },
    );
  } catch (error) {
    return publicationError(error);
  }
}

function publicationError(error: unknown): Response {
  if (error instanceof SitemapPublicationValidationError) {
    return privateError("invalid_publication", 400);
  }
  if (error instanceof SitemapArtifactStorageError) {
    return privateError(
      error.code,
      error.code === "storage_configuration_invalid" ? 503 : 409,
    );
  }
  return privateError("publication_unavailable", 503);
}

function privateError(code: string, status: number): Response {
  return Response.json({ error: code }, { status });
}
