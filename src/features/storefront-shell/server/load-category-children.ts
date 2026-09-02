"use server";

import type { StoreNavigationItem } from "@/features/storefront-shell/model/navigation";
import { getShopwareCategoryChildren } from "@/integrations/shopware/navigation";
import { getShopwareRequestSession } from "@/integrations/shopware/session";

export type LoadCategoryChildrenResult =
  { items: StoreNavigationItem[]; status: "success" } | { status: "error" };

const shopwareCategoryIdPattern = /^[0-9a-f]{32}$/i;

export async function loadCategoryChildren(
  categoryId: string,
): Promise<LoadCategoryChildrenResult> {
  if (!shopwareCategoryIdPattern.test(categoryId)) {
    return { status: "error" };
  }

  try {
    const items = await getShopwareCategoryChildren(
      getShopwareRequestSession().client,
      categoryId,
    );

    return { items, status: "success" };
  } catch (error) {
    console.error("Failed to load Shopware category children.", {
      categoryId,
      cause: error instanceof Error ? error.message : "Unknown error",
    });

    return { status: "error" };
  }
}
