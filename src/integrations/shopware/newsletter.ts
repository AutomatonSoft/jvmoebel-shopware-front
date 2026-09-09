import "server-only";

import type { components } from "@shopware/api-client/store-api-types";

import type { NewsletterSubscription } from "@/features/newsletter/model/subscription";
import type { ShopwareClient } from "@/integrations/shopware/client";
import { getShopwareContext } from "@/integrations/shopware/context";

export type ShopwareNewsletterSubscriptionOutcome = Readonly<{
  status: components["schemas"]["NewsletterStatus"];
  success: boolean;
}>;

export async function subscribeToShopwareNewsletter(
  client: ShopwareClient,
  subscription: NewsletterSubscription,
): Promise<ShopwareNewsletterSubscriptionOutcome> {
  const context = await getShopwareContext(client);
  const storefrontUrl =
    context.salesChannel.hreflangDefaultDomain?.url ??
    context.salesChannel.domains?.[0]?.url;

  if (!storefrontUrl) {
    throw new Error("The Shopware sales channel has no storefront domain.");
  }

  const response = await client.invoke(
    "subscribeToNewsletter post /newsletter/subscribe",
    {
      body: {
        email: subscription.email,
        option: "subscribe",
        storefrontUrl,
      },
    },
  );

  return {
    status: response.data.status,
    success: response.data.success,
  };
}
