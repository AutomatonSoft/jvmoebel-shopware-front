import { describe, expect, test } from "bun:test";

import { parseCmsNewsletterData } from "@/features/cms/contracts/newsletter";

const validNewsletterData = {
  buttonLabel: "Subscribe",
  buttonSize: "large",
  description: "Occasional furniture and material guides.",
  errorMessage: "Subscription failed.",
  eyebrow: "Newsletter",
  invalidEmailMessage: "Enter a valid email address.",
  placeholder: "Your email address",
  successMessage: "You are subscribed.",
  title: "Useful ideas, occasionally.",
} as const;

describe("parseCmsNewsletterData", () => {
  test("parses a valid newsletter contract", () => {
    expect(parseCmsNewsletterData(validNewsletterData)).toEqual({
      data: validNewsletterData,
      issues: [],
    });
  });

  test("normalizes an unknown button size", () => {
    expect(
      parseCmsNewsletterData({
        ...validNewsletterData,
        buttonSize: "unexpected",
      }).data?.buttonSize,
    ).toBe("medium");
  });

  test("rejects missing required content", () => {
    expect(
      parseCmsNewsletterData({
        ...validNewsletterData,
        successMessage: "",
      }).data,
    ).toBeNull();
  });
});
