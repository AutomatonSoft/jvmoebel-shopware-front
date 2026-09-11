import "server-only";

import type { components } from "@shopware/api-client/store-api-types";

import type {
  CategoryBreadcrumb,
  ShopCategoryPage,
} from "@/features/catalog/model/category-page";
import type { ShopwareClient } from "@/integrations/shopware/client";
import { getShopwarePlainText } from "@/integrations/shopware/mappers/product-listing";
import { mapShopwareCategory } from "@/integrations/shopware/mappers/navigation";
import { getShopwareCategoryChildren } from "@/integrations/shopware/navigation";
import { getShopwareProductListing } from "@/integrations/shopware/product-listing";

type ShopwareCategory = components["schemas"]["Category"];

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

async function getBreadcrumbs(
  client: ShopwareClient,
  category: ShopwareCategory,
): Promise<CategoryBreadcrumb[]> {
  const ancestorIds = (category.path ?? "").split("|").filter(Boolean);
  const visibleAncestorIds = ancestorIds.slice(1);
  const ancestors = await Promise.all(
    visibleAncestorIds.map((categoryId) => getCategory(client, categoryId)),
  );

  return ancestors.flatMap((ancestor) => {
    const href = getCanonicalPath(ancestor);

    return href.startsWith("/kategorie/")
      ? []
      : [
          {
            href,
            id: ancestor.id,
            label: getCategoryName(ancestor),
          },
        ];
  });
}

export async function getShopwareCategoryPage(
  client: ShopwareClient,
  categoryId: string,
): Promise<ShopCategoryPage> {
  const category = await getCategory(client, categoryId);
  const [breadcrumbs, children, listing] = await Promise.all([
    getBreadcrumbs(client, category),
    getShopwareCategoryChildren(client, categoryId),
    category.type === "folder"
      ? Promise.resolve(null)
      : getShopwareProductListing(client, categoryId),
  ]);
  const translated = category.translated;

  return {
    breadcrumbs,
    category: {
      canonicalPath: getCanonicalPath(category),
      description: getCategoryDescription(category),
      id: category.id,
      metaDescription: translated.metaDescription || category.metaDescription,
      metaTitle: translated.metaTitle || category.metaTitle,
      name: getCategoryName(category),
    },
    children,
    listing,
  };
}
