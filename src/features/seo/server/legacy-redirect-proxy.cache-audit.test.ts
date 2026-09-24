import { expect, mock, spyOn, test } from "bun:test";
import { NextRequest } from "next/server";
import { handleLegacyRedirectProxyRequest } from "./legacy-redirect-proxy";

test("T07: repeated negative lookups are cached briefly and expire within 60 seconds", async () => {
  const lookup = mock(async () => null);
  const url = "https://audit.test/no-redirect";
  const first = await handleLegacyRedirectProxyRequest(
    new NextRequest(url),
    lookup,
  );
  const second = await handleLegacyRedirectProxyRequest(
    new NextRequest(url),
    lookup,
  );
  expect(first.headers.get("x-middleware-next")).toBe("1");
  expect(second.headers.get("x-middleware-next")).toBe("1");
  expect(lookup).toHaveBeenCalledTimes(1);
  const now = Date.now();
  const time = spyOn(Date, "now").mockImplementation(() => now + 61_000);
  try {
    await handleLegacyRedirectProxyRequest(new NextRequest(url), lookup);
  } finally {
    time.mockRestore();
  }
  expect(lookup).toHaveBeenCalledTimes(2);
});

test("T07: keys distinguish hosts, paths, and business query parameters", async () => {
  const lookup = mock(async () => null);
  for (const url of [
    "https://a.test/x?a=1",
    "https://b.test/x?a=1",
    "https://a.test/y?a=1",
    "https://a.test/x?a=2",
  ]) {
    await handleLegacyRedirectProxyRequest(new NextRequest(url), lookup);
  }
  expect(lookup).toHaveBeenCalledTimes(4);
});

test("T07: failures remain retryable on the next request", async () => {
  let calls = 0;
  const lookup = async () => {
    if (++calls === 1) throw new Error("Temporary failure");
    return {
      categoryId: null,
      mediaId: null,
      productId: null,
      statusCode: 301 as const,
      targetUrl: "https://audit.test/new",
      type: "general" as const,
    };
  };
  const log = spyOn(console, "error").mockImplementation(() => {});
  try {
    const request = () =>
      new NextRequest("https://audit.test/error-then-redirect");
    expect(
      (await handleLegacyRedirectProxyRequest(request(), lookup)).headers.get(
        "x-middleware-next",
      ),
    ).toBe("1");
    const response = await handleLegacyRedirectProxyRequest(request(), lookup);
    expect(response.status).toBe(301);
    expect(response.headers.get("location")).toBe("https://audit.test/new");
    await handleLegacyRedirectProxyRequest(request(), lookup);
    expect(calls).toBe(2);
  } finally {
    log.mockRestore();
  }
});

test("T07: concurrent identical requests share a lookup; cache is bounded to 256 entries", async () => {
  const lookup = mock(async () => {
    await Promise.resolve();
    return null;
  });
  await Promise.all(
    Array.from({ length: 5 }, () =>
      handleLegacyRedirectProxyRequest(
        new NextRequest("https://bound.test/shared"),
        lookup,
      ),
    ),
  );
  expect(lookup).toHaveBeenCalledTimes(1);
  for (let index = 0; index < 300; index++)
    await handleLegacyRedirectProxyRequest(
      new NextRequest(`https://bound.test/${index}`),
      lookup,
    );
  const afterFill = lookup.mock.calls.length;
  await handleLegacyRedirectProxyRequest(
    new NextRequest("https://bound.test/299"),
    lookup,
  );
  expect(lookup.mock.calls.length).toBe(afterFill);
  await handleLegacyRedirectProxyRequest(
    new NextRequest("https://bound.test/shared"),
    lookup,
  );
  expect(lookup.mock.calls.length).toBe(afterFill + 1);
});
