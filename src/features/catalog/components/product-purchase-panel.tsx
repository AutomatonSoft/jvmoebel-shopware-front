"use client";

import { useState, type FormEvent } from "react";

import type { ShopProductDetail } from "@/features/catalog/model/product-detail";
import {
  ProductAccessoryOptions,
  ProductPurchaseActions,
  ProductPurchaseSummary,
  ProductServiceOptions,
  ProductVariantSelectors,
} from "@/features/catalog/components/product-purchase-panel-sections";

type ProductPurchasePanelProps = Readonly<{
  currency: string;
  locale: string;
  product: ShopProductDetail;
  variantSelectionFailed?: boolean;
}>;

function getProductDiscount(product: ShopProductDetail) {
  if (!product.previousPrice || product.previousPrice <= product.unitPrice) {
    return undefined;
  }

  return Math.round((1 - product.unitPrice / product.previousPrice) * 100);
}

function getUpdatedSelectedIds(
  currentIds: string[],
  id: string,
  selected: boolean,
) {
  if (!selected) {
    return currentIds.filter((currentId) => currentId !== id);
  }

  return currentIds.includes(id) ? currentIds : [...currentIds, id];
}

function getInquirySubject({
  confirmedPostalCode,
  product,
  selectedAccessoryIds,
  selectedServiceIds,
}: {
  confirmedPostalCode: string;
  product: ShopProductDetail;
  selectedAccessoryIds: readonly string[];
  selectedServiceIds: readonly string[];
}) {
  const selectedColorVariant = product.colorVariantGroups
    .flatMap((group) => group.options)
    .find((option) => option.selected);
  const selectedVariantLabels = product.sizeVariantGroups.flatMap((group) => {
    const selectedOption = group.options.find((option) => option.selected);

    return selectedOption ? [`${group.label}: ${selectedOption.label}`] : [];
  });
  const inquiryDetails = [
    selectedColorVariant ? `Farbe: ${selectedColorVariant.label}` : undefined,
    ...selectedVariantLabels,
    confirmedPostalCode ? `Postleitzahl: ${confirmedPostalCode}` : undefined,
    ...product.services
      .filter(
        (service) =>
          service.available && selectedServiceIds.includes(service.id),
      )
      .map((service) => `Service: ${service.name}`),
    ...product.accessories
      .filter((accessory) => selectedAccessoryIds.includes(accessory.id))
      .map((accessory) => `Zubehör: ${accessory.name}`),
  ].filter(Boolean);

  return encodeURIComponent(
    `Produktanfrage: ${product.name} (${product.articleNumber})${
      inquiryDetails.length > 0 ? ` — ${inquiryDetails.join(", ")}` : ""
    }`,
  );
}

function useProductPurchaseState() {
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [selectedAccessoryIds, setSelectedAccessoryIds] = useState<string[]>(
    [],
  );
  const [postalCode, setPostalCode] = useState("");
  const [confirmedPostalCode, setConfirmedPostalCode] = useState("");
  const [postalCodeError, setPostalCodeError] = useState("");

  const handlePostalCodeSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!/^\d{5}$/.test(postalCode)) {
      setConfirmedPostalCode("");
      setPostalCodeError("Bitte geben Sie eine gültige fünfstellige PLZ ein.");
      return;
    }

    setConfirmedPostalCode(postalCode);
    setPostalCodeError("");
  };

  return {
    confirmedPostalCode,
    handlePostalCodeSubmit,
    postalCode,
    postalCodeError,
    setPostalCode: (value: string) => {
      setPostalCode(value.replace(/\D/g, "").slice(0, 5));
      setPostalCodeError("");
    },
    selectedAccessoryIds,
    selectedServiceIds,
    toggleAccessory: (id: string, selected: boolean) => {
      setSelectedAccessoryIds((currentIds) =>
        getUpdatedSelectedIds(currentIds, id, selected),
      );
    },
    toggleService: (id: string, selected: boolean) => {
      setSelectedServiceIds((currentIds) =>
        getUpdatedSelectedIds(currentIds, id, selected),
      );
    },
  };
}

export function ProductPurchasePanel({
  currency,
  locale,
  product,
  variantSelectionFailed,
}: ProductPurchasePanelProps) {
  const purchaseState = useProductPurchaseState();
  const priceFormatter = new Intl.NumberFormat(locale, {
    currency,
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    style: "currency",
  });
  const optionPriceFormatter = new Intl.NumberFormat(locale, {
    currency,
    minimumFractionDigits: 2,
    style: "currency",
  });
  const postalCodeIsConfirmed =
    purchaseState.postalCode.length === 5 &&
    purchaseState.confirmedPostalCode === purchaseState.postalCode;
  const inquirySubject = getInquirySubject({
    confirmedPostalCode: purchaseState.confirmedPostalCode,
    product,
    selectedAccessoryIds: purchaseState.selectedAccessoryIds,
    selectedServiceIds: purchaseState.selectedServiceIds,
  });

  return (
    <aside className="min-w-0 lg:sticky lg:top-24 lg:max-h-[calc(100dvh-7rem)] lg:overflow-y-auto lg:pr-4 lg:scrollbar-gutter-stable lg:scrollbar-thin">
      <ProductPurchaseSummary
        discount={getProductDiscount(product)}
        priceFormatter={priceFormatter}
        product={product}
        variantSelectionFailed={variantSelectionFailed}
      />
      <ProductVariantSelectors product={product} />
      <ProductServiceOptions
        confirmedPostalCode={purchaseState.confirmedPostalCode}
        onPostalCodeChange={purchaseState.setPostalCode}
        onPostalCodeSubmit={purchaseState.handlePostalCodeSubmit}
        onServiceChange={purchaseState.toggleService}
        optionPriceFormatter={optionPriceFormatter}
        postalCode={purchaseState.postalCode}
        postalCodeError={purchaseState.postalCodeError}
        postalCodeIsConfirmed={postalCodeIsConfirmed}
        product={product}
        selectedServiceIds={purchaseState.selectedServiceIds}
      />
      <ProductAccessoryOptions
        onAccessoryChange={purchaseState.toggleAccessory}
        optionPriceFormatter={optionPriceFormatter}
        product={product}
        selectedAccessoryIds={purchaseState.selectedAccessoryIds}
      />
      <ProductPurchaseActions
        inquirySubject={inquirySubject}
        product={product}
      />
    </aside>
  );
}
