import "server-only";

import { createAPIClient } from "@shopware/api-client";
import type { operations } from "@shopware/api-client/store-api-types";

import { getShopwareConfig, type ShopwareConfig } from "@/lib/shopware/config";

export type CreateShopwareClientOptions = {
  config?: ShopwareConfig;
  contextToken?: string;
};

export function createShopwareClient(
  options: CreateShopwareClientOptions = {},
) {
  const { endpoint, accessToken } = options.config ?? getShopwareConfig();

  return createAPIClient<operations>({
    baseURL: endpoint,
    accessToken,
    contextToken: options.contextToken,
  });
}
