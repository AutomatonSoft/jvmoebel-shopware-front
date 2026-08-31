import { describe, expect, spyOn, test } from "bun:test";

import { reportStorefrontBrandingIssues } from "@/features/storefront-shell/server/report-branding-issues";

describe("reportStorefrontBrandingIssues", () => {
  test("reports field diagnostics without the branding payload", () => {
    const consoleError = spyOn(console, "error").mockImplementation(() => {});

    try {
      reportStorefrontBrandingIssues([
        {
          message: "Configured logo width must be a positive finite number.",
          path: "jvStorefrontBranding.logo.width",
        },
      ]);

      expect(consoleError).toHaveBeenCalledWith("Storefront branding issue.", {
        code: "invalid-branding-configuration",
        issues: [
          {
            message: "Configured logo width must be a positive finite number.",
            path: "jvStorefrontBranding.logo.width",
          },
        ],
      });
    } finally {
      consoleError.mockRestore();
    }
  });
});
