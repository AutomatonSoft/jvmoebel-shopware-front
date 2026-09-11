import { afterEach, describe, expect, test } from "bun:test";

import { POST } from "@/app/store-api/newsletter/subscribe/route";

const originalShopwareUseMocks = process.env.SHOPWARE_USE_MOCKS;

function setEnvironmentVariable(name: string, value: string | undefined) {
  if (value === undefined) {
    delete process.env[name];
  } else {
    process.env[name] = value;
  }
}

function createRequest(email: string) {
  const formData = new FormData();
  formData.set("email", email);

  return new Request("http://localhost:3000/store-api/newsletter/subscribe", {
    body: formData,
    method: "POST",
  });
}

afterEach(() => {
  setEnvironmentVariable("SHOPWARE_USE_MOCKS", originalShopwareUseMocks);
});

describe("POST /store-api/newsletter/subscribe", () => {
  test("rejects an invalid email address", async () => {
    const response = await POST(createRequest("not-an-email"));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ status: "invalid" });
  });

  test("accepts a valid subscription in mock mode", async () => {
    process.env.SHOPWARE_USE_MOCKS = "true";

    const response = await POST(createRequest("reader@example.com"));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: "success" });
  });
});
