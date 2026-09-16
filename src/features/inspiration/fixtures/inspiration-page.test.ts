import { existsSync } from "node:fs";
import path from "node:path";

import { describe, expect, test } from "bun:test";

import { parseCmsChipRailData } from "@/features/cms/contracts/chip-rail";
import { parseCmsColorWorldPickerData } from "@/features/cms/contracts/color-world-picker";
import { parseCmsCrossRoomSectionData } from "@/features/cms/contracts/cross-room-section";
import { parseCmsGuideHubCardsData } from "@/features/cms/contracts/guide-hub-cards";
import { parseCmsHeroData } from "@/features/cms/contracts/hero";
import { parseCmsInstagramStyleData } from "@/features/cms/contracts/instagram-style";
import { parseCmsNewsletterData } from "@/features/cms/contracts/newsletter";
import type { CmsContractResult } from "@/features/cms/contracts/result";
import { parseCmsShopTheLookData } from "@/features/cms/contracts/shop-the-look";
import { parseCmsTrendLookGridData } from "@/features/cms/contracts/trend-look-grid";
import { inspirationCmsPageMock } from "@/features/inspiration/fixtures/inspiration-page";

type CmsFixtureParser = (value: unknown) => CmsContractResult<unknown>;

const fixtureParsers: Record<string, CmsFixtureParser | undefined> = {
  "jv-chip-rail": parseCmsChipRailData,
  "jv-color-world-picker": parseCmsColorWorldPickerData,
  "jv-cross-room-section": parseCmsCrossRoomSectionData,
  "jv-guide-hub-cards": parseCmsGuideHubCardsData,
  "jv-hero": parseCmsHeroData,
  "jv-instagram-style": parseCmsInstagramStyleData,
  "jv-newsletter": parseCmsNewsletterData,
  "jv-shop-the-look": parseCmsShopTheLookData,
  "jv-trend-look-grid": parseCmsTrendLookGridData,
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

describe("inspirationCmsPageMock", () => {
  const slots = inspirationCmsPageMock.sections.flatMap((section) =>
    section.blocks.flatMap((block) => block.slots),
  );

  test("satisfies every CMS element contract", () => {
    for (const slot of slots) {
      const parser = fixtureParsers[slot.type];

      if (!parser) {
        throw new Error("Missing fixture parser for " + slot.type + ".");
      }

      const result = parser(slot.data);

      expect(result.issues).toEqual([]);
      expect(result.data).not.toBeNull();
    }
  });

  test("references existing local images", () => {
    const imagePaths = new Set(collectLocalImagePaths(inspirationCmsPageMock));

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

  test("keeps CMS block positions unique and ordered", () => {
    const positions = inspirationCmsPageMock.sections[0]?.blocks.map(
      (block) => block.position,
    );

    expect(positions).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    expect(new Set(positions).size).toBe(positions?.length);
  });
});
