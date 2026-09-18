import { z } from "zod";

import type { NewsletterSubscription } from "@/features/newsletter/model/subscription";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const newsletterSubscriptionSchema = z.object({
  email: z.string().trim().max(254).regex(emailPattern),
});

export function parseNewsletterSubscription(
  formData: FormData,
): NewsletterSubscription | null {
  const result = newsletterSubscriptionSchema.safeParse({
    email: formData.get("email"),
  });

  return result.success ? result.data : null;
}
