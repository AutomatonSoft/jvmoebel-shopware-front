import { existsSync } from "node:fs";
import path from "node:path";

import { describe, expect, test } from "bun:test";

import { parseCmsCategoryRailData } from "@/features/cms/contracts/category-rail";
import { parseCmsHeroData } from "@/features/cms/contracts/hero";
import { parseCmsNewsletterData } from "@/features/cms/contracts/newsletter";
import { parseCmsProductGridData } from "@/features/cms/contracts/product-grid";
import type { CmsContractResult } from "@/features/cms/contracts/result";
import { parseCmsRoomGridData } from "@/features/cms/contracts/room-grid";
import { homeCmsPageMock } from "@/features/cms/fixtures/home-page";
import type { CmsPage } from "@/features/cms/model/page";

type CmsFixtureParser = (value: unknown) => CmsContractResult<unknown>;

const fixtureParsers: Record<string, CmsFixtureParser | undefined> = {
  "jv-category-rail": parseCmsCategoryRailData,
  "jv-hero": parseCmsHeroData,
  "jv-newsletter": parseCmsNewsletterData,
  "jv-product-grid": parseCmsProductGridData,
  "jv-room-grid": parseCmsRoomGridData,
};

function collectLocalImagePaths(value: unknown): string[] {
  if (typeof value === "string") {
    return value.startsWith("/images/") ? [value] : [];
  }

  if (!value || typeof value !== "object") {
    return [];
  }

  return Object.values(value).flatMap(collectLocalImagePaths);
}

describe("homeCmsPageMock", () => {
  const page: CmsPage = homeCmsPageMock;
  const slots = page.sections.flatMap((section) =>
    section.blocks.flatMap((block) => block.slots),
  );

  test("satisfies every registered CMS element contract", () => {
    for (const slot of slots) {
      const parser = fixtureParsers[slot.type];

      if (!parser) {
        throw new Error(
          `Missing fixture parser for CMS slot type ${slot.type}.`,
        );
      }

      const result = parser(slot.data);

      expect(result.issues).toEqual([]);
      expect(result.data).not.toBeNull();
    }
  });

  test("references existing local images", () => {
    const imagePaths = new Set(collectLocalImagePaths(homeCmsPageMock));

    expect(imagePaths.size).toBeGreaterThan(0);

    for (const imagePath of imagePaths) {
      const publicPath = path.join(
        process.cwd(),
        "public",
        imagePath.replace(/^\//, ""),
      );

      expect(existsSync(publicPath)).toBe(true);
    }
  });
});
