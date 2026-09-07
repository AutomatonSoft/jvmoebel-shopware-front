import { describe, expect, test } from "bun:test";

import { parseNewsletterSubscription } from "@/features/newsletter/model/validation";

function createFormData(email: string): FormData {
  const formData = new FormData();
  formData.set("email", email);

  return formData;
}

describe("parseNewsletterSubscription", () => {
  test("normalizes valid subscription input", () => {
    expect(
      parseNewsletterSubscription(
        "https://jvmoebel.de/newsletter?source=footer",
        createFormData(" reader@example.com "),
      ),
    ).toEqual({
      email: "reader@example.com",
      storefrontUrl: "https://jvmoebel.de",
    });
  });

  test("rejects an invalid email address", () => {
    expect(
      parseNewsletterSubscription(
        "https://jvmoebel.de",
        createFormData("not-an-email"),
      ),
    ).toBeNull();
  });

  test("rejects a non-HTTP storefront URL", () => {
    expect(
      parseNewsletterSubscription(
        "javascript:alert(1)",
        createFormData("reader@example.com"),
      ),
    ).toBeNull();
  });
});
