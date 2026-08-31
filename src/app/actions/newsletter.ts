"use server";

import { createShopwareSession } from "@/integrations/shopware/session";
import { shouldUseShopwareMocks } from "@/lib/shopware/mocks/config";

export type NewsletterActionState = {
  status: "error" | "idle" | "invalid" | "success";
};

function getEmail(formData: FormData) {
  const value = formData.get("email");

  if (typeof value !== "string") {
    return undefined;
  }

  const email = value.trim();

  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ? email
    : undefined;
}

function getStorefrontUrl(value: string) {
  try {
    const url = new URL(value);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return undefined;
    }

    return url.origin;
  } catch {
    return undefined;
  }
}

export async function subscribeToNewsletter(
  storefrontUrlValue: string,
  _previousState: NewsletterActionState,
  formData: FormData,
): Promise<NewsletterActionState> {
  const email = getEmail(formData);
  const storefrontUrl = getStorefrontUrl(storefrontUrlValue);

  if (!email || !storefrontUrl) {
    return { status: "invalid" };
  }

  if (shouldUseShopwareMocks()) {
    return { status: "success" };
  }

  try {
    const session = createShopwareSession();
    const response = await session.client.invoke(
      "subscribeToNewsletter post /newsletter/subscribe",
      {
        body: {
          email,
          option: "subscribe",
          storefrontUrl,
        },
      },
    );

    return { status: response.data.success ? "success" : "error" };
  } catch {
    return { status: "error" };
  }
}
