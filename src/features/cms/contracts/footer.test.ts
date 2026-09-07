import { describe, expect, test } from "bun:test";

import { parseCmsFooterData } from "@/features/cms/contracts/footer";
import { defaultStorefrontFooterContent } from "@/features/storefront-shell/fixtures/footer";

describe("parseCmsFooterData", () => {
  test("accepts the complete footer CMS contract", () => {
    expect(parseCmsFooterData(defaultStorefrontFooterContent)).toEqual({
      data: defaultStorefrontFooterContent,
      issues: [],
    });
  });

  test("rejects an incomplete footer contract", () => {
    const result = parseCmsFooterData({
      ...defaultStorefrontFooterContent,
      about: { ...defaultStorefrontFooterContent.about, title: "" },
    });

    expect(result.data).toBeNull();
    expect(result.issues).toContainEqual({
      message: "Value must be a non-empty string.",
      path: "about.title",
    });
  });

  test("omits unsafe social links without rejecting valid content", () => {
    const result = parseCmsFooterData({
      ...defaultStorefrontFooterContent,
      socialLinks: [
        ...defaultStorefrontFooterContent.socialLinks,
        {
          id: "unsafe",
          label: "Unsafe",
          media: { url: "/images/icons/facebook.png" },
          url: "javascript:alert(1)",
        },
      ],
    });

    expect(result.data?.socialLinks).toEqual(
      defaultStorefrontFooterContent.socialLinks,
    );
    expect(result.issues).toContainEqual({
      message: "Social link URL must use HTTP or HTTPS.",
      path: `socialLinks[${defaultStorefrontFooterContent.socialLinks.length}].url`,
    });
  });
});
