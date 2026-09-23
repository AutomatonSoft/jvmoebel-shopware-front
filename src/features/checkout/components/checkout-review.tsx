import {
  CreditCard,
  Mail,
  MapPin,
  MessageSquareText,
  ReceiptText,
  Truck,
} from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { CartLineItem } from "@/features/cart/components/cart-line-item";
import type {
  CheckoutDisplayAddress,
  CheckoutMethodSelection,
  CheckoutOption,
} from "@/features/checkout/model/checkout";
import type { ShopCart } from "@/features/cart/model/cart";

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
    <section className="rounded-2xl border bg-card p-5">
      <div className="flex items-center justify-between gap-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <Icon aria-hidden="true" className="size-4 text-primary" />
          {title}
        </h2>
        <Link
          className="text-xs font-semibold text-primary underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-primary"
          href={action}
        >
          Ändern
        </Link>
      </div>
      {children}
    </section>
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
      <section className="rounded-3xl border bg-card p-5 shadow-[0_24px_70px_-58px_rgba(21,21,19,0.7)] sm:p-7">
        <div className="flex gap-4 border-b pb-6">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
            <ReceiptText aria-hidden="true" className="size-5" />
          </span>
          <div>
            <h2 className="text-xl font-semibold tracking-[-0.03em]">
              Bestellung prüfen
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Prüfen Sie alle Angaben, bevor Sie zahlungspflichtig bestellen.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          <ReviewSection
            action="/kasse?schritt=lieferadresse&zurueck=bestaetigung"
            icon={MapPin}
            title="Lieferadresse"
          >
            <AddressDetails address={deliveryAddress} />
          </ReviewSection>
          <ReviewSection
            action="/kasse?schritt=adresse&zurueck=bestaetigung"
            icon={MapPin}
            title="Rechnungsadresse"
          >
            <AddressDetails address={billingAddress} />
          </ReviewSection>
          <ReviewSection
            action="/kasse?schritt=email&zurueck=bestaetigung"
            icon={Mail}
            title="E-Mail-Adresse"
          >
            <p className="mt-3 text-sm font-medium">{email}</p>
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
          <ReviewSection
            action="/kasse?schritt=zahlung"
            icon={CreditCard}
            title="Zahlungsart"
          >
            <p className="mt-3 text-sm font-medium">
              {getOptionLabel(paymentMethods, selection.paymentMethodId)}
            </p>
          </ReviewSection>
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

      <section className="mt-4 rounded-2xl border bg-card p-5">
        <div className="flex items-center justify-between gap-4 border-b pb-4">
          <h2 className="text-sm font-semibold">Dein Warenkorb</h2>
          <span className="text-xs text-muted-foreground">
            {cart.items.reduce((total, item) => total + item.quantity, 0)}
            {" Artikel"}
          </span>
        </div>
        <div className="divide-y">
          {cart.items.map((item) => (
            <CartLineItem
              currency={cart.currency}
              editable={cart.editable}
              item={item}
              key={item.id}
              locale={cart.locale}
              returnTo="/kasse?schritt=bestaetigung"
            />
          ))}
        </div>
      </section>
    </>
  );
}
