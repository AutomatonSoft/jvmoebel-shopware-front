import { afterEach, describe, expect, test } from "bun:test";

import { POST } from "@/app/store-api/contact/submit/route";

const originalShopwareUseMocks = process.env.SHOPWARE_USE_MOCKS;

function setEnvironmentVariable(name: string, value: string | undefined) {
  if (value === undefined) {
    delete process.env[name];
  } else {
    process.env[name] = value;
  }
}

function createRequest(email = "kunde@example.com") {
  const formData = new FormData();
  formData.set("address", "Musterstraße 12, 12345 Berlin");
  formData.set("comment", "Ich brauche eine Beratung.");
  formData.set("email", email);
  formData.set("firstName", "Max");
  formData.set("lastName", "Mustermann");

  return new Request("http://localhost:3000/store-api/contact/submit", {
    body: formData,
    method: "POST",
  });
}

afterEach(() => {
  setEnvironmentVariable("SHOPWARE_USE_MOCKS", originalShopwareUseMocks);
});

describe("POST /store-api/contact/submit", () => {
  test("rejects invalid contact input", async () => {
    const response = await POST(createRequest("not-an-email"));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ status: "invalid" });
  });

  test("accepts a complete inquiry in mock mode", async () => {
    process.env.SHOPWARE_USE_MOCKS = "true";

    const response = await POST(createRequest());

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: "success" });
  });
});
