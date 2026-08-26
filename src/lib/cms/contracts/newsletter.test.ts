import { describe, expect, test } from "bun:test";

import { parseCmsNewsletterData } from "@/lib/cms/contracts/newsletter";

const validNewsletterData = {
  buttonLabel: "Subscribe",
  buttonSize: "large",
  description: "Occasional furniture and material guides.",
  errorMessage: "Subscription failed.",
  eyebrow: "Newsletter",
  invalidEmailMessage: "Enter a valid email address.",
  placeholder: "Your email address",
  storefrontUrl: "http://localhost:3000",
  successMessage: "You are subscribed.",
  title: "Useful ideas, occasionally.",
} as const;

describe("parseCmsNewsletterData", () => {
  test("parses a valid newsletter contract", () => {
    expect(parseCmsNewsletterData(validNewsletterData)).toEqual(
      validNewsletterData,
    );
  });

  test("normalizes an unknown button size", () => {
    expect(
      parseCmsNewsletterData({
        ...validNewsletterData,
        buttonSize: "unexpected",
      })?.buttonSize,
    ).toBe("medium");
  });

  test("rejects missing required content", () => {
    expect(
      parseCmsNewsletterData({
        ...validNewsletterData,
        successMessage: "",
      }),
    ).toBeNull();
  });

  test("rejects a non-HTTP storefront URL", () => {
    expect(
      parseCmsNewsletterData({
        ...validNewsletterData,
        storefrontUrl: "javascript:alert(1)",
      }),
    ).toBeNull();
  });
});
