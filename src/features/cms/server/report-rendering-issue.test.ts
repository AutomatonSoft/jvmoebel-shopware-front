import { describe, expect, spyOn, test } from "bun:test";

import { reportCmsRenderingIssue } from "@/features/cms/server/report-rendering-issue";

describe("reportCmsRenderingIssue", () => {
  test("reports a structured issue without including CMS slot data", () => {
    const consoleError = spyOn(console, "error").mockImplementation(() => {});

    try {
      reportCmsRenderingIssue({
        code: "unsupported-element",
        message: "No renderer is registered for this CMS element type.",
        slot: {
          id: "unknown-slot",
          slot: "content",
          type: "unknown-element",
        },
      });

      expect(consoleError).toHaveBeenCalledWith("CMS rendering issue.", {
        code: "unsupported-element",
        message: "No renderer is registered for this CMS element type.",
        slot: {
          id: "unknown-slot",
          name: "content",
          type: "unknown-element",
        },
      });
    } finally {
      consoleError.mockRestore();
    }
  });
});
