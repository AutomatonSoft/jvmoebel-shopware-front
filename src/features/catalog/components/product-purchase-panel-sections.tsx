import {
  CalendarDays,
  ChevronRight,
  Info,
  MapPin,
  Recycle,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  Wrench,
} from "lucide-react";
import type { FormEvent } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { addProductToCart } from "@/features/cart/server/actions";
import { selectProductVariant } from "@/features/catalog/server/actions";
import type { ShopProductDetail } from "@/features/catalog/model/product-detail";
import type { ShopProductSize } from "@/features/catalog/model/product-listing";
import { WishlistToggleButton } from "@/features/wishlist/components/wishlist-toggle-button";

const sizeLabels: Record<ShopProductSize, string> = {
  small: "Kompakt",
  medium: "Mittel",
  large: "Groß",
  "extra-large": "Extra groß",
};

function AddToCartButton({ unavailable }: Readonly<{ unavailable: boolean }>) {
  const { pending } = useFormStatus();
  const label = unavailable
    ? "Derzeit nicht verfügbar"
    : pending
      ? "Wird hinzugefügt …"
      : "In den Warenkorb";

  return (
    <Button
      aria-describedby="product-availability"
      className="h-12 w-full rounded-xl text-base shadow-sm disabled:cursor-not-allowed"
      disabled={pending || unavailable}
      size="lg"
      type="submit"
    >
      {label}
      <ShoppingBag className="size-4" />
    </Button>
  );
}

export function ProductPurchaseSummary({
  discount,
  priceFormatter,
  product,
  variantSelectionFailed,
}: {
  discount?: number;
  priceFormatter: Intl.NumberFormat;
  product: ShopProductDetail;
  variantSelectionFailed?: boolean;
}) {
  return (
    <>
      <header className="border-b pb-6">
        <h1 className="text-3xl leading-[1.08] font-semibold tracking-[-0.04em] text-pretty [overflow-wrap:anywhere] sm:text-4xl">
          {product.name}
        </h1>

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
        <p
          className="flex items-center gap-2 text-sm font-semibold"
          id="product-availability"
        >
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
          <strong className="font-semibold text-foreground">JVMoebel</strong>
        </p>
      </section>

      {variantSelectionFailed && (
        <p
          className="mt-5 rounded-xl border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          Diese Variante konnte nicht ausgewählt werden. Bitte wählen Sie eine
          andere verfügbare Option.
        </p>
      )}
    </>
  );
}

export function ProductVariantSelectors({
  product,
}: {
  product: ShopProductDetail;
}) {
  const hasProductOptions =
    product.colors.length > 0 ||
    product.colorVariantGroups.length > 0 ||
    product.sizes.length > 0 ||
    product.sizeVariantGroups.length > 0;

  return (
    <div className={hasProductOptions ? "space-y-2 border-b py-5" : "hidden"}>
      {product.colorVariantGroups.map((group) => {
        const selectedOption = group.options.find((option) => option.selected);

        return (
          <details
            className="group overflow-hidden rounded-xl border bg-card"
            key={group.id}
          >
            <summary className="flex min-h-20 cursor-pointer list-none items-center gap-4 px-4 py-3 [&::-webkit-details-marker]:hidden">
              <span className="min-w-0 flex-1">
                <strong className="block text-sm font-semibold">
                  {group.label}{" "}
                  <span className="font-normal">
                    ({group.options.length} Optionen)
                  </span>
                </strong>
                <span className="mt-1 block truncate text-sm text-muted-foreground">
                  {selectedOption?.label ?? "Bitte auswählen"}
                </span>
              </span>
              <span
                aria-hidden="true"
                className="size-12 shrink-0 rounded-full border-2 border-background bg-muted shadow-[0_0_0_1px_var(--color-border)]"
                style={{ backgroundColor: selectedOption?.hex }}
              />
              <ChevronRight className="size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
            </summary>
            <div className="grid gap-2 border-t bg-muted/20 px-4 py-4 sm:grid-cols-2">
              {group.options.map((option) => (
                <form action={selectProductVariant} key={option.id}>
                  <input
                    name="currentProductId"
                    type="hidden"
                    value={product.id}
                  />
                  <input
                    name="parentProductId"
                    type="hidden"
                    value={product.variantParentId}
                  />
                  <input
                    name="switchedGroupId"
                    type="hidden"
                    value={group.id}
                  />
                  {option.selection.map((optionId) => (
                    <input
                      key={optionId}
                      name="optionId"
                      type="hidden"
                      value={optionId}
                    />
                  ))}
                  <button
                    aria-pressed={option.selected}
                    className={`flex min-h-12 w-full items-center gap-3 rounded-xl border px-3 py-2 text-left text-sm transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-45 ${option.selected ? "border-foreground bg-foreground text-background" : "bg-card hover:border-foreground/40"}`}
                    disabled={option.selected || !option.available}
                    type="submit"
                  >
                    <span
                      aria-hidden="true"
                      className="size-7 shrink-0 rounded-full border-2 border-background bg-muted shadow-[0_0_0_1px_var(--color-border)]"
                      style={{ backgroundColor: option.hex }}
                    />
                    <strong className="font-semibold">{option.label}</strong>
                  </button>
                </form>
              ))}
            </div>
          </details>
        );
      })}

      {product.colorVariantGroups.length === 0 && product.colors.length > 0 && (
        <details className="group overflow-hidden rounded-xl border bg-card">
          <summary className="flex min-h-20 cursor-pointer list-none items-center gap-4 px-4 py-3 [&::-webkit-details-marker]:hidden">
            <span className="min-w-0 flex-1">
              <strong className="block text-sm font-semibold">
                Farbe{" "}
                <span className="font-normal">
                  ({product.colors.length}{" "}
                  {product.colors.length === 1 ? "Angabe" : "Angaben"})
                </span>
              </strong>
              <span className="mt-1 block truncate text-sm text-muted-foreground">
                {product.colors.map((color) => color.label).join(", ")}
              </span>
            </span>
            <span aria-hidden="true" className="flex -space-x-2">
              {product.colors.slice(0, 4).map((color) => (
                <span
                  className="size-8 rounded-full border-2 border-background shadow-[0_0_0_1px_var(--color-border)]"
                  key={color.value}
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </span>
            <ChevronRight className="size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
          </summary>
          <div className="border-t bg-muted/20 px-4 py-4">
            <p className="mb-3 text-xs text-muted-foreground">
              Diese Angaben beschreiben den Artikel und sind nicht auswählbar.
            </p>
            <ul className="flex flex-wrap gap-3">
              {product.colors.map((color) => (
                <li
                  className="flex items-center gap-2 rounded-full border bg-card py-2 pr-3 pl-2 text-sm"
                  key={color.value}
                >
                  <span
                    aria-hidden="true"
                    className="size-6 rounded-full border-2 border-background shadow-[0_0_0_1px_var(--color-border)]"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span>{color.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </details>
      )}

      {product.sizeVariantGroups.map((group) => {
        const selectedOption = group.options.find((option) => option.selected);

        return (
          <details
            className="group overflow-hidden rounded-xl border bg-card"
            key={group.id}
          >
            <summary className="flex min-h-20 cursor-pointer list-none items-center gap-4 px-4 py-3 [&::-webkit-details-marker]:hidden">
              <span className="min-w-0 flex-1">
                <strong className="block text-sm font-semibold">
                  {group.label}{" "}
                  <span className="font-normal">
                    ({group.options.length} Optionen)
                  </span>
                </strong>
                <span className="mt-1 block truncate text-sm text-muted-foreground">
                  {selectedOption?.label ?? "Bitte auswählen"}
                </span>
              </span>
              <ChevronRight className="size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
            </summary>
            <div className="grid gap-2 border-t bg-muted/20 px-4 py-4 sm:grid-cols-2">
              {group.options.map((option) => (
                <form action={selectProductVariant} key={option.id}>
                  <input
                    name="currentProductId"
                    type="hidden"
                    value={product.id}
                  />
                  <input
                    name="parentProductId"
                    type="hidden"
                    value={product.variantParentId}
                  />
                  <input
                    name="switchedGroupId"
                    type="hidden"
                    value={group.id}
                  />
                  {option.selection.map((optionId) => (
                    <input
                      key={optionId}
                      name="optionId"
                      type="hidden"
                      value={optionId}
                    />
                  ))}
                  <button
                    aria-pressed={option.selected}
                    className={`flex min-h-12 w-full items-center rounded-xl border px-4 py-3 text-left text-sm transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-45 ${option.selected ? "border-foreground bg-foreground text-background" : "bg-card hover:border-foreground/40"}`}
                    disabled={option.selected || !option.available}
                    type="submit"
                  >
                    <strong className="font-semibold">{option.label}</strong>
                  </button>
                </form>
              ))}
            </div>
          </details>
        );
      })}

      {product.sizeVariantGroups.length === 0 && product.sizes.length > 0 && (
        <details className="group overflow-hidden rounded-xl border bg-card">
          <summary className="flex min-h-20 cursor-pointer list-none items-center gap-4 px-4 py-3 [&::-webkit-details-marker]:hidden">
            <span className="min-w-0 flex-1">
              <strong className="block text-sm font-semibold">
                Größe{" "}
                <span className="font-normal">
                  ({product.sizes.length}{" "}
                  {product.sizes.length === 1 ? "Angabe" : "Angaben"})
                </span>
              </strong>
              <span className="mt-1 block truncate text-sm text-muted-foreground">
                {product.sizes.map((size) => sizeLabels[size]).join(", ")}
              </span>
            </span>
            <ChevronRight className="size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
          </summary>
          <div className="border-t bg-muted/20 px-4 py-4">
            <p className="mb-3 text-xs text-muted-foreground">
              Diese Angaben beschreiben den Artikel und sind nicht auswählbar.
            </p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {product.sizes.map((size) => (
                <li
                  className="flex min-h-12 items-center rounded-xl border bg-card px-4 py-3 text-sm"
                  key={size}
                >
                  <strong className="font-semibold">{sizeLabels[size]}</strong>
                </li>
              ))}
            </ul>
          </div>
        </details>
      )}
    </div>
  );
}

export function ProductServiceOptions({
  confirmedPostalCode,
  onPostalCodeChange,
  onPostalCodeSubmit,
  onServiceChange,
  optionPriceFormatter,
  postalCode,
  postalCodeError,
  postalCodeIsConfirmed,
  product,
  selectedServiceIds,
}: {
  confirmedPostalCode: string;
  onPostalCodeChange: (value: string) => void;
  onPostalCodeSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onServiceChange: (serviceId: string, selected: boolean) => void;
  optionPriceFormatter: Intl.NumberFormat;
  postalCode: string;
  postalCodeError: string;
  postalCodeIsConfirmed: boolean;
  product: ShopProductDetail;
  selectedServiceIds: readonly string[];
}) {
  if (product.services.length === 0) {
    return null;
  }

  return (
    <section className="border-b py-6">
      <h2 className="text-lg font-semibold">Wähle aus unseren Services</h2>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">
        Gib deine Postleitzahl ein, um die Services in deiner Region anzuzeigen.
      </p>

      <form
        className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] gap-2"
        onSubmit={onPostalCodeSubmit}
      >
        <div>
          <Input
            aria-describedby="product-service-postal-code-message"
            aria-invalid={Boolean(postalCodeError)}
            className="h-11 bg-background"
            inputMode="numeric"
            maxLength={5}
            name="postalCode"
            onChange={(event) => onPostalCodeChange(event.target.value)}
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
                onCheckedChange={(checked) =>
                  onServiceChange(service.id, checked === true)
                }
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
  );
}

export function ProductAccessoryOptions({
  onAccessoryChange,
  optionPriceFormatter,
  product,
  selectedAccessoryIds,
}: {
  onAccessoryChange: (accessoryId: string, selected: boolean) => void;
  optionPriceFormatter: Intl.NumberFormat;
  product: ShopProductDetail;
  selectedAccessoryIds: readonly string[];
}) {
  if (product.accessories.length === 0) {
    return null;
  }

  return (
    <section className="border-b py-6">
      <h2 className="text-lg font-semibold">Passendes Zubehör</h2>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">
        Praktische Ergänzungen für Ihr neues Moebelstück.
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
                onCheckedChange={(checked) =>
                  onAccessoryChange(accessory.id, checked === true)
                }
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
  );
}

export function ProductPurchaseActions({
  inquirySubject,
  product,
}: {
  inquirySubject: string;
  product: ShopProductDetail;
}) {
  return (
    <div className="sticky bottom-0 z-10 -mx-1 bg-background/95 px-1 pt-5 pb-1 backdrop-blur">
      <form action={addProductToCart}>
        <input name="productId" type="hidden" value={product.id} />
        <AddToCartButton unavailable={product.isAvailable === false} />
      </form>
      <WishlistToggleButton
        className="mt-2"
        productId={product.id}
        productName={product.name}
        variant="detail"
      />
      <a
        className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-foreground"
        href={`mailto:info@jvmoebel.de?subject=${inquirySubject}`}
      >
        <ShieldCheck className="size-3.5" />
        Persönliche Beratung vor der Bestellung
      </a>
    </div>
  );
}
