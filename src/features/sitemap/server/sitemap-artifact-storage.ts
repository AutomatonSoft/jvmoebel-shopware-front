import "server-only";

import { createHash, randomUUID, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  isSafeSitemapArtifactPath,
  type SitemapArtifactDeclaration,
  type SitemapPublicationDeclaration,
  type SitemapPublicationType,
} from "@/features/sitemap/model/publication";

type StoredPublication = Omit<
  SitemapPublicationDeclaration,
  "publicationType"
> &
  Readonly<{
    committedAt?: string;
    publicationType: SitemapPublicationType;
    receivedPaths: readonly string[];
  }>;

export type SitemapCurrentManifest = Readonly<{
  artifacts: readonly SitemapArtifactDeclaration[];
  committedAt: string;
  generatedAt: string;
  host: string;
  publicationId: string;
  publicationType?: SitemapPublicationType;
}>;

export class SitemapArtifactStorageError extends Error {
  constructor(
    public readonly code:
      | "artifact_checksum_mismatch"
      | "artifact_conflict"
      | "artifact_content_type_mismatch"
      | "artifact_not_declared"
      | "artifact_too_large"
      | "publication_conflict"
      | "publication_incomplete"
      | "publication_not_found"
      | "storage_configuration_invalid",
  ) {
    super(code);
  }
}

export function getSitemapArtifactStorage(): SitemapArtifactStorage {
  return new SitemapArtifactStorage(readStorageConfig());
}

export class SitemapArtifactStorage {
  constructor(private readonly config: SitemapArtifactStorageConfig) {}

  async createPublication(
    declaration: SitemapPublicationDeclaration,
  ): Promise<void> {
    this.assertEnvironment(declaration.environment);
    const normalizedDeclaration = {
      ...declaration,
      publicationType: declaration.publicationType ?? "sitemap",
    };
    const publicationPath = this.publicationPath(declaration.publicationId);

    await mkdir(publicationPath, { recursive: true });
    const existing = await this.readStoredPublicationOrNull(
      declaration.publicationId,
    );
    if (existing) {
      if (!sameDeclaration(existing, normalizedDeclaration)) {
        throw new SitemapArtifactStorageError("publication_conflict");
      }
      return;
    }

    await this.writeJsonAtomic(
      this.publicationMetadataPath(declaration.publicationId),
      {
        ...normalizedDeclaration,
        receivedPaths: [],
      } satisfies StoredPublication,
    );
  }

  async uploadArtifact(
    publicationId: string,
    artifactPath: string,
    contents: Buffer,
    declaredChecksum: string | null,
    contentType: string | null = null,
  ): Promise<void> {
    const publication = await this.readStoredPublication(publicationId);
    const artifact = publication.artifacts.find(
      (entry) => entry.path === artifactPath,
    );
    if (!artifact)
      throw new SitemapArtifactStorageError("artifact_not_declared");
    if (declaredChecksum !== artifact.sha256) {
      throw new SitemapArtifactStorageError("artifact_checksum_mismatch");
    }
    if (contentType !== null && contentType !== artifact.contentType) {
      throw new SitemapArtifactStorageError("artifact_content_type_mismatch");
    }
    if (contents.byteLength > this.config.maxArtifactBytes) {
      throw new SitemapArtifactStorageError("artifact_too_large");
    }
    if (
      publication.publicationType === "robots" &&
      (contents.byteLength > 32 * 1024 || !isValidRobotsText(contents))
    ) {
      throw new SitemapArtifactStorageError("artifact_content_type_mismatch");
    }
    if (
      contents.byteLength !== artifact.size ||
      checksum(contents) !== artifact.sha256
    ) {
      throw new SitemapArtifactStorageError("artifact_checksum_mismatch");
    }

    const artifactFile = this.artifactPath(publicationId, artifactPath);
    try {
      const existing = await readFile(artifactFile);
      if (
        checksum(existing) !== artifact.sha256 ||
        existing.byteLength !== artifact.size
      ) {
        throw new SitemapArtifactStorageError("artifact_conflict");
      }
    } catch (error) {
      if (error instanceof SitemapArtifactStorageError) throw error;
      await this.writeFileAtomic(artifactFile, contents);
    }

    if (!publication.receivedPaths.includes(artifactPath)) {
      await this.writeJsonAtomic(this.publicationMetadataPath(publicationId), {
        ...publication,
        receivedPaths: [...publication.receivedPaths, artifactPath].sort(),
      } satisfies StoredPublication);
    }
  }

  async commitPublication(
    publicationId: string,
  ): Promise<SitemapCurrentManifest> {
    const publication = await this.readStoredPublication(publicationId);
    const publicationType = publication.publicationType ?? "sitemap";
    const current = await this.readCurrentManifestOrNull(
      publication.host,
      publicationType,
    );
    if (current?.publicationId === publicationId) return current;

    if (publication.receivedPaths.length !== publication.artifacts.length) {
      throw new SitemapArtifactStorageError("publication_incomplete");
    }

    for (const artifact of publication.artifacts) {
      const file = this.artifactPath(publicationId, artifact.path);
      try {
        const artifactStat = await stat(file);
        const bytes = await readFile(file);
        if (
          artifactStat.size !== artifact.size ||
          checksum(bytes) !== artifact.sha256
        ) {
          throw new SitemapArtifactStorageError("artifact_checksum_mismatch");
        }
        if (publicationType === "robots" && !isValidRobotsText(bytes)) {
          throw new SitemapArtifactStorageError(
            "artifact_content_type_mismatch",
          );
        }
      } catch (error) {
        if (error instanceof SitemapArtifactStorageError) throw error;
        throw new SitemapArtifactStorageError("publication_incomplete");
      }
    }

    const manifest: SitemapCurrentManifest = {
      artifacts: publication.artifacts,
      committedAt: new Date().toISOString(),
      generatedAt: publication.generatedAt,
      host: publication.host,
      publicationId,
      publicationType,
    };
    await this.writeJsonAtomic(
      this.currentManifestPath(publication.host, publicationType),
      manifest,
    );
    await this.writeJsonAtomic(this.publicationMetadataPath(publicationId), {
      ...publication,
      committedAt: manifest.committedAt,
    } satisfies StoredPublication);

    return manifest;
  }

  async getCurrentManifest(
    host: string,
  ): Promise<SitemapCurrentManifest | null> {
    return this.readCurrentManifestOrNull(normalizeHost(host), "sitemap");
  }

  async readCurrentArtifact(
    host: string,
    artifactPath: string,
  ): Promise<Buffer | null> {
    if (!isSafeSitemapArtifactPath(artifactPath)) return null;
    return this.readArtifactFromCurrentManifest(host, artifactPath, "sitemap");
  }

  async readCurrentRobots(host: string): Promise<Buffer | null> {
    return this.readArtifactFromCurrentManifest(host, "robots.txt", "robots");
  }

  async clearForTests(): Promise<void> {
    await rm(this.environmentRoot(), { force: true, recursive: true });
  }

  private async readArtifactFromCurrentManifest(
    host: string,
    artifactPath: string,
    publicationType: SitemapPublicationType,
  ): Promise<Buffer | null> {
    const manifest = await this.readCurrentManifestOrNull(
      normalizeHost(host),
      publicationType,
    );
    const artifact = manifest?.artifacts.find(
      (entry) => entry.path === artifactPath,
    );
    if (!manifest || !artifact) return null;

    try {
      const bytes = await readFile(
        this.artifactPath(manifest.publicationId, artifact.path),
      );
      if (
        bytes.byteLength !== artifact.size ||
        checksum(bytes) !== artifact.sha256
      )
        return null;
      if (publicationType === "robots" && !isValidRobotsText(bytes))
        return null;

      return bytes;
    } catch {
      return null;
    }
  }

  private assertEnvironment(environment: string): void {
    if (environment !== this.config.environment) {
      throw new SitemapArtifactStorageError("publication_conflict");
    }
  }

  private environmentRoot(): string {
    return path.join(this.config.root, this.config.environment);
  }

  private publicationPath(publicationId: string): string {
    if (!/^[a-f0-9]{32}$/.test(publicationId)) {
      throw new SitemapArtifactStorageError("publication_not_found");
    }
    return path.join(this.environmentRoot(), "runs", publicationId);
  }

  private publicationMetadataPath(publicationId: string): string {
    return path.join(this.publicationPath(publicationId), "publication.json");
  }

  private artifactPath(publicationId: string, artifactPath: string): string {
    if (
      !isSafeSitemapArtifactPath(artifactPath) &&
      artifactPath !== "robots.txt"
    ) {
      throw new SitemapArtifactStorageError("artifact_not_declared");
    }
    return path.join(this.publicationPath(publicationId), artifactPath);
  }

  private currentManifestPath(
    host: string,
    publicationType: SitemapPublicationType,
  ): string {
    const name =
      publicationType === "robots" ? "robots-manifest.json" : "manifest.json";
    return path.join(
      this.environmentRoot(),
      "current",
      normalizeHost(host),
      name,
    );
  }

  private async readStoredPublication(
    publicationId: string,
  ): Promise<StoredPublication> {
    const publication = await this.readStoredPublicationOrNull(publicationId);
    if (!publication)
      throw new SitemapArtifactStorageError("publication_not_found");
    return publication;
  }

  private async readStoredPublicationOrNull(
    publicationId: string,
  ): Promise<StoredPublication | null> {
    try {
      return JSON.parse(
        await readFile(this.publicationMetadataPath(publicationId), "utf8"),
      ) as StoredPublication;
    } catch {
      return null;
    }
  }

  private async readCurrentManifestOrNull(
    host: string,
    publicationType: SitemapPublicationType,
  ): Promise<SitemapCurrentManifest | null> {
    try {
      return JSON.parse(
        await readFile(this.currentManifestPath(host, publicationType), "utf8"),
      ) as SitemapCurrentManifest;
    } catch {
      return null;
    }
  }

  private async writeJsonAtomic(file: string, value: unknown): Promise<void> {
    await this.writeFileAtomic(file, JSON.stringify(value));
  }

  private async writeFileAtomic(
    file: string,
    contents: string | Buffer,
  ): Promise<void> {
    await mkdir(path.dirname(file), { recursive: true });
    const temporary = file + "." + randomUUID() + ".tmp";
    await writeFile(temporary, contents, { mode: 0o640 });
    await rename(temporary, file);
  }
}

type SitemapArtifactStorageConfig = Readonly<{
  environment: string;
  maxArtifactBytes: number;
  root: string;
}>;

function readStorageConfig(): SitemapArtifactStorageConfig {
  const root = process.env.SITEMAP_ARTIFACT_STORAGE_ROOT?.trim();
  const environment = process.env.SITEMAP_ARTIFACT_ENVIRONMENT?.trim();
  const maxArtifactBytes = Number(
    process.env.SITEMAP_ARTIFACT_MAX_BYTES ?? 50 * 1024 * 1024,
  );
  if (
    !root ||
    !path.isAbsolute(root) ||
    !environment ||
    !/^[a-z0-9][a-z0-9-]{0,31}$/.test(environment) ||
    !Number.isSafeInteger(maxArtifactBytes) ||
    maxArtifactBytes < 1
  ) {
    throw new SitemapArtifactStorageError("storage_configuration_invalid");
  }

  return { environment, maxArtifactBytes, root };
}

export function isAuthorizedSitemapPublisher(request: Request): boolean {
  const configured = process.env.SITEMAP_INGESTION_SECRET?.trim();
  const authorization = request.headers.get("authorization");
  if (!configured || !authorization?.startsWith("Bearer ")) return false;

  const supplied = authorization.slice("Bearer ".length);
  const expectedBuffer = Buffer.from(configured);
  const suppliedBuffer = Buffer.from(supplied);
  return (
    expectedBuffer.byteLength === suppliedBuffer.byteLength &&
    timingSafeEqual(expectedBuffer, suppliedBuffer)
  );
}

export function normalizeRequestHost(request: Request): string | null {
  const host = request.headers.get("host");
  if (!host) return null;

  try {
    return normalizeHost(new URL("https://" + host).hostname);
  } catch {
    return null;
  }
}

function normalizeHost(value: string): string {
  const host = value.toLowerCase();
  if (!/^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/.test(host) || host.includes("..")) {
    throw new SitemapArtifactStorageError("publication_not_found");
  }
  return host;
}

function checksum(contents: Buffer): string {
  return createHash("sha256").update(contents).digest("hex");
}

function isValidRobotsText(contents: Buffer): boolean {
  try {
    const text = new TextDecoder("utf-8", { fatal: true }).decode(contents);
    return !/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/u.test(text);
  } catch {
    return false;
  }
}

function sameDeclaration(
  existing: StoredPublication,
  next: SitemapPublicationDeclaration,
): boolean {
  return (
    (existing.publicationType ?? "sitemap") ===
      (next.publicationType ?? "sitemap") &&
    existing.environment === next.environment &&
    existing.generatedAt === next.generatedAt &&
    existing.host === next.host &&
    existing.languageId === next.languageId &&
    existing.publicationId === next.publicationId &&
    existing.salesChannelId === next.salesChannelId &&
    JSON.stringify(existing.artifacts) === JSON.stringify(next.artifacts)
  );
}
