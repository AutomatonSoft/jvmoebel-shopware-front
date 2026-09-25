export type SitemapPublicationType = "sitemap" | "robots";

export type SitemapArtifactDeclaration = Readonly<{
  contentType: "application/gzip" | "text/plain; charset=utf-8";
  path: string;
  sha256: string;
  size: number;
}>;

export type SitemapPublicationDeclaration = Readonly<{
  artifacts: readonly SitemapArtifactDeclaration[];
  environment: string;
  generatedAt: string;
  host: string;
  languageId: string;
  publicationId: string;
  publicationType?: SitemapPublicationType;
  salesChannelId: string;
}>;

const shopwareIdPattern = /^[a-f0-9]{32}$/;
const sha256Pattern = /^[a-f0-9]{64}$/;
const artifactPathPattern = /^[A-Za-z0-9][A-Za-z0-9._-]*\.xml\.gz$/;
const maxRobotsBytes = 32 * 1024;

export class SitemapPublicationValidationError extends Error {}

export function isSafeSitemapArtifactPath(value: string): boolean {
  if (!artifactPathPattern.test(value)) return false;

  try {
    return !decodeURIComponent(value).includes("/");
  } catch {
    return false;
  }
}

export function parseSitemapPublicationDeclaration(
  value: unknown,
): SitemapPublicationDeclaration {
  if (!isRecord(value)) {
    throw new SitemapPublicationValidationError(
      "Publication must be an object.",
    );
  }

  const publicationType = parsePublicationType(value.publicationType);
  const artifacts = value.artifacts;
  if (!Array.isArray(artifacts) || artifacts.length === 0) {
    throw new SitemapPublicationValidationError(
      "Publication must declare artifacts.",
    );
  }

  const declaration: SitemapPublicationDeclaration = {
    artifacts: artifacts.map((artifact) =>
      parseArtifact(artifact, publicationType),
    ),
    environment: parseNonEmptyString(value.environment, "environment"),
    generatedAt: parseTimestamp(value.generatedAt),
    host: parseHost(value.host),
    languageId: parseShopwareId(value.languageId, "languageId"),
    publicationId: parseShopwareId(value.publicationId, "publicationId"),
    publicationType,
    salesChannelId: parseShopwareId(value.salesChannelId, "salesChannelId"),
  };

  if (
    new Set(declaration.artifacts.map((artifact) => artifact.path)).size !==
    declaration.artifacts.length
  ) {
    throw new SitemapPublicationValidationError(
      "Publication artifact paths must be unique.",
    );
  }
  if (
    publicationType === "robots" &&
    (declaration.artifacts.length !== 1 ||
      declaration.artifacts[0].path !== "robots.txt")
  ) {
    throw new SitemapPublicationValidationError(
      "Robots publication must contain exactly one robots.txt artifact.",
    );
  }

  return declaration;
}

function parseArtifact(
  value: unknown,
  publicationType: SitemapPublicationType,
): SitemapArtifactDeclaration {
  if (!isRecord(value)) {
    throw new SitemapPublicationValidationError("Artifact must be an object.");
  }

  const path = parseNonEmptyString(value.path, "artifact path");
  const validPath =
    publicationType === "robots"
      ? path === "robots.txt"
      : isSafeSitemapArtifactPath(path);
  if (!validPath) {
    throw new SitemapPublicationValidationError("Artifact path is invalid.");
  }

  const contentType =
    publicationType === "robots"
      ? "text/plain; charset=utf-8"
      : "application/gzip";
  if (value.contentType !== contentType) {
    throw new SitemapPublicationValidationError(
      "Artifact content type is invalid.",
    );
  }

  const sha256 = parseNonEmptyString(value.sha256, "artifact checksum");
  if (!sha256Pattern.test(sha256)) {
    throw new SitemapPublicationValidationError(
      "Artifact checksum is invalid.",
    );
  }

  const minimumSize = publicationType === "robots" ? 0 : 1;
  const maximumSize =
    publicationType === "robots" ? maxRobotsBytes : Number.MAX_SAFE_INTEGER;
  if (
    typeof value.size !== "number" ||
    !Number.isSafeInteger(value.size) ||
    value.size < minimumSize ||
    value.size > maximumSize
  ) {
    throw new SitemapPublicationValidationError("Artifact size is invalid.");
  }

  return { contentType, path, sha256, size: value.size };
}

function parsePublicationType(value: unknown): SitemapPublicationType {
  if (value === undefined) return "sitemap";
  if (value === "sitemap" || value === "robots") return value;

  throw new SitemapPublicationValidationError("Publication type is invalid.");
}

function parseShopwareId(value: unknown, name: string): string {
  const id = parseNonEmptyString(value, name);
  if (!shopwareIdPattern.test(id)) {
    throw new SitemapPublicationValidationError(name + " is invalid.");
  }

  return id;
}

function parseHost(value: unknown): string {
  const host = parseNonEmptyString(value, "host").toLowerCase();
  try {
    const parsed = new URL("https://" + host);
    if (
      parsed.hostname !== host ||
      parsed.port ||
      parsed.username ||
      parsed.password
    ) {
      throw new Error("invalid host");
    }
  } catch {
    throw new SitemapPublicationValidationError("Host is invalid.");
  }

  return host;
}

function parseTimestamp(value: unknown): string {
  const timestamp = parseNonEmptyString(value, "generatedAt");
  if (Number.isNaN(Date.parse(timestamp))) {
    throw new SitemapPublicationValidationError("generatedAt is invalid.");
  }

  return timestamp;
}

function parseNonEmptyString(value: unknown, name: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new SitemapPublicationValidationError(
      name + " must be a non-empty string.",
    );
  }

  return value.trim();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
