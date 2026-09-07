import { describe, expect, spyOn, test } from "bun:test";

import {
  reportCmsContractIssues,
  reportCmsRenderingIssue,
} from "@/features/cms/server/report-rendering-issue";

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

  test("reports contract issues with their field paths", () => {
    const consoleError = spyOn(console, "error").mockImplementation(() => {});

    try {
      reportCmsContractIssues(
        {
          id: "hero-slot",
          slot: "content",
          type: "jv-hero",
        },
        [{ message: "Required field is missing.", path: "image.url" }],
      );

      expect(consoleError).toHaveBeenCalledWith("CMS rendering issue.", {
        code: "invalid-element-data",
        issues: [{ message: "Required field is missing.", path: "image.url" }],
        message: "CMS element data does not match its rendering contract.",
        slot: {
          id: "hero-slot",
          name: "content",
          type: "jv-hero",
        },
      });
    } finally {
      consoleError.mockRestore();
    }
  });
});
