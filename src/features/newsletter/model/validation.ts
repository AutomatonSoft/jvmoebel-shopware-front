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

export function parseNewsletterSubscription(
  formData: FormData,
): NewsletterSubscription | null {
  const email = parseEmail(formData);

  return email ? { email } : null;
}
