import { afterEach, describe, expect, test } from "bun:test";

import { subscribeToNewsletter } from "@/features/newsletter/server/subscribe";

const originalShopwareUseMocks = process.env.SHOPWARE_USE_MOCKS;

function setEnvironmentVariable(name: string, value: string | undefined) {
  if (value === undefined) {
    delete process.env[name];
  } else {
    process.env[name] = value;
  }
}

function createValidFormData() {
  const formData = new FormData();
  formData.set("email", "reader@example.com");

  return formData;
}

afterEach(() => {
  setEnvironmentVariable("SHOPWARE_USE_MOCKS", originalShopwareUseMocks);
});

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

  test("simulates success in mock mode", async () => {
    process.env.SHOPWARE_USE_MOCKS = "true";

    const state = await subscribeToNewsletter(
      "https://jvmoebel.de",
      { status: "idle" },
      createValidFormData(),
    );

    expect(state).toEqual({ status: "success" });
  });
});
