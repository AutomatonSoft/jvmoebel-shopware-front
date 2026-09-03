import type { NewsletterSubscription } from "@/features/newsletter/model/subscription";

function parseEmail(formData: FormData): string | undefined {
  const value = formData.get("email");

  if (typeof value !== "string") {
    return undefined;
  }

  const email = value.trim();

  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ? email
    : undefined;
}

function parseStorefrontUrl(value: string): string | undefined {
  try {
    const url = new URL(value);

    return url.protocol === "http:" || url.protocol === "https:"
      ? url.origin
      : undefined;
  } catch {
    return undefined;
  }
}

export function parseNewsletterSubscription(
  storefrontUrlValue: string,
  formData: FormData,
): NewsletterSubscription | null {
  const email = parseEmail(formData);
  const storefrontUrl = parseStorefrontUrl(storefrontUrlValue);

  return email && storefrontUrl ? { email, storefrontUrl } : null;
}
