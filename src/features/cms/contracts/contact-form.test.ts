import { describe, expect, test } from "bun:test";

import { parseCmsContactFormData } from "@/features/cms/contracts/contact-form";

describe("parseCmsContactFormData", () => {
  test("parses the standard Shopware contact form configuration", () => {
    expect(
      parseCmsContactFormData({
        title: { value: "Schreiben Sie uns" },
        type: { value: "contact" },
      }),
    ).toEqual({
      data: { title: "Schreiben Sie uns" },
      issues: [],
    });
  });

  test("uses a default title when the CMS title is empty", () => {
    expect(
      parseCmsContactFormData({
        title: { value: "" },
        type: { value: "contact" },
      }).data,
    ).toEqual({ title: "Kontakt" });
  });

  test("rejects another standard form type", () => {
    expect(
      parseCmsContactFormData({ type: { value: "newsletter" } }).data,
    ).toBeNull();
  });
});
