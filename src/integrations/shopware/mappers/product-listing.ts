import type { components } from "@shopware/api-client/store-api-types";
import sanitizeHtml from "sanitize-html";

import type {
  ShopProduct,
  ShopProductAttributeGroup,
  ShopProductAttributeOption,
  ShopProductColor,
  ShopProductListing,
  ShopProductSize,
} from "@/features/catalog/model/product-listing";

type ShopwareProduct = components["schemas"]["Product"];
type ShopwareProperty = components["schemas"]["PropertyGroupOption"];

type ShopwareProductListingInput = Readonly<{
  currency: string;
  locale: string;
  products: readonly ShopwareProduct[];
}>;

const fallbackProductImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='1000' viewBox='0 0 800 1000'%3E%3Crect width='800' height='1000' fill='%23dedbd4'/%3E%3C/svg%3E";

export function getShopwarePlainText(value: string) {
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
  return getShopwarePlainText(
    value.translated?.name?.trim() || value.name?.trim() || "",
  );
}

function normalizePropertyName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ß/g, "ss")
    .trim()
    .toLocaleLowerCase("de-DE");
}

function getPropertyGroupName(property: ShopwareProperty) {
  return normalizePropertyName(
    property.group?.translated?.name || property.group?.name || "",
  );
}

function getProperties(
  product: ShopwareProduct,
  groupNames: readonly string[],
) {
  return (product.properties ?? []).filter((property) =>
    groupNames.includes(getPropertyGroupName(property)),
  );
}

function getCategory(product: ShopwareProduct) {
  const category = (product.categories ?? []).toSorted((first, second) => {
    const firstDepth = first.path?.split("|").filter(Boolean).length ?? 0;
    const secondDepth = second.path?.split("|").filter(Boolean).length ?? 0;

    return secondDepth - firstDepth;
  })[0];

  return {
    label: category ? getTranslatedName(category) : "Alle Produkte",
    value: category?.id ?? "all-products",
  };
}

function getDescription(product: ShopwareProduct) {
  const source =
    product.translated.description?.trim() || product.description?.trim() || "";
  const description = getShopwarePlainText(source);

  return description.length > 140
    ? `${description.slice(0, 139).trimEnd()}…`
    : description;
}

function getImage(product: ShopwareProduct, name: string) {
  const media = product.cover?.media;
  const alt = media?.translated?.alt?.trim() || media?.alt?.trim() || name;

  return {
    alt: getShopwarePlainText(alt),
    url: media?.url?.trim() || fallbackProductImage,
  };
}

function getPropertyHex(property: ShopwareProperty) {
  const hex =
    property.translated?.colorHexCode?.trim() || property.colorHexCode?.trim();

  return hex && /^#[0-9a-f]{3,8}$/i.test(hex) ? hex : undefined;
}

function getAttributes(product: ShopwareProduct): ShopProductAttributeGroup[] {
  const groups = new Map<
    string,
    {
      id: string;
      label: string;
      options: ShopProductAttributeOption[];
    }
  >();

  for (const property of product.properties ?? []) {
    const groupLabel = getTranslatedName(property.group);
    const optionLabel = getTranslatedName(property);

    if (!groupLabel || !optionLabel) {
      continue;
    }

    const group = groups.get(property.groupId) ?? {
      id: property.groupId,
      label: groupLabel,
      options: [],
    };

    if (!group.options.some((option) => option.value === property.id)) {
      group.options.push({
        hex: getPropertyHex(property),
        label: optionLabel,
        value: property.id,
      });
    }

    groups.set(group.id, group);
  }

  return Array.from(groups.values());
}

function getColors(product: ShopwareProduct): ShopProductColor[] {
  return getProperties(product, [
    "color",
    "colour",
    "farbe",
    "grundfarbe",
  ]).flatMap((property) => {
    const hex = getPropertyHex(property);
    const label = getTranslatedName(property);

    return hex && /^#[0-9a-f]{3,8}$/i.test(hex) && label
      ? [{ hex, label, value: property.id }]
      : [];
  });
}

function getMaterial(product: ShopwareProduct) {
  const materialGroupNames = [
    "material",
    "bezug",
    "material sitzflache",
    "bezug korpus",
    "material korpus",
    "material untergestell",
  ];
  const material = materialGroupNames
    .map((groupName) => getProperties(product, [groupName])[0])
    .find(Boolean);

  return material ? getTranslatedName(material) : "Nicht angegeben";
}

function getSize(value: string): ShopProductSize | undefined {
  const normalizedValue = normalizePropertyName(value);

  if (["small", "klein", "s"].includes(normalizedValue)) {
    return "small";
  }

  if (["medium", "mittel", "m"].includes(normalizedValue)) {
    return "medium";
  }

  if (["large", "gross", "l"].includes(normalizedValue)) {
    return "large";
  }

  if (
    ["extra large", "extra gross", "extra-large", "xl"].includes(
      normalizedValue,
    )
  ) {
    return "extra-large";
  }
}

function getSizes(product: ShopwareProduct): ShopProductSize[] {
  return getProperties(product, ["grosse", "groesse", "size"]).flatMap(
    (property) => {
      const size = getSize(getTranslatedName(property));

      return size ? [size] : [];
    },
  );
}

export function mapShopwareProduct(
  product: ShopwareProduct,
  index: number,
): ShopProduct {
  const name = getTranslatedName(product) || "Produkt";
  const category = getCategory(product);
  const manufacturer = product.manufacturer
    ? getTranslatedName(product.manufacturer)
    : "";
  const previousPrice = product.calculatedPrice.listPrice?.price;
  const rating = product.ratingAverage;

  return {
    attributes: getAttributes(product),
    badge: product.markAsTopseller
      ? "Bestseller"
      : product.isNew
        ? "Neu"
        : undefined,
    category: category.value,
    categoryLabel: category.label,
    colors: getColors(product),
    company: manufacturer || "Ohne Herstellerangabe",
    createdAt:
      product.releaseDate || product.createdAt || "1970-01-01T00:00:00.000Z",
    description: getDescription(product),
    featuredRank: index,
    id: product.id,
    image: getImage(product, name),
    material: getMaterial(product),
    name,
    previousPrice:
      previousPrice && previousPrice > product.calculatedPrice.unitPrice
        ? previousPrice
        : undefined,
    rating:
      typeof rating === "number" && Number.isFinite(rating) && rating > 0
        ? rating
        : undefined,
    sizes: getSizes(product),
    unitPrice: product.calculatedPrice.unitPrice,
    url: `/produkt/${encodeURIComponent(product.id)}`,
  };
}

export function mapShopwareProductListing({
  currency,
  locale,
  products,
}: ShopwareProductListingInput): ShopProductListing | null {
  if (products.length === 0) {
    return null;
  }

  return {
    currency,
    description:
      "Entdecken Sie Möbel für Wohnzimmer, Esszimmer und erholsame Räume.",
    eyebrow: "Unser Sortiment",
    locale,
    products: products.map(mapShopwareProduct),
    title: "Möbelkollektion",
  };
}
