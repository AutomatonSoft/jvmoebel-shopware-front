import { existsSync } from "node:fs";
import path from "node:path";

import { describe, expect, test } from "bun:test";

import { parseCmsHomeEditorialData } from "@/features/cms/contracts/home-editorial";
import { parseCmsImageData } from "@/features/cms/contracts/image";
import { parseCmsPageHeaderData } from "@/features/cms/contracts/page-header";
import type { CmsContractResult } from "@/features/cms/contracts/result";
import { parseCmsWhyJvmoebelData } from "@/features/cms/contracts/why-jvmoebel";
import { aboutCmsPageMock } from "@/features/about/fixtures/about-page";
import type { CmsSlot } from "@/features/cms/model/page";

type CmsFixtureParser = (slot: CmsSlot) => CmsContractResult<unknown>;

describe("aboutCmsPageMock", () => {
  const slots = aboutCmsPageMock.sections.flatMap((section) =>
    section.blocks.flatMap((block) => block.slots),
  );

  test("satisfies every CMS element contract", () => {
    const parsers: Record<string, CmsFixtureParser | undefined> = {
      "jv-home-editorial": (slot: (typeof slots)[number]) =>
        parseCmsHomeEditorialData(slot.data),
      "jv-page-header": (slot: (typeof slots)[number]) =>
        parseCmsPageHeaderData(slot.data),
      "jv-why-jvmoebel": (slot: (typeof slots)[number]) =>
        parseCmsWhyJvmoebelData(slot.data),
      image: parseCmsImageData,
    };

    for (const slot of slots) {
      const parser = parsers[slot.type];

      if (!parser) {
        throw new Error(`Missing fixture parser for CMS slot ${slot.type}.`);
      }

      const result = parser(slot);

      expect(result.issues).toEqual([]);
      expect(result.data).not.toBeNull();
    }
  });

  test("references the copied source image", () => {
    const imagePath = path.join(
      process.cwd(),
      "public/images/about/about-showroom.png",
    );

    expect(existsSync(imagePath)).toBe(true);
  });
});
