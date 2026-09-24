import { createHash } from "node:crypto";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterEach, describe, expect, test } from "bun:test";

import { POST as commit } from "@/app/api/internal/sitemap-publications/[publicationId]/commit/route";
import { PUT as upload } from "@/app/api/internal/sitemap-publications/[publicationId]/artifacts/[...artifactPath]/route";
import { POST as create } from "@/app/api/internal/sitemap-publications/route";
import {
  getSitemapArtifactResponse,
  getSitemapIndexResponse,
} from "@/features/sitemap/server/sitemap-public";
import {
  getSitemapArtifactStorage,
  SitemapArtifactStorageError,
} from "@/features/sitemap/server/sitemap-artifact-storage";
import {
  isSafeSitemapArtifactPath,
  type SitemapPublicationDeclaration,
} from "@/features/sitemap/model/publication";

const originalEnvironment = {
  environment: process.env.SITEMAP_ARTIFACT_ENVIRONMENT,
  maxBytes: process.env.SITEMAP_ARTIFACT_MAX_BYTES,
  root: process.env.SITEMAP_ARTIFACT_STORAGE_ROOT,
  secret: process.env.SITEMAP_INGESTION_SECRET,
};

const firstPublicationId = "11111111111111111111111111111111";
const secondPublicationId = "22222222222222222222222222222222";
const salesChannelId = "33333333333333333333333333333333";
const languageId = "44444444444444444444444444444444";
let storageRoot: string | undefined;

afterEach(async () => {
  if (storageRoot) await rm(storageRoot, { force: true, recursive: true });
  storageRoot = undefined;
  setEnvironment(
    "SITEMAP_ARTIFACT_ENVIRONMENT",
    originalEnvironment.environment,
  );
  setEnvironment("SITEMAP_ARTIFACT_MAX_BYTES", originalEnvironment.maxBytes);
  setEnvironment("SITEMAP_ARTIFACT_STORAGE_ROOT", originalEnvironment.root);
  setEnvironment("SITEMAP_INGESTION_SECRET", originalEnvironment.secret);
});

describe("sitemap artifact storage", () => {
  test("validates artifact paths before they can reach storage", () => {
    expect(isSafeSitemapArtifactPath("sitemap-1.xml.gz")).toBe(true);
    expect(isSafeSitemapArtifactPath("../manifest.json")).toBe(false);
    expect(isSafeSitemapArtifactPath("%2fetc.xml.gz")).toBe(false);
    expect(isSafeSitemapArtifactPath("nested/file.xml.gz")).toBe(false);
  });

  test("commits only a complete verified artifact set and preserves the previous current version", async () => {
    const storage = await configuredStorage();
    const previous = declaration(
      firstPublicationId,
      "www.jvmoebel.de",
      Buffer.from("previous sitemap"),
    );
    await storage.createPublication(previous);
    await storage.uploadArtifact(
      previous.publicationId,
      previous.artifacts[0].path,
      Buffer.from("previous sitemap"),
      previous.artifacts[0].sha256,
    );
    await storage.commitPublication(previous.publicationId);

    const next = declaration(
      secondPublicationId,
      "www.jvmoebel.de",
      Buffer.from("next sitemap"),
    );
    await storage.createPublication(next);
    try {
      await storage.commitPublication(next.publicationId);
      throw new Error("Expected incomplete publication to fail.");
    } catch (error) {
      expect(error).toBeInstanceOf(SitemapArtifactStorageError);
      expect((error as SitemapArtifactStorageError).code).toBe(
        "publication_incomplete",
      );
    }

    expect(
      (await storage.getCurrentManifest("www.jvmoebel.de"))?.publicationId,
    ).toBe(firstPublicationId);
    await storage.uploadArtifact(
      next.publicationId,
      next.artifacts[0].path,
      Buffer.from("next sitemap"),
      next.artifacts[0].sha256,
    );
    const committed = await storage.commitPublication(next.publicationId);
    expect(committed.publicationId).toBe(secondPublicationId);
    expect(
      (await getSitemapArtifactStorage().getCurrentManifest("www.jvmoebel.de"))
        ?.publicationId,
    ).toBe(secondPublicationId);
  });

  test("makes repeated create, upload and commit idempotent", async () => {
    const storage = await configuredStorage();
    const item = declaration(
      firstPublicationId,
      "www.jvmoebel.de",
      Buffer.from("stable sitemap"),
    );
    await storage.createPublication(item);
    await storage.createPublication(item);
    await storage.uploadArtifact(
      item.publicationId,
      item.artifacts[0].path,
      Buffer.from("stable sitemap"),
      item.artifacts[0].sha256,
    );
    await storage.uploadArtifact(
      item.publicationId,
      item.artifacts[0].path,
      Buffer.from("stable sitemap"),
      item.artifacts[0].sha256,
    );
    const first = await storage.commitPublication(item.publicationId);
    const second = await storage.commitPublication(item.publicationId);
    expect(second).toEqual(first);
  });

  test("rejects a mismatched checksum without exposing an artifact", async () => {
    const storage = await configuredStorage();
    const item = declaration(
      firstPublicationId,
      "www.jvmoebel.de",
      Buffer.from("expected sitemap"),
    );
    await storage.createPublication(item);
    try {
      await storage.uploadArtifact(
        item.publicationId,
        item.artifacts[0].path,
        Buffer.from("different sitemap"),
        item.artifacts[0].sha256,
      );
      throw new Error("Expected checksum mismatch to fail.");
    } catch (error) {
      expect((error as SitemapArtifactStorageError).code).toBe(
        "artifact_checksum_mismatch",
      );
    }
    expect(
      await storage.readCurrentArtifact(
        "www.jvmoebel.de",
        item.artifacts[0].path,
      ),
    ).toBeNull();
  });

  test("rejects an upload that was not declared by the publication", async () => {
    const storage = await configuredStorage();
    const item = declaration(
      firstPublicationId,
      "www.jvmoebel.de",
      Buffer.from("declared sitemap"),
    );
    await storage.createPublication(item);

    await expect(
      storage.uploadArtifact(
        item.publicationId,
        "unknown.xml.gz",
        Buffer.from("unknown sitemap"),
        item.artifacts[0].sha256,
      ),
    ).rejects.toMatchObject({
      code: "artifact_not_declared",
    });
  });

  test("serves only the current host artifacts", async () => {
    const storage = await configuredStorage();
    const german = declaration(
      firstPublicationId,
      "www.jvmoebel.de",
      Buffer.from("german sitemap"),
    );
    const austrian = declaration(
      secondPublicationId,
      "www.jvmoebel.at",
      Buffer.from("austrian sitemap"),
    );
    for (const item of [german, austrian]) {
      await storage.createPublication(item);
      await storage.uploadArtifact(
        item.publicationId,
        item.artifacts[0].path,
        Buffer.from(
          item.publicationId === german.publicationId
            ? "german sitemap"
            : "austrian sitemap",
        ),
        item.artifacts[0].sha256,
      );
      await storage.commitPublication(item.publicationId);
    }

    const index = await getSitemapIndexResponse(
      request("https://www.jvmoebel.de/sitemap.xml"),
    );
    expect(index.status).toBe(200);
    expect(await index.text()).toContain("https://www.jvmoebel.de/sitemap/");
    expect(index.headers.get("content-type")).toBe(
      "application/xml; charset=utf-8",
    );
    const artifact = await getSitemapArtifactResponse(
      request("https://www.jvmoebel.de/sitemap/foreign.xml.gz"),
      austrian.artifacts[0].path,
    );
    expect(artifact.status).toBe(404);
  });

  test("requires a private publisher secret and supports the HTTP ingestion lifecycle", async () => {
    const declarationBody = declaration(
      firstPublicationId,
      "www.jvmoebel.de",
      Buffer.from("route sitemap"),
    );
    const unauthorized = await create(
      new Request("https://frontend/api/internal/sitemap-publications", {
        body: JSON.stringify(declarationBody),
        headers: { "content-type": "application/json" },
        method: "POST",
      }),
    );
    expect(unauthorized.status).toBe(401);

    await configuredStorage();
    const authorization = { authorization: "Bearer publisher-secret" };
    const created = await create(
      new Request("https://frontend/api/internal/sitemap-publications", {
        body: JSON.stringify(declarationBody),
        headers: { ...authorization, "content-type": "application/json" },
        method: "POST",
      }),
    );
    expect(created.status).toBe(201);
    const contents = Buffer.from("route sitemap");
    const uploaded = await upload(
      new Request(
        "https://frontend/api/internal/sitemap-publications/id/artifacts/file",
        {
          body: contents,
          headers: {
            ...authorization,
            "content-length": String(contents.byteLength),
            "content-type": "application/gzip",
            "x-checksum-sha256": declarationBody.artifacts[0].sha256,
          },
          method: "PUT",
        },
      ),
      {
        params: Promise.resolve({
          artifactPath: [declarationBody.artifacts[0].path],
          publicationId: declarationBody.publicationId,
        }),
      },
    );
    expect(uploaded.status).toBe(204);
    const committed = await commit(
      new Request(
        "https://frontend/api/internal/sitemap-publications/id/commit",
        { headers: authorization, method: "POST" },
      ),
      {
        params: Promise.resolve({
          publicationId: declarationBody.publicationId,
        }),
      },
    );
    expect(committed.status).toBe(200);
    expect(await committed.json()).toMatchObject({
      destinationVersion: declarationBody.publicationId,
    });
  });

  test("returns 404 from public routes when storage is not configured", async () => {
    delete process.env.SITEMAP_ARTIFACT_STORAGE_ROOT;
    delete process.env.SITEMAP_ARTIFACT_ENVIRONMENT;

    expect(
      (
        await getSitemapIndexResponse(
          request("https://www.jvmoebel.de/sitemap.xml"),
        )
      ).status,
    ).toBe(404);
    expect(
      (
        await getSitemapArtifactResponse(
          request("https://www.jvmoebel.de/sitemap/file.xml.gz"),
          "file.xml.gz",
        )
      ).status,
    ).toBe(404);
  });
});

async function configuredStorage() {
  storageRoot = await mkdtemp(path.join(tmpdir(), "jv-sitemap-test-"));
  process.env.SITEMAP_ARTIFACT_STORAGE_ROOT = storageRoot;
  process.env.SITEMAP_ARTIFACT_ENVIRONMENT = "test";
  process.env.SITEMAP_ARTIFACT_MAX_BYTES = "1048576";
  process.env.SITEMAP_INGESTION_SECRET = "publisher-secret";
  return getSitemapArtifactStorage();
}

function declaration(
  publicationId: string,
  host: string,
  bytes: Buffer,
): SitemapPublicationDeclaration {
  return {
    artifacts: [
      {
        contentType: "application/gzip",
        path: `${publicationId}-sitemap.xml.gz`,
        sha256: createHash("sha256").update(bytes).digest("hex"),
        size: bytes.byteLength,
      },
    ],
    environment: "test",
    generatedAt: "2026-09-17T10:00:00.000Z",
    host,
    languageId,
    publicationId,
    salesChannelId,
  };
}

function request(url: string): Request {
  return new Request(url, { headers: { host: new URL(url).host } });
}

function setEnvironment(name: string, value: string | undefined) {
  if (value === undefined) delete process.env[name];
  else process.env[name] = value;
}
