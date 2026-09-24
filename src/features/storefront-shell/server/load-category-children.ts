"use server";

import { cacheLife, cacheTag } from "next/cache";

import {
  isShopwareCategoryId,
  type StoreNavigationItem,
} from "@/features/storefront-shell/model/navigation";
import {
  shopwareCacheLife,
  shopwareCacheTtlSeconds,
} from "@/integrations/shopware/cache-policy";
import { getShopwareCategoryChildren } from "@/integrations/shopware/navigation";
import { getShopwareRequestSession } from "@/integrations/shopware/session";

export type LoadCategoryChildrenResult =
  { items: StoreNavigationItem[]; status: "success" } | { status: "error" };

async function getCachedShopwareCategoryChildren(categoryId: string) {
  "use cache";
  cacheLife(shopwareCacheLife(shopwareCacheTtlSeconds.categoryChildren));
  cacheTag("shopware:categories");

  return getShopwareCategoryChildren(
    getShopwareRequestSession().client,
    categoryId,
  );
}

export async function loadCategoryChildren(
  categoryId: string,
): Promise<LoadCategoryChildrenResult> {
  if (!isShopwareCategoryId(categoryId)) {
    return { status: "error" };
  }

  try {
    const items = await getCachedShopwareCategoryChildren(categoryId);

    return { items, status: "success" };
  } catch (error) {
    console.error("Failed to load Shopware category children.", {
      categoryId,
      cause: error instanceof Error ? error.message : "Unknown error",
    });

    return { status: "error" };
  }
}
