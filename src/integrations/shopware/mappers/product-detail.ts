import type { components } from "@shopware/api-client/store-api-types";

import type {
  ShopProductDetail,
  ShopProductDimensions,
  ShopProductPageData,
  ShopProductSpecification,
} from "@/features/catalog/model/product-detail";
import type { ShopProduct } from "@/features/catalog/model/product-listing";
import {
  getShopwarePlainText,
  mapShopwareProduct,
} from "@/integrations/shopware/mappers/product-listing";

type ShopwareProduct = components["schemas"]["Product"];

type ShopwareProductDetailInput = Readonly<{
  currency: string;
  locale: string;
  product: ShopwareProduct;
}>;

function getGallery(
  product: ShopwareProduct,
  listingProduct: ShopProduct,
): ShopProductDetail["gallery"] {
  const images = new Map<string, ShopProduct["image"]>();

  images.set(listingProduct.image.url, listingProduct.image);

  for (const productMedia of (product.media ?? []).toSorted(
    (first, second) => (first.position ?? 0) - (second.position ?? 0),
  )) {
    const media = productMedia.media;
    const url = media?.url?.trim();

    if (!url || images.has(url)) {
      continue;
    }

    const alt =
      media.translated?.alt?.trim() || media.alt?.trim() || listingProduct.name;

    images.set(url, {
      alt: getShopwarePlainText(alt),
      url,
    });
  }

  const [firstImage, ...remainingImages] = images.values();

  return [firstImage ?? listingProduct.image, ...remainingImages];
}

function getDimensions(product: ShopwareProduct): ShopProductDimensions {
  const measurements = product.measurements;

  return {
    height: measurements?.height?.value ?? product.height ?? 0,
    length: measurements?.length?.value ?? product.length ?? 0,
    unit:
      measurements?.height?.unit ||
      measurements?.length?.unit ||
      measurements?.width?.unit ||
      "mm",
    width: measurements?.width?.value ?? product.width ?? 0,
  };
}

function getDeliveryEstimate(product: ShopwareProduct) {
  const deliveryTime = product.deliveryTime;

  if (!deliveryTime) {
    return "Lieferzeit auf Anfrage";
  }

  const unit = deliveryTime.unit.trim().toLocaleLowerCase("de-DE");
  const unitLabels: Record<string, readonly [string, string]> = {
    day: ["Tag", "Tage"],
    hour: ["Stunde", "Stunden"],
    month: ["Monat", "Monate"],
    week: ["Woche", "Wochen"],
  };
  const labels = unitLabels[unit] ?? [deliveryTime.unit, deliveryTime.unit];
  const duration =
    deliveryTime.min === deliveryTime.max
      ? String(deliveryTime.min)
      : `${deliveryTime.min}–${deliveryTime.max}`;
  const label =
    deliveryTime.min === 1 && deliveryTime.max === 1 ? labels[0] : labels[1];

  return `${duration} ${label}`;
}

function getSpecifications(
  product: ShopwareProduct,
  listingProduct: ShopProduct,
): ShopProductSpecification[] {
  const propertyGroups = new Map<
    string,
    { id: string; label: string; values: Set<string> }
  >();

  for (const property of product.properties ?? []) {
    const label = getShopwarePlainText(
      property.group?.translated?.name?.trim() ||
        property.group?.name?.trim() ||
        "",
    );
    const value = getShopwarePlainText(
      property.translated?.name?.trim() || property.name?.trim() || "",
    );

    if (!label || !value) {
      continue;
    }

    const key = property.group?.id || property.groupId || label;
    const existing = propertyGroups.get(key);

    if (existing) {
      existing.values.add(value);
    } else {
      propertyGroups.set(key, {
        id: key,
        label,
        values: new Set([value]),
      });
    }
  }

  return [
    {
      id: "article-number",
      label: "Artikelnummer",
      value: product.productNumber,
    },
    {
      id: "category",
      label: "Kategorie",
      value: listingProduct.categoryLabel,
    },
    ...Array.from(propertyGroups.values(), ({ id, label, values }) => ({
      id,
      label,
      value: Array.from(values).join(", "),
    })),
  ];
}

function getAvailability(product: ShopwareProduct) {
  if (product.available === false) {
    return "Derzeit nicht verfügbar";
  }

  if (product.available === true) {
    return "Auf Lager";
  }

  return "Verfügbarkeit auf Anfrage";
}

export function mapShopwareProductDetail({
  currency,
  locale,
  product,
}: ShopwareProductDetailInput): ShopProductPageData {
  const listingProduct = mapShopwareProduct(product, 0);
  const longDescriptionSource =
    product.translated.description?.trim() || product.description?.trim() || "";
  const longDescription =
    getShopwarePlainText(longDescriptionSource) || listingProduct.description;

  return {
    currency,
    locale,
    product: {
      ...listingProduct,
      accessories: [],
      articleNumber: product.productNumber,
      availability: getAvailability(product),
      deliveryEstimate: getDeliveryEstimate(product),
      deliveryMethod: "Möbelspedition bis in die Wohnung",
      dimensions: getDimensions(product),
      gallery: getGallery(product, listingProduct),
      longDescription,
      services: [],
      specifications: getSpecifications(product, listingProduct),
    },
    relatedProducts: [],
  };
}
