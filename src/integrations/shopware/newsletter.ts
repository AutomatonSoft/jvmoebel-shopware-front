import "server-only";

import type { NewsletterSubscription } from "@/features/newsletter/model/subscription";
import type { ShopwareClient } from "@/integrations/shopware/client";

export async function subscribeToShopwareNewsletter(
  client: ShopwareClient,
  subscription: NewsletterSubscription,
): Promise<boolean> {
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

  return response.data.success;
}
