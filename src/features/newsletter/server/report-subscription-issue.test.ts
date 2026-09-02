import { describe, expect, spyOn, test } from "bun:test";

import { reportNewsletterSubscriptionIssue } from "@/features/newsletter/server/report-subscription-issue";

describe("reportNewsletterSubscriptionIssue", () => {
  test("reports a rejected mock write", () => {
    const consoleError = spyOn(console, "error").mockImplementation(() => {});

    try {
      reportNewsletterSubscriptionIssue({ code: "mock-write-rejected" });

      expect(consoleError).toHaveBeenCalledWith(
        "Newsletter subscription issue.",
        { code: "mock-write-rejected" },
      );
    } finally {
      consoleError.mockRestore();
    }
  });

  test("reports an unsuccessful response with its Shopware status", () => {
    const consoleError = spyOn(console, "error").mockImplementation(() => {});

    try {
      reportNewsletterSubscriptionIssue({
        code: "unsuccessful-response",
        shopwareStatus: "notSet",
      });

      expect(consoleError).toHaveBeenCalledWith(
        "Newsletter subscription issue.",
        {
          code: "unsuccessful-response",
          shopwareStatus: "notSet",
        },
      );
    } finally {
      consoleError.mockRestore();
    }
  });

  test("reports only the message from a thrown request error", () => {
    const consoleError = spyOn(console, "error").mockImplementation(() => {});

    try {
      reportNewsletterSubscriptionIssue({
        cause: new Error("Shopware is unavailable."),
        code: "request-failed",
      });

      expect(consoleError).toHaveBeenCalledWith(
        "Newsletter subscription issue.",
        {
          cause: "Shopware is unavailable.",
          code: "request-failed",
        },
      );
    } finally {
      consoleError.mockRestore();
    }
  });
});
