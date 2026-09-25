import type { components } from "@shopware/api-client/store-api-types";
import sanitizeHtml from "sanitize-html";

import type {
  ShopProductDetail,
  ShopProductDimensions,
  ShopProductPageData,
  ShopProductSpecification,
  ShopProductVariantGroup,
} from "@/features/catalog/model/product-detail";
import type { ShopProduct } from "@/features/catalog/model/product-listing";
import {
  getShopwarePlainText,
  mapShopwareProduct,
} from "@/integrations/shopware/mappers/product-listing";

type ShopwareProduct = components["schemas"]["Product"];

type ShopwareProductDetailInput = Readonly<{
  configurator?: readonly components["schemas"]["PropertyGroup"][];
  crossSellings?: components["schemas"]["CrossSellingElementCollection"];
  currency: string;
  locale: string;
  product: ShopwareProduct;
}>;

function normalizePropertyGroupName(value: string) {
  return getShopwarePlainText(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ß/g, "ss")
    .trim()
    .toLocaleLowerCase("de-DE");
}

function getDescriptionHtml(value: string) {
  return sanitizeHtml(value, {
    allowedAttributes: {},
    allowedTags: [
      "b",
      "blockquote",
      "br",
      "div",
      "em",
      "h2",
      "h3",
      "h4",
      "i",
      "li",
      "ol",
      "p",
      "strong",
      "ul",
    ],
    transformTags: {
      b: "strong",
      i: "em",
    },
  })
    .replace(/<p>\s*(?:(?:&nbsp;|\u00a0)|<br\s*\/?>)*\s*<\/p>/gi, "")
    .replace(/(?:<br\s*\/?>\s*){2,}/gi, "<br>")
    .trim();
}

function getGallery(
  product: ShopwareProduct,
  listingProduct: ShopProduct,
): ShopProductDetail["gallery"] {
  const images = new Map<string, ShopProduct["image"]>();
  const coverMedia = product.cover?.media;
  const coverUrl = coverMedia?.url?.trim() || listingProduct.image.url;
  const coverAlt =
    coverMedia?.translated?.alt?.trim() ||
    coverMedia?.alt?.trim() ||
    listingProduct.name;

  images.set(coverUrl, {
    alt: getShopwarePlainText(coverAlt),
    url: coverUrl,
  });

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

function formatMeasurement(value: number, unit: string) {
  return `${value.toLocaleString("de-DE", { maximumFractionDigits: 2 })} ${unit}`;
}

function getDimensions(product: ShopwareProduct): ShopProductDimensions {
  const measurements = product.measurements;
  const nativeDimensions = [
    {
      id: "width",
      label: "Breite",
      unit: measurements?.width?.unit || "mm",
      value: measurements?.width?.value ?? product.width,
    },
    {
      id: "height",
      label: "Höhe",
      unit: measurements?.height?.unit || "mm",
      value: measurements?.height?.value ?? product.height,
    },
    {
      id: "depth",
      label: "Tiefe",
      unit: measurements?.length?.unit || "mm",
      value: measurements?.length?.value ?? product.length,
    },
  ].flatMap(({ id, label, unit, value }) =>
    typeof value === "number" && Number.isFinite(value) && value > 0
      ? [{ id, label, value: formatMeasurement(value, unit) }]
      : [],
  );

  if (nativeDimensions.length > 0) {
    return nativeDimensions;
  }

  const propertyDimensions = new Map<string, number>();

  for (const property of product.properties ?? []) {
    const groupName = getShopwarePlainText(
      property.group?.translated?.name?.trim() ||
        property.group?.name?.trim() ||
        "",
    );
    const propertyValue = getShopwarePlainText(
      property.translated?.name?.trim() || property.name?.trim() || "",
    );
    const numericValue = Number.parseFloat(propertyValue.replace(",", "."));

    if (
      groupName &&
      !propertyDimensions.has(normalizePropertyGroupName(groupName)) &&
      Number.isFinite(numericValue) &&
      numericValue > 0
    ) {
      propertyDimensions.set(
        normalizePropertyGroupName(groupName),
        numericValue,
      );
    }
  }

  return [
    { id: "width", key: "breite", label: "Breite" },
    { id: "height", key: "hohe", label: "Höhe" },
    {
      id: "depth",
      key: propertyDimensions.has("tiefe") ? "tiefe" : "lange",
      label: "Tiefe",
    },
  ].flatMap(({ id, key, label }) => {
    const value = propertyDimensions.get(key);

    return value ? [{ id, label, value: formatMeasurement(value, "cm") }] : [];
  });
}

const sizeVariantGroupNames = new Set([
  "breite",
  "breite liegeflache",
  "grosse",
  "groesse",
  "hohe",
  "lange",
  "lange liegeflache",
  "size",
  "tiefe",
]);

const colorVariantGroupNames = new Set([
  "color",
  "colour",
  "farbe",
  "grundfarbe",
]);

function getConfiguratorOptionHex(
  option: components["schemas"]["PropertyGroupOption"],
) {
  const hex =
    option.translated?.colorHexCode?.trim() || option.colorHexCode?.trim();

  return hex && /^#[0-9a-f]{3,8}$/i.test(hex) ? hex : undefined;
}

function getColorVariantGroups(
  product: ShopwareProduct,
  configurator: ShopwareProductDetailInput["configurator"],
): ShopProductVariantGroup[] {
  const selectedOptionIds = new Set(product.optionIds ?? []);

  return (configurator ?? []).flatMap((group) => {
    const groupLabel = getShopwarePlainText(
      group.translated?.name?.trim() || group.name?.trim() || "",
    );
    const options = group.options ?? [];

    if (
      !groupLabel ||
      !colorVariantGroupNames.has(normalizePropertyGroupName(groupLabel)) ||
      options.length < 2
    ) {
      return [];
    }

    const groupOptionIds = new Set(options.map((option) => option.id));
    const otherSelectedOptionIds = Array.from(selectedOptionIds).filter(
      (optionId) => !groupOptionIds.has(optionId),
    );
    const mappedOptions = options
      .map((option) => ({
        available: option.combinable !== false,
        hex: getConfiguratorOptionHex(option),
        id: option.id,
        label: getShopwarePlainText(
          option.translated?.name?.trim() || option.name?.trim() || "",
        ),
        selected: selectedOptionIds.has(option.id),
        selection: [...otherSelectedOptionIds, option.id],
      }))
      .filter((option) => option.label);

    return mappedOptions.length > 1
      ? [{ id: group.id, label: groupLabel, options: mappedOptions }]
      : [];
  });
}

function getSizeVariantGroups(
  product: ShopwareProduct,
  configurator: ShopwareProductDetailInput["configurator"],
): ShopProductVariantGroup[] {
  const selectedOptionIds = new Set(product.optionIds ?? []);

  return (configurator ?? []).flatMap((group) => {
    const groupLabel = getShopwarePlainText(
      group.translated?.name?.trim() || group.name?.trim() || "",
    );
    const options = group.options ?? [];

    if (
      !groupLabel ||
      !sizeVariantGroupNames.has(normalizePropertyGroupName(groupLabel)) ||
      options.length < 2
    ) {
      return [];
    }

    const groupOptionIds = new Set(options.map((option) => option.id));
    const otherSelectedOptionIds = Array.from(selectedOptionIds).filter(
      (optionId) => !groupOptionIds.has(optionId),
    );
    const isNumericDimension = !["grosse", "groesse", "size"].includes(
      normalizePropertyGroupName(groupLabel),
    );
    const mappedOptions = options
      .map((option) => {
        const optionLabel = getShopwarePlainText(
          option.translated?.name?.trim() || option.name?.trim() || "",
        );
        const label =
          isNumericDimension && /^\d+(?:[.,]\d+)?$/.test(optionLabel)
            ? `${optionLabel} cm`
            : optionLabel;

        return {
          available: option.combinable !== false,
          id: option.id,
          label,
          selected: selectedOptionIds.has(option.id),
          selection: [...otherSelectedOptionIds, option.id],
        };
      })
      .filter((option) => option.label)
      .toSorted((first, second) =>
        first.label.localeCompare(second.label, "de-DE", { numeric: true }),
      );

    return mappedOptions.length > 1
      ? [{ id: group.id, label: groupLabel, options: mappedOptions }]
      : [];
  });
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
  const specifications: ShopProductSpecification[] = [];
  const propertyGroups = new Map<
    string,
    { id: string; label: string; values: Set<string> }
  >();

  function addSpecification(
    id: string,
    label: string,
    value: string | number | null | undefined,
  ) {
    const normalizedValue = String(value ?? "").trim();

    if (normalizedValue) {
      specifications.push({ id, label, value: normalizedValue });
    }
  }

  const manufacturer = product.manufacturer
    ? getShopwarePlainText(
        product.manufacturer.translated?.name?.trim() ||
          product.manufacturer.name?.trim() ||
          "",
      )
    : "";
  const unit = product.unit
    ? getShopwarePlainText(
        product.unit.translated?.shortCode?.trim() ||
          product.unit.shortCode?.trim() ||
          product.unit.translated?.name?.trim() ||
          product.unit.name?.trim() ||
          "",
      )
    : "";
  const weight =
    product.measurements?.weight?.value ?? product.weight ?? undefined;
  const weightUnit = product.measurements?.weight?.unit || "kg";

  addSpecification("article-number", "Artikelnummer", product.productNumber);
  addSpecification("ean", "EAN", product.ean);
  addSpecification("manufacturer", "Hersteller", manufacturer);
  addSpecification("category", "Kategorie", listingProduct.categoryLabel);

  if (product.purchaseUnit && unit) {
    addSpecification(
      "purchase-unit",
      "Verkaufseinheit",
      `${product.purchaseUnit} ${unit}`,
    );
  }

  if (
    typeof weight === "number" &&
    Number.isFinite(weight) &&
    weight > 0 &&
    weight <= 2000
  ) {
    addSpecification("weight", "Gewicht", `${weight} ${weightUnit}`);
  }

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

  specifications.push(
    ...Array.from(propertyGroups.values(), ({ id, label, values }) => ({
      id,
      label,
      value: Array.from(values).join(", "),
    })),
  );

  return specifications;
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

function getRelatedProducts(
  productId: string,
  crossSellings: ShopwareProductDetailInput["crossSellings"],
) {
  const products = new Map<string, ShopwareProduct>();

  for (const crossSelling of (crossSellings ?? []).toSorted(
    (first, second) =>
      (first.crossSelling.position ?? 0) - (second.crossSelling.position ?? 0),
  )) {
    for (const product of crossSelling.products) {
      if (product.id !== productId && !products.has(product.id)) {
        products.set(product.id, product);
      }
    }
  }

  return Array.from(products.values(), mapShopwareProduct);
}

export function mapShopwareProductDetail({
  configurator,
  crossSellings,
  currency,
  locale,
  product,
}: ShopwareProductDetailInput): ShopProductPageData {
  const listingProduct = mapShopwareProduct(product, 0);
  const longDescriptionSource =
    product.translated.description?.trim() || product.description?.trim() || "";
  const longDescription =
    getShopwarePlainText(longDescriptionSource) || listingProduct.description;
  const longDescriptionHtml =
    getDescriptionHtml(longDescriptionSource) ||
    sanitizeHtml(listingProduct.description, {
      allowedAttributes: {},
      allowedTags: [],
    });

  return {
    currency,
    locale,
    product: {
      ...listingProduct,
      accessories: [],
      articleNumber: product.productNumber,
      availability: getAvailability(product),
      colorVariantGroups: getColorVariantGroups(product, configurator),
      deliveryEstimate: getDeliveryEstimate(product),
      dimensions: getDimensions(product),
      gallery: getGallery(product, listingProduct),
      isAvailable: product.available,
      longDescription,
      longDescriptionHtml,
      services: [],
      shippingFree: product.shippingFree,
      sizeVariantGroups: getSizeVariantGroups(product, configurator),
      specifications: getSpecifications(product, listingProduct),
      variantParentId: product.parentId ?? product.id,
    },
    relatedProducts: getRelatedProducts(product.id, crossSellings),
  };
}
