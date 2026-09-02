"use server";

import type { NewsletterActionState } from "@/features/newsletter/model/subscription";
import { parseNewsletterSubscription } from "@/features/newsletter/model/validation";
import { reportNewsletterSubscriptionIssue } from "@/features/newsletter/server/report-subscription-issue";
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
    const outcome = await subscribeToShopwareNewsletter(
      session.client,
      subscription,
    );

    if (!outcome.success) {
      reportNewsletterSubscriptionIssue({
        code: "unsuccessful-response",
        shopwareStatus: outcome.status,
      });

      return { status: "error" };
    }

    return { status: "success" };
  } catch (error) {
    reportNewsletterSubscriptionIssue({
      cause: error,
      code: "request-failed",
    });

    return { status: "error" };
  }
}
