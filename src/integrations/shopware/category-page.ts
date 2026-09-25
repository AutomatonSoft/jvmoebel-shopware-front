import "server-only";

import type { components } from "@shopware/api-client/store-api-types";

import type {
  CategoryBreadcrumb,
  ShopCategoryPageContent,
} from "@/features/catalog/model/category-page";
import type { StoreNavigationItem } from "@/features/storefront-shell/model/navigation";
import type { ShopwareClient } from "@/integrations/shopware/client";
import { mapShopwareCmsPage } from "@/integrations/shopware/mappers/cms-page";
import { getShopwarePlainText } from "@/integrations/shopware/mappers/product-listing";
import { mapShopwareCategory } from "@/integrations/shopware/mappers/navigation";
import { getShopwareCategoryChildren } from "@/integrations/shopware/navigation";

type ShopwareCategory = components["schemas"]["Category"];

export type ShopwareCategoryPageCore = Readonly<
  Pick<
    ShopCategoryPageContent,
    "category" | "cmsPage" | "hasProductListing"
  > & {
    path: string;
  }
>;

async function getCategory(client: ShopwareClient, categoryId: string) {
  const response = await client.invoke(
    "readCategory post /category/{navigationId}",
    {
      body: {},
      fetchOptions: { cache: "no-store" },
      headers: { "sw-include-seo-urls": true },
      pathParams: { navigationId: categoryId },
    },
  );

  return response.data;
}

function getCategoryName(category: ShopwareCategory) {
  return (
    category.translated.name?.trim() || category.name?.trim() || "Kategorie"
  );
}

function decodeHtmlEntities(value: string) {
  const namedEntities: Record<string, string> = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    nbsp: " ",
    quot: '"',
  };

  return value.replace(
    /&(?:#(\d+)|#x([\da-f]+)|(amp|apos|gt|lt|nbsp|quot));/gi,
    (_entity, decimal: string, hexadecimal: string, named: string) => {
      if (decimal) {
        return String.fromCodePoint(Number.parseInt(decimal, 10));
      }

      if (hexadecimal) {
        return String.fromCodePoint(Number.parseInt(hexadecimal, 16));
      }

      return namedEntities[named.toLowerCase()] ?? "";
    },
  );
}

function getCategoryDescription(category: ShopwareCategory) {
  return decodeHtmlEntities(
    getShopwarePlainText(
      category.translated.description?.trim() ||
        category.description?.trim() ||
        "",
    ),
  );
}

function getCanonicalPath(category: ShopwareCategory) {
  return mapShopwareCategory(category).href;
}

function findNavigationItem(
  items: readonly StoreNavigationItem[],
  categoryId: string,
): StoreNavigationItem | undefined {
  for (const item of items) {
    if (item.id === categoryId) {
      return item;
    }

    const child = findNavigationItem(item.children, categoryId);

    if (child) {
      return child;
    }
  }
}

async function getBreadcrumbs(
  client: ShopwareClient,
  path: string,
  navigation:
    | readonly StoreNavigationItem[]
    | PromiseLike<readonly StoreNavigationItem[]>,
): Promise<CategoryBreadcrumb[]> {
  const ancestorIds = path.split("|").filter(Boolean);
  const visibleAncestorIds = ancestorIds.slice(1);
  const [topLevelAncestorId, ...nestedAncestorIds] = visibleAncestorIds;
  const nestedAncestorsPromise = Promise.all(
    nestedAncestorIds.map((categoryId) => getCategory(client, categoryId)),
  );
  const resolvedNavigation = await Promise.resolve(navigation);
  const topLevelNavigationItem = topLevelAncestorId
    ? findNavigationItem(resolvedNavigation, topLevelAncestorId)
    : undefined;
  const [nestedAncestors, topLevelAncestor] = await Promise.all([
    nestedAncestorsPromise,
    topLevelAncestorId && !topLevelNavigationItem
      ? getCategory(client, topLevelAncestorId)
      : Promise.resolve(undefined),
  ]);
  const navigationItems = new Map(
    topLevelAncestorId && topLevelNavigationItem
      ? [[topLevelAncestorId, topLevelNavigationItem] as const]
      : [],
  );
  const missingAncestorById = new Map(
    [...nestedAncestors, topLevelAncestor]
      .filter((ancestor) => ancestor !== undefined)
      .map((ancestor) => [ancestor.id, ancestor]),
  );

  return visibleAncestorIds.flatMap((categoryId) => {
    const navigationItem = navigationItems.get(categoryId);
    const ancestor = missingAncestorById.get(categoryId);
    const href =
      navigationItem?.href ?? (ancestor && getCanonicalPath(ancestor));

    return !href || href.startsWith("/kategorie/")
      ? []
      : [
          {
            href,
            id: categoryId,
            label:
              navigationItem?.label ??
              (ancestor ? getCategoryName(ancestor) : "Kategorie"),
          },
        ];
  });
}

export async function getShopwareCategoryPageCore(
  client: ShopwareClient,
  categoryId: string,
): Promise<ShopwareCategoryPageCore> {
  const category = await getCategory(client, categoryId);
  const translated = category.translated;

  return {
    category: {
      canonicalPath: getCanonicalPath(category),
      description: getCategoryDescription(category),
      id: category.id,
      metaDescription: translated.metaDescription || category.metaDescription,
      metaTitle: translated.metaTitle || category.metaTitle,
      name: getCategoryName(category),
    },
    cmsPage: category.cmsPage ? mapShopwareCmsPage(category.cmsPage) : null,
    hasProductListing: category.type !== "folder",
    path: category.path ?? "",
  };
}

async function composeShopwareCategoryPageContent(
  client: ShopwareClient,
  core: ShopwareCategoryPageCore,
  navigation:
    | readonly StoreNavigationItem[]
    | PromiseLike<readonly StoreNavigationItem[]>,
  childrenPromise: ReturnType<typeof getShopwareCategoryChildren>,
): Promise<ShopCategoryPageContent> {
  const [breadcrumbs, children] = await Promise.all([
    getBreadcrumbs(client, core.path, navigation),
    childrenPromise,
  ]);

  return {
    breadcrumbs,
    category: core.category,
    children,
    cmsPage: core.cmsPage,
    hasProductListing: core.hasProductListing,
  };
}

export function getShopwareCategoryPageContentFromCore(
  client: ShopwareClient,
  categoryId: string,
  core: ShopwareCategoryPageCore,
  navigation:
    | readonly StoreNavigationItem[]
    | PromiseLike<readonly StoreNavigationItem[]> = [],
): Promise<ShopCategoryPageContent> {
  return composeShopwareCategoryPageContent(
    client,
    core,
    navigation,
    getShopwareCategoryChildren(client, categoryId),
  );
}

export async function getShopwareCategoryPageContent(
  client: ShopwareClient,
  categoryId: string,
  navigation:
    | readonly StoreNavigationItem[]
    | PromiseLike<readonly StoreNavigationItem[]> = [],
): Promise<ShopCategoryPageContent> {
  const corePromise = getShopwareCategoryPageCore(client, categoryId);
  const childrenPromise = getShopwareCategoryChildren(client, categoryId);
  const core = await corePromise;
  return composeShopwareCategoryPageContent(
    client,
    core,
    navigation,
    childrenPromise,
  );
}
