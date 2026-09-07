"use client";

import {
  CalendarDays,
  ChevronRight,
  Info,
  Mail,
  MapPin,
  Recycle,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  Wrench,
} from "lucide-react";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import type { ShopProductDetail } from "@/features/catalog/model/product-detail";
import type { ShopProductSize } from "@/features/catalog/model/product-listing";

const sizeLabels: Record<ShopProductSize, string> = {
  small: "Kompakt",
  medium: "Mittel",
  large: "Groß",
  "extra-large": "Extra groß",
};

type ProductPurchasePanelProps = Readonly<{
  currency: string;
  locale: string;
  product: ShopProductDetail;
}>;

export function ProductPurchasePanel({
  currency,
  locale,
  product,
}: ProductPurchasePanelProps) {
  const [selectedColor, setSelectedColor] = useState(
    product.colors[0]?.value ?? "",
  );
  const [selectedSize, setSelectedSize] = useState<ShopProductSize | undefined>(
    product.sizes[0],
  );
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [selectedAccessoryIds, setSelectedAccessoryIds] = useState<string[]>(
    [],
  );
  const [postalCode, setPostalCode] = useState("");
  const [confirmedPostalCode, setConfirmedPostalCode] = useState("");
  const [postalCodeError, setPostalCodeError] = useState("");
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
  const discount =
    product.previousPrice && product.previousPrice > product.unitPrice
      ? Math.round((1 - product.unitPrice / product.previousPrice) * 100)
      : undefined;
  const selectedColorLabel = product.colors.find(
    (color) => color.value === selectedColor,
  )?.label;
  const postalCodeIsConfirmed =
    postalCode.length === 5 && confirmedPostalCode === postalCode;
  const inquiryDetails = [
    selectedColorLabel ? `Farbe: ${selectedColorLabel}` : undefined,
    selectedSize ? `Größe: ${sizeLabels[selectedSize]}` : undefined,
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
  const inquirySubject = encodeURIComponent(
    `Produktanfrage: ${product.name} (${product.articleNumber})${
      inquiryDetails.length > 0 ? ` — ${inquiryDetails.join(", ")}` : ""
    }`,
  );
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

  return (
    <aside className="min-w-0 lg:sticky lg:top-24 lg:max-h-[calc(100dvh-7rem)] lg:overflow-y-auto lg:overscroll-contain lg:pr-4 lg:[scrollbar-gutter:stable] lg:[scrollbar-width:thin]">
      <header className="border-b pb-6">
        <h1 className="text-3xl leading-[1.08] font-semibold tracking-[-0.04em] text-pretty [overflow-wrap:anywhere] sm:text-4xl">
          {product.name}
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {product.description}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <span className="font-semibold underline decoration-foreground/30 underline-offset-4">
            {product.company}
          </span>
          {product.rating !== undefined && (
            <span className="flex items-center gap-1.5">
              <Star className="size-4 fill-primary text-primary" />
              <strong>{product.rating.toFixed(1)}</strong>
              {product.reviewCount !== undefined && (
                <span className="text-muted-foreground underline decoration-foreground/25 underline-offset-4">
                  ({product.reviewCount})
                </span>
              )}
            </span>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <strong className="text-3xl leading-none font-bold sm:text-4xl">
            {priceFormatter.format(product.unitPrice)}
          </strong>
          {product.previousPrice && (
            <del className="text-sm text-muted-foreground">
              {priceFormatter.format(product.previousPrice)}
            </del>
          )}
          {discount && (
            <span className="rounded-full bg-primary px-2.5 py-1 text-[0.625rem] font-bold text-primary-foreground">
              −{discount}%
            </span>
          )}
          <span className="w-full pt-1 text-xs text-muted-foreground">
            inkl. MwSt.{" "}
            {product.shippingFree
              ? "inkl. Versandkosten"
              : "zzgl. Versandkosten"}
          </span>
        </div>
      </header>

      <section className="border-b py-5">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <span
            aria-hidden="true"
            className={`size-2.5 rounded-full ${product.isAvailable === false ? "bg-destructive" : product.isAvailable === true ? "bg-emerald-600" : "bg-muted-foreground"}`}
          />
          {product.availability}
        </p>
        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <p className="flex items-start gap-2.5">
            <CalendarDays className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <span>
              Lieferung in <strong>{product.deliveryEstimate}</strong>
            </span>
          </p>
          {product.deliveryMethod && (
            <p className="flex items-start gap-2.5">
              <Truck className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <span>{product.deliveryMethod}</span>
            </p>
          )}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Verkauf und Versand durch:&nbsp;
          <strong className="font-semibold text-foreground">JVMöbel</strong>
        </p>
      </section>

      <div
        className={
          product.colors.length > 0 || product.sizes.length > 0
            ? "space-y-2 border-b py-5"
            : "hidden"
        }
      >
        {product.colors.length > 0 && (
          <details className="group overflow-hidden rounded-xl border bg-card">
            <summary className="flex min-h-20 cursor-pointer list-none items-center gap-4 px-4 py-3 [&::-webkit-details-marker]:hidden">
              <span className="min-w-0 flex-1">
                <strong className="block text-sm font-semibold">
                  Farbe{" "}
                  <span className="font-normal">
                    ({product.colors.length} Optionen)
                  </span>
                </strong>
                <span className="mt-1 block truncate text-sm text-muted-foreground">
                  {selectedColorLabel}
                </span>
              </span>
              <span
                aria-hidden="true"
                className="size-12 shrink-0 rounded-full border-2 border-background shadow-[0_0_0_1px_var(--color-border)]"
                style={{
                  backgroundColor:
                    product.colors.find(
                      (color) => color.value === selectedColor,
                    )?.hex ?? "transparent",
                }}
              />
              <ChevronRight className="size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
            </summary>
            <div className="flex flex-wrap gap-3 border-t bg-muted/20 px-4 py-4">
              {product.colors.map((color) => {
                const isSelected = color.value === selectedColor;

                return (
                  <button
                    aria-label={`${color.label}${isSelected ? ", ausgewählt" : ""}`}
                    aria-pressed={isSelected}
                    className={`size-10 cursor-pointer rounded-full border-2 border-background shadow-[0_0_0_1px_var(--color-border)] transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${isSelected ? "shadow-[0_0_0_2px_var(--color-foreground)]" : ""}`}
                    key={color.value}
                    onClick={() => setSelectedColor(color.value)}
                    style={{ backgroundColor: color.hex }}
                    title={color.label}
                    type="button"
                  />
                );
              })}
            </div>
          </details>
        )}

        {product.sizes.length > 0 && (
          <details className="group overflow-hidden rounded-xl border bg-card">
            <summary className="flex min-h-20 cursor-pointer list-none items-center gap-4 px-4 py-3 [&::-webkit-details-marker]:hidden">
              <span className="min-w-0 flex-1">
                <strong className="block text-sm font-semibold">
                  Größe{" "}
                  <span className="font-normal">
                    ({product.sizes.length} Optionen)
                  </span>
                </strong>
                <span className="mt-1 block truncate text-sm text-muted-foreground">
                  {selectedSize ? sizeLabels[selectedSize] : "Bitte auswählen"}
                </span>
              </span>
              <ChevronRight className="size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
            </summary>
            <div className="grid gap-2 border-t bg-muted/20 px-4 py-4 sm:grid-cols-2">
              {product.sizes.map((size) => {
                const isSelected = size === selectedSize;

                return (
                  <button
                    aria-pressed={isSelected}
                    className={`flex min-h-12 items-center rounded-xl border px-4 py-3 text-left text-sm transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${isSelected ? "border-foreground bg-foreground text-background" : "bg-card hover:border-foreground/40"}`}
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    type="button"
                  >
                    <strong className="font-semibold">
                      {sizeLabels[size]}
                    </strong>
                  </button>
                );
              })}
            </div>
          </details>
        )}
      </div>

      {product.services.length > 0 && (
        <section className="border-b py-6">
          <h2 className="text-lg font-semibold">Wähle aus unseren Services</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Gib deine Postleitzahl ein, um die Services in deiner Region
            anzuzeigen.
          </p>

          <form
            className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] gap-2"
            onSubmit={handlePostalCodeSubmit}
          >
            <div>
              <Input
                aria-describedby="product-service-postal-code-message"
                aria-invalid={Boolean(postalCodeError)}
                className="h-11 bg-background"
                inputMode="numeric"
                maxLength={5}
                name="postalCode"
                onChange={(event) => {
                  setPostalCode(
                    event.target.value.replace(/\D/g, "").slice(0, 5),
                  );
                  setPostalCodeError("");
                }}
                pattern="[0-9]{5}"
                placeholder="Postleitzahl"
                value={postalCode}
              />
            </div>
            <Button className="h-11" type="submit" variant="outline">
              Speichern
            </Button>
          </form>

          <p
            aria-live="polite"
            className={`mt-2 flex min-h-5 items-center gap-1.5 text-xs ${postalCodeError ? "text-destructive" : "text-muted-foreground"}`}
            id="product-service-postal-code-message"
          >
            {postalCodeError ||
              (postalCodeIsConfirmed && (
                <>
                  <MapPin className="size-3.5" />
                  Services für {confirmedPostalCode} verfügbar
                </>
              ))}
          </p>

          <div className="mt-3 space-y-2.5">
            {product.services.map((service) => {
              const isSelected = selectedServiceIds.includes(service.id);
              const ServiceIcon =
                service.id === "assembly"
                  ? Wrench
                  : service.id === "stain-protection"
                    ? Sparkles
                    : Recycle;

              return (
                <label
                  className={`grid grid-cols-[auto_auto_minmax(0,1fr)_auto_auto] items-center gap-3 rounded-xl border p-4 transition-colors ${service.available ? "cursor-pointer" : "cursor-not-allowed opacity-45"} ${isSelected ? "border-primary bg-primary/5" : service.available ? "bg-card hover:border-foreground/35" : "bg-muted/35"}`}
                  key={service.id}
                >
                  <Checkbox
                    checked={isSelected}
                    className="rounded-[5px]"
                    disabled={!service.available}
                    onCheckedChange={(checked) => {
                      setSelectedServiceIds((currentIds) =>
                        checked
                          ? currentIds.includes(service.id)
                            ? currentIds
                            : [...currentIds, service.id]
                          : currentIds.filter((id) => id !== service.id),
                      );
                    }}
                  />
                  <ServiceIcon
                    aria-hidden="true"
                    className="size-5 shrink-0 text-primary"
                  />
                  <span className="min-w-0">
                    <strong className="block text-sm font-semibold">
                      {service.name}
                    </strong>
                    <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                      {service.description}
                    </span>
                  </span>
                  <strong className="text-sm whitespace-nowrap">
                    {optionPriceFormatter.format(service.price)}
                  </strong>
                  <Info
                    aria-label={`Mehr Informationen zu ${service.name}`}
                    className="size-4 shrink-0 text-muted-foreground"
                  />
                </label>
              );
            })}
          </div>
        </section>
      )}

      {product.accessories.length > 0 && (
        <section className="border-b py-6">
          <h2 className="text-lg font-semibold">Passendes Zubehör</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Praktische Ergänzungen für Ihr neues Möbelstück.
          </p>

          <div className="mt-4 space-y-2.5">
            {product.accessories.map((accessory) => {
              const isSelected = selectedAccessoryIds.includes(accessory.id);

              return (
                <label
                  className={`grid cursor-pointer grid-cols-[auto_1fr_auto] items-start gap-3 rounded-xl border p-4 transition-colors ${isSelected ? "border-primary bg-primary/5" : "border-transparent bg-muted/55 hover:border-foreground/25"}`}
                  key={accessory.id}
                >
                  <Checkbox
                    checked={isSelected}
                    className="mt-0.5 rounded-[5px] bg-background"
                    onCheckedChange={(checked) => {
                      setSelectedAccessoryIds((currentIds) =>
                        checked
                          ? currentIds.includes(accessory.id)
                            ? currentIds
                            : [...currentIds, accessory.id]
                          : currentIds.filter((id) => id !== accessory.id),
                      );
                    }}
                  />
                  <span className="min-w-0">
                    <strong className="block text-sm font-semibold">
                      {accessory.name}
                    </strong>
                    <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                      {accessory.description}
                    </span>
                  </span>
                  <strong className="text-sm whitespace-nowrap">
                    {optionPriceFormatter.format(accessory.price)}
                  </strong>
                </label>
              );
            })}
          </div>
        </section>
      )}

      <div className="sticky bottom-0 z-10 -mx-1 bg-background/95 px-1 pt-5 pb-1 backdrop-blur">
        <Button
          className="h-12 w-full rounded-xl text-base shadow-sm"
          nativeButton={false}
          render={
            <a href={`mailto:info@jvmoebel.de?subject=${inquirySubject}`} />
          }
          size="lg"
        >
          Produkt anfragen
          <Mail className="size-4" />
        </Button>
        <p className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="size-3.5" />
          Persönliche Beratung vor der Bestellung
        </p>
      </div>
    </aside>
  );
}
