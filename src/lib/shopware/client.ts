import "server-only";

import { createAPIClient } from "@shopware/api-client";
import type { operations } from "@shopware/api-client/store-api-types";

import { getShopwareConfig } from "@/lib/shopware/config";

type CreateShopwareClientOptions = {
  contextToken?: string;
};

export function createShopwareClient(
  options: CreateShopwareClientOptions = {},
) {
  const { endpoint, accessToken } = getShopwareConfig();

  return createAPIClient<operations>({
    baseURL: endpoint,
    accessToken,
    contextToken: options.contextToken,
  });
}
