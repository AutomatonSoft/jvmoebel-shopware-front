import "server-only";

import { createAPIClient } from "@shopware/api-client";
import type { operations } from "@shopware/api-client/store-api-types";

import {
  getShopwareConfig,
  type ShopwareConfig,
} from "@/integrations/shopware/config";

export type CreateShopwareClientOptions = {
  config?: ShopwareConfig;
  contextToken?: string;
  onContextChanged?: (contextToken: string) => void;
};

export function createShopwareClient(
  options: CreateShopwareClientOptions = {},
) {
  const { endpoint, accessToken } = options.config ?? getShopwareConfig();

  const client = createAPIClient<operations>({
    baseURL: endpoint,
    accessToken,
    contextToken: options.contextToken,
  });

  if (options.onContextChanged) {
    client.hook("onContextChanged", options.onContextChanged);
  }

  return client;
}

export type ShopwareClient = ReturnType<typeof createShopwareClient>;
