"use server";

import type { NewsletterActionState } from "@/features/newsletter/model/subscription";
import { parseNewsletterSubscription } from "@/features/newsletter/model/validation";
import { shouldUseShopwareMocks } from "@/integrations/shopware/mock-mode";
import { subscribeToShopwareNewsletter } from "@/integrations/shopware/newsletter";
import { createShopwareSession } from "@/integrations/shopware/session";

export async function subscribeToNewsletter(
  storefrontUrlValue: string,
  _previousState: NewsletterActionState,
  formData: FormData,
): Promise<NewsletterActionState> {
  const subscription = parseNewsletterSubscription(
    storefrontUrlValue,
    formData,
  );

  if (!subscription) {
    return { status: "invalid" };
  }

  if (shouldUseShopwareMocks()) {
    return { status: "success" };
  }

  try {
    const session = createShopwareSession();
    const subscribed = await subscribeToShopwareNewsletter(
      session.client,
      subscription,
    );

    return { status: subscribed ? "success" : "error" };
  } catch (error) {
    console.error("Shopware newsletter subscription failed.", error);

    return { status: "error" };
  }
}
