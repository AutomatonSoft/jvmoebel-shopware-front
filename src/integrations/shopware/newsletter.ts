import "server-only";

import type { components } from "@shopware/api-client/store-api-types";

import type { NewsletterSubscription } from "@/features/newsletter/model/subscription";
import type { ShopwareClient } from "@/integrations/shopware/client";

export type ShopwareNewsletterSubscriptionOutcome = Readonly<{
  status: components["schemas"]["NewsletterStatus"];
  success: boolean;
}>;

export async function subscribeToShopwareNewsletter(
  client: ShopwareClient,
  subscription: NewsletterSubscription,
): Promise<ShopwareNewsletterSubscriptionOutcome> {
  const response = await client.invoke(
    "subscribeToNewsletter post /newsletter/subscribe",
    {
      body: {
        email: subscription.email,
        option: "subscribe",
        storefrontUrl: subscription.storefrontUrl,
      },
    },
  );

  return {
    status: response.data.status,
    success: response.data.success,
  };
}
