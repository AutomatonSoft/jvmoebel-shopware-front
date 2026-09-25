import {
  AtSign,
  ClipboardCheck,
  CreditCard,
  House,
  MapPin,
  MessageSquareText,
  PackageOpen,
  PencilLine,
  ShoppingBag,
  Truck,
} from "lucide-react";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import type { ShopCart, ShopCartItem } from "@/features/cart/model/cart";
import type {
  CheckoutDisplayAddress,
  CheckoutMethodSelection,
  CheckoutOption,
} from "@/features/checkout/model/checkout";

function AddressDetails({
  address,
}: Readonly<{ address: CheckoutDisplayAddress }>) {
  return (
    <address className="mt-3 text-sm leading-6 not-italic text-muted-foreground">
      <strong className="block font-semibold text-foreground">
        {address.firstName} {address.lastName}
      </strong>
      <span className="block">{address.street}</span>
      {address.additionalAddressLine1 && (
        <span className="block">{address.additionalAddressLine1}</span>
      )}
      <span className="block">
        {address.zipcode} {address.city}
      </span>
      {address.country && <span className="block">{address.country}</span>}
    </address>
  );
}

function ReviewSection({
  action,
  children,
  icon: Icon,
  title,
}: Readonly<{
  action: Route;
  children: ReactNode;
  icon: typeof MapPin;
  title: string;
}>) {
  return (
    <section className="rounded-2xl bg-secondary/45 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-4">
        <h2 className="flex items-center gap-2.5 text-sm font-semibold">
          <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-card text-primary shadow-sm ring-1 ring-border/70">
            <Icon aria-hidden="true" className="size-3.5" strokeWidth={1.8} />
          </span>
          {title}
        </h2>
        <Link
          aria-label={`${title} bearbeiten`}
          className="grid size-9 shrink-0 place-items-center rounded-full border border-border/80 bg-card text-muted-foreground shadow-sm transition-[color,border-color,transform] hover:border-primary/40 hover:text-primary active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          href={action}
          title={`${title} bearbeiten`}
        >
          <PencilLine aria-hidden="true" className="size-4" strokeWidth={1.8} />
        </Link>
      </div>
      {children}
    </section>
  );
}

function ReviewCartItem({
  currency,
  item,
  locale,
}: Readonly<{
  currency: string;
  item: ShopCartItem;
  locale: string;
}>) {
  const formatter = new Intl.NumberFormat(locale, {
    currency,
    minimumFractionDigits: 2,
    style: "currency",
  });
  const image = item.image ? (
    <Image
      alt={item.image.alt}
      className="object-contain"
      fill
      sizes="72px"
      src={item.image.url}
    />
  ) : (
    <ShoppingBag
      aria-hidden="true"
      className="size-6 text-muted-foreground"
      strokeWidth={1.5}
    />
  );

  return (
    <article className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-4 py-4 first:pt-0 last:pb-0 sm:grid-cols-[4.5rem_minmax(0,1fr)_auto] sm:items-center">
      {item.url ? (
        <Link
          aria-label={item.label}
          className="relative grid aspect-square place-items-center overflow-hidden rounded-xl bg-muted/70 p-2"
          href={item.url as Route}
          target="_blank"
        >
          {image}
        </Link>
      ) : (
        <div className="relative grid aspect-square place-items-center overflow-hidden rounded-xl bg-muted/70 p-2">
          {image}
        </div>
      )}

      <div className="min-w-0">
        <h3 className="text-sm leading-5 font-semibold tracking-[-0.015em]">
          {item.url ? (
            <Link
              className="hover:text-primary"
              href={item.url as Route}
              target="_blank"
            >
              {item.label}
            </Link>
          ) : (
            item.label
          )}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          {item.quantity} × {formatter.format(item.unitPrice)}
        </p>
        {item.selectedOptions.length > 0 && (
          <p className="mt-1.5 line-clamp-1 text-xs text-muted-foreground">
            {item.selectedOptions
              .map((option) => `${option.label}: ${option.value}`)
              .join(" · ")}
          </p>
        )}
      </div>

      <strong className="col-span-2 text-right text-sm tracking-[-0.02em] sm:col-span-1">
        {formatter.format(item.totalPrice)}
      </strong>
    </article>
  );
}

function getOptionLabel(options: readonly CheckoutOption[], id: string) {
  return options.find((option) => option.id === id)?.label ?? "Nicht verfügbar";
}

export function CheckoutReview({
  billingAddress,
  cart,
  deliveryAddress,
  email,
  paymentMethods,
  selection,
  shippingMethods,
}: Readonly<{
  billingAddress: CheckoutDisplayAddress;
  cart: ShopCart;
  deliveryAddress: CheckoutDisplayAddress;
  email: string;
  paymentMethods: readonly CheckoutOption[];
  selection: CheckoutMethodSelection;
  shippingMethods: readonly CheckoutOption[];
}>) {
  return (
    <>
      <section className="rounded-3xl border bg-card p-4 shadow-[0_24px_70px_-58px_rgba(21,21,19,0.7)] sm:p-6">
        <div className="flex items-center gap-3 border-b pb-4">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/10">
            <ClipboardCheck
              aria-hidden="true"
              className="size-4"
              strokeWidth={1.7}
            />
          </span>
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              Bestellung prüfen
            </h2>
            <p className="mt-0.5 text-xs leading-5 text-muted-foreground sm:text-sm">
              Prüfen Sie alle Angaben, bevor Sie zahlungspflichtig bestellen.
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <ReviewSection
            action="/kasse?schritt=lieferadresse&zurueck=bestaetigung"
            icon={MapPin}
            title="Lieferadresse"
          >
            <AddressDetails address={deliveryAddress} />
          </ReviewSection>
          <ReviewSection
            action="/kasse?schritt=adresse&zurueck=bestaetigung"
            icon={House}
            title="Rechnungsadresse"
          >
            <AddressDetails address={billingAddress} />
          </ReviewSection>
          <ReviewSection
            action="/kasse?schritt=email&zurueck=bestaetigung"
            icon={AtSign}
            title="E-Mail-Adresse"
          >
            <p className="mt-3 break-all text-sm font-medium">{email}</p>
          </ReviewSection>
          <ReviewSection
            action="/kasse?schritt=zahlung"
            icon={Truck}
            title="Versandart"
          >
            <p className="mt-3 text-sm font-medium">
              {getOptionLabel(shippingMethods, selection.shippingMethodId)}
            </p>
          </ReviewSection>
          <div
            className={selection.customerComment ? undefined : "sm:col-span-2"}
          >
            <ReviewSection
              action="/kasse?schritt=zahlung"
              icon={CreditCard}
              title="Zahlungsart"
            >
              <p className="mt-3 text-sm font-medium">
                {getOptionLabel(paymentMethods, selection.paymentMethodId)}
              </p>
            </ReviewSection>
          </div>
          {selection.customerComment && (
            <ReviewSection
              action="/kasse?schritt=zahlung"
              icon={MessageSquareText}
              title="Hinweis zur Bestellung"
            >
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {selection.customerComment}
              </p>
            </ReviewSection>
          )}
        </div>
      </section>

      <section className="mt-4 rounded-3xl border bg-card p-5 shadow-[0_20px_60px_-55px_rgba(21,21,19,0.65)] sm:p-6">
        <div className="flex items-center justify-between gap-4 border-b pb-4">
          <h2 className="flex items-center gap-2.5 text-sm font-semibold">
            <PackageOpen
              aria-hidden="true"
              className="size-4 text-primary"
              strokeWidth={1.8}
            />
            Ihre Artikel
          </h2>
          <span className="rounded-full bg-secondary px-2.5 py-1 text-[0.6875rem] font-medium text-muted-foreground">
            {cart.items.reduce((total, item) => total + item.quantity, 0)}
            {" Artikel"}
          </span>
        </div>
        <div className="divide-y">
          {cart.items.map((item) => (
            <ReviewCartItem
              currency={cart.currency}
              item={item}
              key={item.id}
              locale={cart.locale}
            />
          ))}
        </div>
      </section>
    </>
  );
}
