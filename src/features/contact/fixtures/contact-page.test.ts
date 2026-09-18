import { describe, expect, test } from "bun:test";

import { parseCmsContactFormData } from "@/features/cms/contracts/contact-form";
import { contactCmsPageMock } from "@/features/contact/fixtures/contact-page";

describe("contactCmsPageMock", () => {
  test("satisfies the standard Shopware contact form contract", () => {
    const slot = contactCmsPageMock.sections[0]?.blocks[0]?.slots[0];

    expect(slot).toBeDefined();
    expect(parseCmsContactFormData(slot?.config)).toEqual({
      data: { title: "Kontaktieren Sie uns" },
      issues: [],
    });
  });
});
