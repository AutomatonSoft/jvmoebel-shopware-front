import { LockKeyhole, PackageCheck, RotateCcw } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { CheckoutCartPreview } from "@/features/checkout/components/checkout-cart-preview";
import { CheckoutEmailForm } from "@/features/checkout/components/checkout-email-form";
import { GuestCheckoutFlow } from "@/features/checkout/components/guest-checkout-flow";
import { CheckoutPaymentForm } from "@/features/checkout/components/checkout-payment-form";
import { CheckoutProgress } from "@/features/checkout/components/checkout-progress";
import { CheckoutReview } from "@/features/checkout/components/checkout-review";
import {
  CheckoutSummary,
  type CheckoutSummaryAction,
} from "@/features/checkout/components/checkout-summary";
import { CustomerCheckoutDeliveryAddressForm } from "@/features/checkout/components/customer-checkout-delivery-address-form";
import { CustomerCheckoutDeliveryAddressEditForm } from "@/features/checkout/components/customer-checkout-delivery-address-edit-form";
import { CustomerCheckoutAddressForm } from "@/features/checkout/components/customer-checkout-address-form";
import type { CheckoutPageData } from "@/features/checkout/model/checkout";

export function CheckoutPage({
  addressStep,
  confirmationStep,
  data,
  deliveryAddressStep,
  emailStep,
  newDeliveryAddressStep,
  paymentError,
  returnToConfirmation,
}: Readonly<{
  addressStep: boolean;
  confirmationStep: boolean;
  data: CheckoutPageData;
  deliveryAddressStep: boolean;
  emailStep: boolean;
  newDeliveryAddressStep: boolean;
  paymentError: boolean;
  returnToConfirmation: boolean;
}>) {
  const editBackHref: Route = returnToConfirmation
    ? "/kasse?schritt=bestaetigung"
    : "/kasse?schritt=zahlung";
  const showNewDeliveryAddressStep =
    newDeliveryAddressStep && !data.customer?.guest;
  const showDeliveryAddressStep =
    deliveryAddressStep && Boolean(data.customer?.shippingAddress);
  const showEmailStep = emailStep && Boolean(data.customer);
  const hasConfirmationSelection =
    confirmationStep &&
    Boolean(data.selection) &&
    data.options.paymentMethods.some(
      (method) => method.id === data.selection?.paymentMethodId,
    ) &&
    data.options.shippingMethods.some(
      (method) => method.id === data.selection?.shippingMethodId,
    );
  const step = hasConfirmationSelection
    ? "confirmation"
    : data.customer?.addressComplete &&
        !addressStep &&
        !showDeliveryAddressStep &&
        !showEmailStep &&
        !showNewDeliveryAddressStep
      ? "payment"
      : "address";
  const summaryAction: CheckoutSummaryAction = !data.customer
    ? {
        formId: "guest-checkout-form",
        label: "Weiter",
      }
    : showNewDeliveryAddressStep
      ? {
          formId: "customer-checkout-delivery-address-form",
          label: "Lieferadresse verwenden",
        }
      : showDeliveryAddressStep
        ? {
            formId: "customer-checkout-delivery-address-edit-form",
            label: "Lieferadresse speichern",
          }
        : showEmailStep
          ? {
              formId: "checkout-email-form",
              label: "E-Mail-Adresse speichern",
            }
          : step === "address"
            ? {
                formId: "customer-checkout-address-form",
                label:
                  addressStep && data.customer.addressComplete
                    ? "Änderungen speichern"
                    : "Weiter zu Versand und Zahlung",
              }
            : hasConfirmationSelection
              ? {
                  formId: "checkout-order-review-form",
                  label: "Zahlungspflichtig bestellen",
                  requiresTerms: true,
                }
              : {
                  disabled:
                    data.options.paymentMethods.length === 0 ||
                    data.options.shippingMethods.length === 0,
                  formId: "checkout-payment-form",
                  label: "Weiter zur Bestellübersicht",
                };

  return (
    <main className="flex-1 bg-background">
      <section className="border-b bg-card">
        <Container className="flex flex-wrap items-center justify-between gap-4 py-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-2 font-medium text-foreground">
            <LockKeyhole aria-hidden="true" className="size-4 text-primary" />
            Sicherer Bereich
          </span>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="flex items-center gap-2">
              <RotateCcw aria-hidden="true" className="size-4" />
              14 Tage Widerrufsrecht
            </span>
            <span className="flex items-center gap-2">
              <PackageCheck aria-hidden="true" className="size-4" />
              Persönlicher Lieferservice
            </span>
            <Link
              className="font-semibold text-foreground hover:text-primary"
              href="/warenkorb"
            >
              Zum Warenkorb
            </Link>
          </div>
        </Container>
      </section>

      <Container className="py-8 sm:py-12">
        <header className="flex flex-col gap-6 border-b pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
              Checkout
            </p>
            <h1 className="mt-3 text-4xl leading-none font-semibold tracking-[-0.05em] sm:text-5xl">
              Kasse
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              {data.customer
                ? `Bestellung für ${data.customer.firstName} ${data.customer.lastName}`
                : "Schnell und sicher ohne Kundenkonto bestellen"}
            </p>
          </div>
          <CheckoutProgress step={step} />
        </header>

        {paymentError && (
          <p className="mt-8 rounded-2xl border border-destructive/25 bg-destructive/5 p-4 text-sm leading-6 text-destructive">
            Die Zahlung konnte nicht abgeschlossen werden. Ihre Bestellung ist
            gespeichert; wählen Sie die Zahlungsart bitte erneut.
          </p>
        )}

        {!data.customer ? (
          <GuestCheckoutFlow
            cart={data.cart}
            countries={data.options.countries}
            paymentMethods={data.options.paymentMethods}
            shippingMethods={data.options.shippingMethods}
          />
        ) : (
          <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_23rem] xl:gap-12">
            <div>
              {showNewDeliveryAddressStep ? (
                <CustomerCheckoutDeliveryAddressForm
                  backHref={editBackHref}
                  countries={data.options.countries}
                  customer={data.customer}
                />
              ) : showDeliveryAddressStep && data.customer.shippingAddress ? (
                <CustomerCheckoutDeliveryAddressEditForm
                  address={data.customer.shippingAddress}
                  backHref={editBackHref}
                  countries={data.options.countries}
                />
              ) : showEmailStep ? (
                <CheckoutEmailForm
                  backHref={editBackHref}
                  email={data.customer.email}
                  guest={data.customer.guest}
                />
              ) : step === "address" ? (
                <CustomerCheckoutAddressForm
                  backHref={
                    data.customer.addressComplete ? editBackHref : undefined
                  }
                  countries={data.options.countries}
                  customer={data.customer}
                />
              ) : hasConfirmationSelection &&
                data.customer.billingAddress &&
                (data.customer.shippingAddress ??
                  data.customer.billingAddress) &&
                data.selection ? (
                <CheckoutReview
                  billingAddress={data.customer.billingAddress}
                  cart={data.cart}
                  deliveryAddress={
                    data.customer.shippingAddress ??
                    data.customer.billingAddress
                  }
                  paymentMethods={data.options.paymentMethods}
                  selection={data.selection}
                  shippingMethods={data.options.shippingMethods}
                />
              ) : (
                <CheckoutPaymentForm
                  billingAddress={data.customer.billingAddress}
                  canAddDeliveryAddress={!data.customer.guest}
                  canEditDeliveryAddress={Boolean(
                    data.customer.shippingAddress,
                  )}
                  deliveryAddress={
                    data.customer.shippingAddress ??
                    data.customer.billingAddress
                  }
                  deliveryAddresses={data.customer.shippingAddresses}
                  email={data.customer.email}
                  paymentMethods={data.options.paymentMethods}
                  selectedPaymentMethodId={data.options.selectedPaymentMethodId}
                  selectedShippingMethodId={
                    data.options.selectedShippingMethodId
                  }
                  selectedDeliveryAddressId={
                    data.customer.activeShippingAddressId
                  }
                  shippingMethods={data.options.shippingMethods}
                />
              )}
              {!hasConfirmationSelection && (
                <CheckoutCartPreview cart={data.cart} />
              )}
            </div>
            <CheckoutSummary action={summaryAction} cart={data.cart} />
          </div>
        )}
      </Container>
    </main>
  );
}
