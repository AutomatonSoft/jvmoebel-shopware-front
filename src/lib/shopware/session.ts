import "server-only";

import { cache } from "react";

import type { ShopwareConfig } from "@/integrations/shopware/config";
import { createShopwareClient } from "@/lib/shopware/client";

export type CreateShopwareSessionOptions = {
  config?: ShopwareConfig;
  contextToken?: string;
};

export function createShopwareSession(
  options: CreateShopwareSessionOptions = {},
) {
  let contextToken = options.contextToken;
  const client = createShopwareClient({
    config: options.config,
    contextToken,
    onContextChanged: (newContextToken) => {
      contextToken = newContextToken;
    },
  });

  return {
    client,
    getContextToken: () => contextToken,
  };
}

export type ShopwareSession = ReturnType<typeof createShopwareSession>;

export const getShopwareRequestSession = cache(() => createShopwareSession());
