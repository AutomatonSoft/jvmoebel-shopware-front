import type { components } from "@shopware/api-client/store-api-types";
import sanitizeHtml from "sanitize-html";

import type { ProductSearchResult } from "@/features/search/model/product-search";
import {
  getShopwareCardImageUrl,
  getShopwareProductUrl,
} from "@/integrations/shopware/mappers/product-listing";

type ShopwareProduct = components["schemas"]["Product"];

function getPlainText(value: string) {
  return sanitizeHtml(
    value.replace(/<br\s*\/?\s*>|<\/(?:div|h[1-6]|li|p)>/gi, " "),
    {
      allowedAttributes: {},
      allowedTags: [],
    },
  )
    .replace(/\s+/g, " ")
    .trim();
}

function getTranslatedName(value: {
  name?: string | null;
  translated?: { name?: string | null };
}) {
  return getPlainText(
    value.translated?.name?.trim() || value.name?.trim() || "",
  );
}

function getCategoryLabel(product: ShopwareProduct) {
  const category = (product.categories ?? []).toSorted((first, second) => {
    const firstDepth = first.path?.split("|").filter(Boolean).length ?? 0;
    const secondDepth = second.path?.split("|").filter(Boolean).length ?? 0;

    return secondDepth - firstDepth;
  })[0];

  return category ? getTranslatedName(category) : "Products";
}

function getDescription(product: ShopwareProduct) {
  const source =
    product.translated.description?.trim() || product.description?.trim() || "";
  const description = getPlainText(source);

  return description.length > 120
    ? `${description.slice(0, 119).trimEnd()}…`
    : description;
}

function getImage(product: ShopwareProduct, name: string) {
  const media = product.cover?.media;
  const alt = media?.translated?.alt?.trim() || media?.alt?.trim() || name;

  return {
    alt: getPlainText(alt),
    url: getShopwareCardImageUrl(media),
  };
}

export function mapShopwareProductSearchResult(
  product: ShopwareProduct,
): ProductSearchResult {
  const name = getTranslatedName(product);

  return {
    categoryLabel: getCategoryLabel(product),
    description: getDescription(product),
    id: product.id,
    image: getImage(product, name),
    name,
    unitPrice: product.calculatedPrice.unitPrice,
    url: getShopwareProductUrl(product),
  };
}
