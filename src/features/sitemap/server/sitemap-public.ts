import "server-only";

import {
  getSitemapArtifactStorage,
  normalizeRequestHost,
  SitemapArtifactStorageError,
} from "@/features/sitemap/server/sitemap-artifact-storage";

const cacheControl = "public, max-age=300, s-maxage=300";

export async function getSitemapIndexResponse(
  request: Request,
): Promise<Response> {
  const host = normalizeRequestHost(request);
  if (!host) return new Response(null, { status: 404 });
  const manifest = await getCurrentManifest(host);
  if (!manifest) return new Response(null, { status: 404 });

  const origin = publicOrigin(request, host);
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${manifest.artifacts.map((artifact) => `<sitemap><loc>${escapeXml(`${origin}/sitemap/${encodeURIComponent(artifact.path)}`)}</loc><lastmod>${manifest.committedAt}</lastmod></sitemap>`).join("")}</sitemapindex>`;
  return new Response(body, {
    headers: {
      "Cache-Control": cacheControl,
      "Content-Length": String(Buffer.byteLength(body)),
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}

export async function getSitemapArtifactResponse(
  request: Request,
  artifactPath: string,
): Promise<Response> {
  const host = normalizeRequestHost(request);
  if (!host) return new Response(null, { status: 404 });
  let artifact: Buffer | null;
  try {
    artifact = await getSitemapArtifactStorage().readCurrentArtifact(
      host,
      artifactPath,
    );
  } catch (error) {
    if (error instanceof SitemapArtifactStorageError)
      return new Response(null, { status: 404 });
    throw error;
  }
  if (!artifact) return new Response(null, { status: 404 });

  const body = new ArrayBuffer(artifact.byteLength);
  new Uint8Array(body).set(artifact);

  return new Response(body, {
    headers: {
      "Cache-Control": cacheControl,
      "Content-Length": String(artifact.byteLength),
      "Content-Type": "application/gzip",
    },
  });
}

export async function getRobotsTxtResponse(
  request: Request,
): Promise<Response> {
  const host = normalizeRequestHost(request);
  if (!host) return new Response(null, { status: 404 });

  let artifact: Buffer | null;
  try {
    artifact = await getSitemapArtifactStorage().readCurrentRobots(host);
  } catch (error) {
    if (error instanceof SitemapArtifactStorageError)
      return new Response(null, { status: 404 });
    throw error;
  }
  if (!artifact) return new Response(null, { status: 404 });

  const body = new ArrayBuffer(artifact.byteLength);
  new Uint8Array(body).set(artifact);

  return new Response(body, {
    headers: {
      "Cache-Control": cacheControl,
      "Content-Length": String(artifact.byteLength),
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

async function getCurrentManifest(host: string) {
  try {
    return await getSitemapArtifactStorage().getCurrentManifest(host);
  } catch (error) {
    if (error instanceof SitemapArtifactStorageError) return null;
    throw error;
  }
}

function publicOrigin(request: Request, host: string): string {
  const forwardedProtocol = request.headers
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim()
    .toLowerCase();
  const protocol =
    forwardedProtocol === "http" || forwardedProtocol === "https"
      ? forwardedProtocol
      : new URL(request.url).protocol.slice(0, -1);

  return `${protocol}://${host}`;
}

function escapeXml(value: string): string {
  return value.replace(
    /[<>&'\"]/g,
    (character) =>
      ({
        "&": "&amp;",
        "'": "&apos;",
        '"': "&quot;",
        ">": "&gt;",
        "<": "&lt;",
      })[character] ?? character,
  );
}
