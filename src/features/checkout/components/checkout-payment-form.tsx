"use client";

import {
  ArrowRight,
  Mail,
  MapPin,
  MessageSquareText,
  Package,
  WalletCards,
} from "lucide-react";
import type { Route } from "next";
import { useActionState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { AccountToast } from "@/features/customer-account/components/account-toast";
import { CheckoutAddressActions } from "@/features/checkout/components/checkout-address-actions";
import { CheckoutDeliveryAddress } from "@/features/checkout/components/checkout-delivery-address";
import type {
  CheckoutAddress,
  CheckoutActionState,
  CheckoutOption,
  CheckoutSelectableAddress,
} from "@/features/checkout/model/checkout";
import { saveCheckoutMethodSelection } from "@/features/checkout/server/actions";

const initialState: CheckoutActionState = { status: "idle" };

function EditableDetails({
  children,
  addHref,
  editHref,
  icon: Icon,
  label,
}: Readonly<{
  children: ReactNode;
  addHref?: Route;
  editHref: Route;
  icon: typeof Mail;
  label: string;
}>) {
  return (
    <section className="rounded-2xl border bg-secondary/35 px-5 py-4">
      <div className="relative flex items-center justify-between gap-4 pr-10">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <Icon aria-hidden="true" className="size-3.5 text-primary" />
          {label}
        </h2>
        <div className="absolute top-1/2 right-0 -translate-y-1/2">
          <CheckoutAddressActions
            addHref={addHref}
            editHref={editHref}
            label={label}
          />
        </div>
      </div>
      {children}
    </section>
  );
}

function MethodOptions({
  defaultValue,
  error,
  icon: Icon,
  legend,
  name,
  options,
}: Readonly<{
  defaultValue?: string;
  error?: string;
  icon: typeof Package;
  legend: string;
  name: "paymentMethodId" | "shippingMethodId";
  options: readonly CheckoutOption[];
}>) {
  return (
    <fieldset
      aria-describedby={error ? `${name}-error` : undefined}
      className="rounded-2xl bg-secondary/35 p-4 sm:p-5"
    >
      <legend className="sr-only">{legend}</legend>
      <div
        aria-hidden="true"
        className="flex items-center gap-3 text-base font-semibold tracking-[-0.03em]"
      >
        <Icon className="size-5 text-muted-foreground" strokeWidth={1.7} />
        {legend}
      </div>
      <div className="mt-3 grid gap-2.5">
        {options.map((option, index) => (
          <label
            className="flex min-h-15 cursor-pointer items-center gap-3 rounded-xl border border-border/75 bg-card px-4 py-3 transition-[border-color,box-shadow] has-checked:border-foreground/25 has-checked:shadow-sm hover:border-foreground/25 focus-within:ring-2 focus-within:ring-primary/30"
            key={option.id}
          >
            <input
              className="size-4 shrink-0 accent-primary"
              defaultChecked={
                option.id === defaultValue || (!defaultValue && index === 0)
              }
              name={name}
              required
              type="radio"
              value={option.id}
            />
            <span>
              <strong className="block text-sm font-semibold">
                {option.label}
              </strong>
              {option.description && (
                <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                  {option.description}
                </span>
              )}
            </span>
          </label>
        ))}
      </div>
      {error && (
        <p
          className="mt-2 text-xs leading-4 text-destructive"
          id={`${name}-error`}
          role="alert"
        >
          {error}
        </p>
      )}
    </fieldset>
  );
}

export function CheckoutPaymentForm({
  billingAddress,
  canAddBillingAddress,
  canAddDeliveryAddress,
  canEditDeliveryAddress,
  deliveryAddress,
  deliveryAddresses,
  email,
  paymentMethods,
  selectedPaymentMethodId,
  selectedShippingMethodId,
  selectedDeliveryAddressId,
  shippingMethods,
}: Readonly<{
  billingAddress?: CheckoutAddress;
  canAddBillingAddress: boolean;
  canAddDeliveryAddress: boolean;
  canEditDeliveryAddress: boolean;
  deliveryAddress?: CheckoutAddress;
  deliveryAddresses: readonly CheckoutSelectableAddress[];
  email: string;
  paymentMethods: readonly CheckoutOption[];
  selectedPaymentMethodId?: string;
  selectedShippingMethodId?: string;
  selectedDeliveryAddressId?: string;
  shippingMethods: readonly CheckoutOption[];
}>) {
  const [state, formAction, pending] = useActionState(
    saveCheckoutMethodSelection,
    initialState,
  );
  const unavailable =
    paymentMethods.length === 0 || shippingMethods.length === 0;
  const fieldErrors = state.fieldErrors ?? {};

  return (
    <form action={formAction} id="checkout-payment-form">
      <AccountToast
        description={state.message}
        id={`checkout-payment-${state.status}`}
        title={
          state.status === "invalid"
            ? "Auswahl prüfen"
            : state.status === "error"
              ? "Bestellung nicht möglich"
              : undefined
        }
        trigger={state}
        type="error"
      />

      <section className="rounded-3xl border bg-card p-5 shadow-[0_24px_70px_-58px_rgba(21,21,19,0.7)] sm:p-7">
        {billingAddress && (
          <div className="mb-3">
            <EditableDetails
              addHref={
                canAddBillingAddress
                  ? "/kasse?schritt=neue-rechnungsadresse"
                  : undefined
              }
              editHref="/kasse?schritt=adresse"
              icon={MapPin}
              label="Rechnungsadresse"
            >
              <address className="mt-2 text-sm leading-6 not-italic text-muted-foreground">
                <strong className="block font-semibold text-foreground">
                  {billingAddress.firstName} {billingAddress.lastName}
                </strong>
                <span className="block">{billingAddress.street}</span>
                <span className="block">
                  {billingAddress.zipcode} {billingAddress.city}
                </span>
              </address>
            </EditableDetails>
          </div>
        )}
        {deliveryAddress && (
          <div className="mb-3">
            <CheckoutDeliveryAddress
              address={deliveryAddress}
              addresses={deliveryAddresses}
              canAdd={canAddDeliveryAddress}
              canEdit={canEditDeliveryAddress}
              selectedAddressId={selectedDeliveryAddressId}
            />
          </div>
        )}
        <div className="mb-8">
          <EditableDetails
            editHref="/kasse?schritt=email"
            icon={Mail}
            label="E-Mail-Adresse"
          >
            <p className="mt-2 text-sm font-medium">{email}</p>
          </EditableDetails>
        </div>
        <div className="grid gap-4">
          <MethodOptions
            defaultValue={selectedShippingMethodId}
            error={fieldErrors.shippingMethodId}
            icon={Package}
            legend="Versandart"
            name="shippingMethodId"
            options={shippingMethods}
          />
          <div>
            <MethodOptions
              defaultValue={selectedPaymentMethodId}
              error={fieldErrors.paymentMethodId}
              icon={WalletCards}
              legend="Zahlungsart"
              name="paymentMethodId"
              options={paymentMethods}
            />
          </div>
          <div className="border-t pt-6">
            <label
              className="flex items-center gap-3 text-sm font-semibold"
              htmlFor="customerComment"
            >
              <MessageSquareText
                aria-hidden="true"
                className="size-4 text-primary"
              />
              Hinweis zur Bestellung (optional)
            </label>
            <textarea
              className="mt-3 min-h-28 w-full resize-y rounded-xl border bg-background p-4 text-sm outline-none focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/15"
              id="customerComment"
              maxLength={1000}
              name="customerComment"
              placeholder="Zum Beispiel: Bitte vor der Lieferung anrufen."
            />
          </div>
        </div>

        {unavailable && (
          <p className="mt-7 rounded-2xl border border-destructive/25 bg-destructive/5 p-4 text-sm leading-6 text-destructive">
            Für diese Bestellung ist derzeit keine passende Versand- oder
            Zahlungsart verfügbar.
          </p>
        )}

        <Button
          className="hidden"
          disabled={pending || unavailable}
          size="lg"
          type="submit"
        >
          {pending
            ? "Auswahl wird gespeichert …"
            : "Weiter zur Bestellübersicht"}
          <ArrowRight aria-hidden="true" />
        </Button>
      </section>
    </form>
  );
}
