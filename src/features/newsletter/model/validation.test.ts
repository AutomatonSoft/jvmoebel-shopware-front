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
      parseNewsletterSubscription(createFormData(" reader@example.com ")),
    ).toEqual({
      email: "reader@example.com",
    });
  });

  test("rejects an invalid email address", () => {
    expect(
      parseNewsletterSubscription(createFormData("not-an-email")),
    ).toBeNull();
  });
});
