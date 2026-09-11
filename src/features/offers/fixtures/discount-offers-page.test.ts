import { existsSync } from "node:fs";
import path from "node:path";

import { describe, expect, test } from "bun:test";

import { parseCmsBenefitStripData } from "@/features/cms/contracts/benefit-strip";
import { parseCmsCategoryRailData } from "@/features/cms/contracts/category-rail";
import { parseCmsFaqData } from "@/features/cms/contracts/faq";
import { parseCmsHeroData } from "@/features/cms/contracts/hero";
import { parseCmsHomeEditorialData } from "@/features/cms/contracts/home-editorial";
import { parseCmsPageHeaderData } from "@/features/cms/contracts/page-header";
import { parseCmsProductGridData } from "@/features/cms/contracts/product-grid";
import { parseCmsPromoBannerData } from "@/features/cms/contracts/promo-banner";
import type { CmsContractResult } from "@/features/cms/contracts/result";
import { discountOffersCmsPageMock } from "@/features/offers/fixtures/discount-offers-page";

type CmsFixtureParser = (value: unknown) => CmsContractResult<unknown>;

const fixtureParsers: Record<string, CmsFixtureParser | undefined> = {
  "jv-benefit-strip": parseCmsBenefitStripData,
  "jv-category-rail": parseCmsCategoryRailData,
  "jv-faq": parseCmsFaqData,
  "jv-hero": parseCmsHeroData,
  "jv-home-editorial": parseCmsHomeEditorialData,
  "jv-page-header": parseCmsPageHeaderData,
  "jv-product-grid": parseCmsProductGridData,
  "jv-promo-banner": parseCmsPromoBannerData,
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

describe("discountOffersCmsPageMock", () => {
  const slots = discountOffersCmsPageMock.sections.flatMap((section) =>
    section.blocks.flatMap((block) => block.slots),
  );

  test("satisfies every CMS element contract", () => {
    for (const slot of slots) {
      const parser = fixtureParsers[slot.type];

      if (!parser) {
        throw new Error(`Missing fixture parser for ${slot.type}.`);
      }

      const result = parser(slot.data);

      expect(result.issues).toEqual([]);
      expect(result.data).not.toBeNull();
    }
  });

  test("references existing local images", () => {
    const imagePaths = new Set(
      collectLocalImagePaths(discountOffersCmsPageMock),
    );

    expect(imagePaths.size).toBeGreaterThan(0);

    for (const imagePath of imagePaths) {
      expect(
        existsSync(
          path.join(process.cwd(), "public", imagePath.replace(/^\//, "")),
        ),
      ).toBe(true);
    }
  });

  test("keeps the offers page order and manual product selection", () => {
    expect(slots.map((slot) => slot.type)).toEqual([
      "jv-page-header",
      "jv-hero",
      "jv-category-rail",
      "jv-product-grid",
      "jv-promo-banner",
      "jv-benefit-strip",
      "jv-faq",
      "jv-home-editorial",
    ]);

    const productGridSlot = slots.find(
      (slot) => slot.type === "jv-product-grid",
    );
    const productGrid = parseCmsProductGridData(productGridSlot?.data);

    expect(productGrid.data?.layout).toBe("rail");
    expect(productGrid.data?.anchorId).toBe("sale-products");
    expect(productGrid.data?.products.map((product) => product.id)).toEqual([
      "alba",
      "noma",
      "forma",
      "mira",
      "aura",
      "luma",
      "koto",
      "linea",
    ]);
  });
});
