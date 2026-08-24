import { describe, expect, test } from "bun:test";

import { subscribeToNewsletter } from "@/app/actions/newsletter";

describe("subscribeToNewsletter", () => {
  test("rejects an invalid email address", async () => {
    const formData = new FormData();
    formData.set("email", "not-an-email");

    const state = await subscribeToNewsletter(
      "https://jvmoebel.de",
      { status: "idle" },
      formData,
    );

    expect(state).toEqual({ status: "invalid" });
  });

  test("rejects an invalid storefront URL", async () => {
    const formData = new FormData();
    formData.set("email", "reader@example.com");

    const state = await subscribeToNewsletter(
      "javascript:alert(1)",
      { status: "idle" },
      formData,
    );

    expect(state).toEqual({ status: "invalid" });
  });
});
